/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction Entreprise — Version 3.1 (Multi-Source Stabilisée)
 * ────────────────────────────────────────────────────────────────────────────
 *  - Source 1 : Recherche Entreprises (Gouv.fr)
 *  - Source 2 (Fallback) : Opendatasoft (economicref-france-sirene-v3)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Moteur de récupération multi-source avec circuit-breaker.
 * @private
 */
function _fetchCompanyData(id) {
  const cleanId = String(id).replace(/\D/g, "");
  if (!cleanId) return null;

  const cacheKey = "CORP_DATA_V3_" + cleanId;
  const cache = CacheService.getScriptCache();

  try {
    const cached = cache.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    Logger.log("Erreur cache : " + e);
  }

  // 1. SOURCE PRINCIPALE : GOUV.FR
  try {
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${cleanId}`;
    const response = UrlFetchApp.fetch(url, { 
      muteHttpExceptions: true,
      headers: { "User-Agent": "FF_Library/3.1" }
    });

    const code = response.getResponseCode();
    Logger.log(`[Source Gouv] Code: ${code}`);

    if (code === 200) {
      const json = JSON.parse(response.getContentText());
      if (json.results && json.results.length > 0) {
        const company = json.results[0];
        let site = company.siege || company.etablissement_siege || {};
        
        // Match SIRET spécifique
        if (cleanId.length === 14 && company.matching_etablissements) {
          const match = company.matching_etablissements.find(e => e.siret === cleanId);
          if (match) site = match;
        }

        const normalized = {
          nom: company.nom_complet || company.nom_raison_sociale || "Inconnu",
          ape: site.activite_principale || company.activite_principale || "N/A",
          statut: (site.etat_administratif || company.etat_administratif) === "A" ? "ACTIF" : "INACTIF",
          cp: site.code_postal || "N/A",
          ville: site.libelle_commune || "N/A",
          adresse: site.adresse || "N/A"
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    Logger.log("Échec Source Gouv: " + e.message);
  }

  // 2. SOURCE DE SECOURS : OPENDATASOFT (Corrected Dataset ID)
  try {
    const url = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=economicref-france-sirene-v3&q=${cleanId}`;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = response.getResponseCode();
    Logger.log(`[Source Secours] Code: ${code}`);

    if (code === 200) {
      const json = JSON.parse(response.getContentText());
      if (json.records && json.records.length > 0) {
        const f = json.records[0].fields;
        
        // Reconstitution du nom (gère les entreprises individuelles)
        const nom = f.denominationunitelegale || 
                    (f.nomunitelegale ? `${f.nomunitelegale} ${f.prenom1unitelegale || ""}` : "") || 
                    f.nom_raison_sociale || "Inconnu";
        
        const adr = [f.numerovoieetablissement, f.typevoieetablissement, f.libellevoieetablissement].filter(Boolean).join(" ");

        const normalized = {
          nom: nom.trim(),
          ape: f.activiteprincipaleunitelegale || "N/A",
          statut: f.etatadministratifunitelegale === "A" ? "ACTIF" : "INACTIF",
          cp: f.codepostaletablissement || "N/A",
          ville: f.libellecommuneetablissement || "N/A",
          adresse: adr || f.adresseetablissement || "N/A"
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    Logger.log("Échec Source Secours: " + e.message);
  }

  return null;
}

/**
 * Récupère les informations d'une entreprise via son SIREN ou SIRET.
 * @customfunction
 */
function EXTRAIRE_ENTREPRISE(identifiant, info = "NOM") {
  const typeInfo = (info || "NOM").toString().trim().toUpperCase();

  return BATCH_PROCESS(identifiant, (val) => {
    if (val == null || String(val).trim() === "") return "";
    const check = VALIDER_ENTREPRISE(val);
    if (String(check).startsWith("INVALIDE")) return "Erreur : " + check;

    const data = _fetchCompanyData(val);
    if (!data) return "Erreur : service indisponible (Sirene)";

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
 * Test de diagnostic multi-source.
 */
function TEST_ENTREPRISE_V3() {
  const siren = "552100554"; // Carrefour
  Logger.log("--- Lancement du Test Multi-Source ---");
  const res = _fetchCompanyData(siren);
  Logger.log("RÉSULTAT FINAL : " + JSON.stringify(res, null, 2));
}