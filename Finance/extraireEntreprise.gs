/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction Entreprise — Version Finale Corrigée
 * ────────────────────────────────────────────────────────────────────────────
 *  Correction du mapping des champs API (siege vs etablissement_siege)
 *  et ajout des outils de diagnostic.
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
    Logger.log("Erreur cache : " + e);
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
      
      // LOG DE DIAGNOSTIC (Consulter : Exécutions > Logs)
      Logger.log("RÉPONSE API GOUV : " + JSON.stringify(json));

      if (json.results && json.results.length > 0) {
        const company = json.results[0];
        
        // Correction du mapping : siege ou etablissement_siege
        const s = company.siege || company.etablissement_siege || {};
        
        const adr = [s.numero_voie, s.type_voie, s.libelle_voie].filter(Boolean).join(" ");

        const normalized = {
          nom: company.nom_complet || company.nom_raison_sociale || "",
          ape: company.activite_principale || "",
          statut: company.etat_administratif === "A" ? "ACTIF" : "INACTIF",
          cp: s.code_postal || "",
          ville: s.libelle_commune || "",
          adresse: adr || s.adresse || ""
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    Logger.log("Erreur API GOUV : " + e);
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
          nom: f.denominationunitelegale || f.nomunitelegale || f.nom_raison_sociale || "",
          ape: f.activiteprincipaleunitelegale || "",
          statut: f.etatadministratifunitelegale === "A" ? "ACTIF" : "INACTIF",
          cp: f.codepostaletablissement || "",
          ville: f.libellecommuneetablissement || "",
          adresse: adr || f.adresseetablissement || ""
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    Logger.log("Erreur fallback : " + e);
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

/**
 * Fonction de test manuel (Consulter : Exécutions > Logs)
 */
function TEST_ENTREPRISE() {
  Logger.log(JSON.stringify(_fetchCompanyData("552100554"), null, 2));
}