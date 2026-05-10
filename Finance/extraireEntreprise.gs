/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction Entreprise — Version 3.0 (Official API Standards)
 * ────────────────────────────────────────────────────────────────────────────
 *  Implémentation basée sur la documentation officielle :
 *  - Support complet SIREN / SIRET (matching_etablissements)
 *  - Utilisation de l'adresse pré-formatée
 *  - Optimisation des paramètres de requête (per_page=1)
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
    // Paramètres optimisés : 1 seul résultat pour plus de rapidité
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${cleanId}&page=1&per_page=1`;
    const response = UrlFetchApp.fetch(url, { 
      muteHttpExceptions: true,
      headers: { "User-Agent": "FF_Library/3.0" }
    });

    if (response.getResponseCode() === 200) {
      const json = JSON.parse(response.getContentText());
      
      if (json.results && json.results.length > 0) {
        const company = json.results[0];
        
        /**
         * LOGIQUE DE SÉLECTION DU SITE :
         * 1. Si on a cherché un SIRET, on regarde dans matching_etablissements
         * 2. Sinon, on prend le siège social (siege)
         */
        let site = company.siege || {};
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
          adresse: site.adresse || "N/A" // Utilisation de l'adresse pré-formatée de l'API
        };
        
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    Logger.log("Erreur API GOUV : " + e);
  }

  // 2. Source de Secours : Opendatasoft (si Gouv est en panne)
  try {
    const url = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=sirene-v3@public&q=${cleanId}`;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() === 200) {
      const json = JSON.parse(response.getContentText());
      if (json.records && json.records.length > 0) {
        const f = json.records[0].fields;
        const normalized = {
          nom: f.denominationunitelegale || f.nomunitelegale || f.nom_raison_sociale || "Inconnu",
          ape: f.activiteprincipaleunitelegale || "N/A",
          statut: f.etatadministratifunitelegale === "A" ? "ACTIF" : "INACTIF",
          cp: f.codepostaletablissement || "N/A",
          ville: f.libellecommuneetablissement || "N/A",
          adresse: f.adresseetablissement || "N/A"
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    Logger.log("Erreur fallback Opendatasoft : " + e);
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
 * Test de diagnostic final.
 */
function TEST_ENTREPRISE_V3() {
  const testSiren = "552100554"; // Carrefour
  const testSiret = "55210055400013"; // Un siège spécifique
  
  Logger.log("--- TEST SIREN ---");
  Logger.log(JSON.stringify(_fetchCompanyData(testSiren), null, 2));
  
  Logger.log("--- TEST SIRET ---");
  Logger.log(JSON.stringify(_fetchCompanyData(testSiret), null, 2));
}