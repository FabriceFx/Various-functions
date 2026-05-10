/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction de Données Entreprises (Multi-API) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 2.0 (Production Ready)
 *  Date    : 2026-05-10
 *  Licence : MIT
 *
 *  Description :
 *    Récupère les informations légales (SIRENE) via l'API Recherche Entreprises.
 *    Incorpore une validation de format, un cache performant et un fallback
 *    sur Opendatasoft en cas de panne des services de l'État.
 *
 *  Fonctions exposées :
 *    • EXTRAIRE_ENTREPRISE(identifiant, [info])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Moteur d'extraction multi-sources avec fallback.
 * @private
 */
function _fetchCompanyData(id) {
  const cleanId = String(id).replace(/\D/g, "");
  const cacheKey = "CORP_DATA_" + cleanId;
  const cache = CacheService.getScriptCache();
  
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 1. Source Principale : Recherche Entreprises (Gouv.fr)
  const urlGouv = `https://recherche-entreprises.api.gouv.fr/search?q=${cleanId}`;
  try {
    const resp = UrlFetchApp.fetch(urlGouv, { 
      muteHttpExceptions: true,
      headers: { "User-Agent": "FF_Library/2.0 (Comptabilite)" }
    });

    if (resp.getResponseCode() === 200) {
      const json = JSON.parse(resp.getContentText());
      if (json.results && json.results.length > 0) {
        const data = json.results[0];
        // Normalisation minimale pour le switch final
        const normalized = {
          nom: data.nom_complet || data.nom_raison_sociale,
          ape: data.activite_principale,
          statut: data.etat_administratif === "A" ? "ACTIF" : "INACTIF",
          cp: data.siege ? data.siege.code_postal : "N/A",
          ville: data.siege ? data.siege.libelle_commune : "N/A",
          adresse: data.siege ? data.siege.adresse : "N/A"
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    console.warn("Échec Source Gouv: " + e.message);
  }

  // 2. Source de Secours : Opendatasoft (si Gouv est en panne)
  const urlFallback = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=sirene-v3@public&q=${cleanId}`;
  try {
    const resp = UrlFetchApp.fetch(urlFallback, { muteHttpExceptions: true });
    if (resp.getResponseCode() === 200) {
      const json = JSON.parse(resp.getContentText());
      if (json.records && json.records.length > 0) {
        const f = json.records[0].fields;
        const normalized = {
          nom: f.denominationunitelegale || f.nomunitelegale || f.nom_raison_sociale,
          ape: f.activiteprincipaleunitelegale,
          statut: f.etatadministratifunitelegale === "A" ? "ACTIF" : "INACTIF",
          cp: f.codepostaletablissement,
          ville: f.libellecommuneetablissement,
          adresse: f.adresseetablissement || `${f.numerovoieetablissement || ""} ${f.typevoieetablissement || ""} ${f.libellevoieetablissement || ""}, ${f.codepostaletablissement} ${f.libellecommuneetablissement}`.trim()
        };
        cache.put(cacheKey, JSON.stringify(normalized), CONFIG.CACHE_TTL);
        return normalized;
      }
    }
  } catch (e) {
    console.error("Échec Total API: " + e.message);
  }

  return null;
}

/**
 * Récupère les informations d'une entreprise via son SIREN ou SIRET.
 * Valide d'abord le format via l'algorithme de Luhn.
 *
 * @param {string|number|Array<Array<any>>} identifiant SIREN ou SIRET.
 * @param {string} [info="NOM"] "NOM", "ADRESSE", "VILLE", "CP", "APE", "STATUT", "GLOBAL".
 * @return {string|Array<Array<string>>}        Information ou message d'erreur.
 * @customfunction
 */
function EXTRAIRE_ENTREPRISE(identifiant, info = "NOM") {
  const typeInfo = String(info).trim().toUpperCase();

  return BATCH_PROCESS(identifiant, (val) => {
    if (val == null || String(val).trim() === "") return "";

    // Validation préalable du format via notre module Finance
    const check = VALIDER_ENTREPRISE(val);
    if (String(check).startsWith("INVALIDE")) return "Erreur: " + check;

    const data = _fetchCompanyData(val);
    if (!data) return "Erreur: Non trouvé (API Indisponible)";

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
