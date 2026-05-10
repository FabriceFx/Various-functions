/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction Entreprise — Version Production Optimisée
 * ────────────────────────────────────────────────────────────────────────────
 *  Fusion de la logique de recherche exacte et de l'architecture de bibliothèque.
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Moteur de récupération multi-source (Gouv.fr + Fallback Opendatasoft)
 * @private
 */
function _fetchCompanyData(id) {
  const cleanId = String(id).replace(/\D/g, "");
  if (!cleanId) return null;

  const cacheKey = "CORP_DATA_" + cleanId;
  const cache = CacheService.getScriptCache();

  try {
    const cached = cache.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn("Erreur cache : " + e);
  }

  // 1. Source Principale : Recherche Entreprises (Gouv.fr)
  try {
    const url = "https://recherche-entreprises.api.gouv.fr/search?q=" + encodeURIComponent(cleanId);
    const response = UrlFetchApp.fetch(url, { 
      muteHttpExceptions: true,
      headers: { "User-Agent": "FF_Library/2.0" }
    });

    if (response.getResponseCode() === 200) {
      const json = JSON.parse(response.getContentText());
      if (json.results && json.results.length > 0) {
        // Recherche de correspondance exacte SIREN ou SIRET du siège
        const company = json.results.find(r => r.siren === cleanId || r.siege?.siret === cleanId) || json.results[0];
        const siege = company.siege || {};
        const adr = [siege.numero_voie, siege.type_voie, siege.libelle_voie].filter(Boolean).join(" ");

        const normalized = {
          nom: company.nom_complet || company.nom_raison_sociale || "Inconnu",
          ape: company.activite_principale || "N/A",
          statut: company.etat_administratif === "A" ? "ACTIF" : "INACTIF",
          cp: siege.code_postal || "N/A",
          ville: siege.libelle_commune || "N/A",
          adresse: adr || "N/A"
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    console.warn("Erreur API GOUV : " + e);
  }

  // 2. Source de Secours : Opendatasoft
  try {
    const url = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=sirene-v3@public&q=${cleanId}`;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() === 200) {
      const json = JSON.parse(response.getContentText());
      if (json.records && json.records.length > 0) {
        const f = json.records[0].fields;
        const adr = [f.numerovoieetablissement, f.typevoieetablissement, f.libellevoieetablissement].filter(Boolean).join(" ");
        const normalized = {
          nom: f.denominationunitelegale || f.nomunitelegale || f.nom_raison_sociale || "Inconnu",
          ape: f.activiteprincipaleunitelegale || "N/A",
          statut: f.etatadministratifunitelegale === "A" ? "ACTIF" : "INACTIF",
          cp: f.codepostaletablissement || "N/A",
          ville: f.libellecommuneetablissement || "N/A",
          adresse: adr || "N/A"
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    console.error("Erreur fallback : " + e);
  }

  return null;
}

/**
 * Récupère les informations d'une entreprise via son SIREN ou SIRET.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} identifiant SIREN ou SIRET.
 * @param {string} [info="NOM"] "NOM", "ADRESSE", "VILLE", "CP", "APE", "STATUT", "GLOBAL".
 * @return {string|Array<Array<any>>} Information ou message d'erreur.
 * @customfunction
 */
function EXTRAIRE_ENTREPRISE(identifiant, info = "NOM") {
  const typeInfo = (info || "NOM").toString().trim().toUpperCase();

  return BATCH_PROCESS(identifiant, (val) => {
    if (val == null || String(val).trim() === "") return "";

    // Validation via le module Finance
    const check = VALIDER_ENTREPRISE(val);
    if (String(check).startsWith("INVALIDE")) return "Erreur : " + check;

    const data = _fetchCompanyData(val);
    if (!data) return "Erreur : entreprise introuvable";

    switch (typeInfo) {
      case "NOM": return data.nom;
      case "APE": return data.ape;
      case "VILLE": return data.ville;
      case "CP": return data.cp;
      case "ADRESSE": return data.adresse;
      case "STATUT": return data.statut;
      case "GLOBAL": return [[data.nom, data.adresse, data.cp, data.ville, data.ape, data.statut]];
      default: return data.nom;
    }
  });
}