/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction de Données SIRENE (API Gouv) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-10
 *  Licence : MIT
 *
 *  Description :
 *    Interroge l'API Sirene officielle pour récupérer les informations
 *    légales d'une entreprise à partir de son SIREN ou SIRET.
 *
 *  Fonctions exposées :
 *    • EXTRAIRE_ENTREPRISE(identifiant, [info])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Interroge l'API Sirene avec mise en cache.
 * @private
 */
function _fetchSireneData(id) {
  const cleanId = String(id).replace(/\D/g, "");
  const cacheKey = "SIRENE_" + cleanId;
  const cache = CacheService.getScriptCache();
  
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const isSiret = cleanId.length === 14;
  const type = isSiret ? "siret" : "siren";
  
  // Utilisation de l'API Recherche Entreprises (plus stable et moderne)
  const url = `https://recherche-entreprises.api.gouv.fr/search?q=${cleanId}`;
  
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        // On stocke en cache pour 6h
        cache.put(cacheKey, JSON.stringify(result), CONFIG.CACHE_TTL);
        return result;
      }
    }
  } catch (e) {
    console.error("Erreur API Sirene: " + e.message);
  }
  return null;
}

/**
 * Récupère les informations d'une entreprise via son SIREN ou SIRET.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} identifiant SIREN (9 chif.) ou SIRET (14 chif.).
 * @param {string} [info="NOM"] "NOM", "ADRESSE", "VILLE", "CP", "APE", "STATUT" ou "GLOBAL" (toutes les infos).
 * @return {string|Array<Array<string>>}        L'information demandée ou message d'erreur.
 * @customfunction
 *
 *   =EXTRAIRE_ENTREPRISE("123456789")             → "NOM DE L'ENTREPRISE"
 *   =EXTRAIRE_ENTREPRISE("12345678900012"; "GLOBAL") → [Nom | Adresse | CP | Ville | APE | Statut]
 */
function EXTRAIRE_ENTREPRISE(identifiant, info = "NOM") {
  const typeInfo = String(info).trim().toUpperCase();

  return BATCH_PROCESS(identifiant, (val) => {
    if (val == null || String(val).trim() === "") return "";
    
    const data = _fetchSireneData(val);
    if (!data) return "Erreur: Identifiant non trouvé";

    const nom = data.nom_complet || "Inconnu";
    const ape = data.activite_principale || "N/A";
    const statut = data.etat_administratif === "A" ? "ACTIF" : "INACTIF";
    
    const siege = data.siege || {};
    const cp = siege.code_postal || "N/A";
    const ville = siege.libelle_commune || "N/A";
    const adresse = siege.adresse || "N/A";

    switch (typeInfo) {
      case "NOM": return nom;
      case "APE": return ape;
      case "VILLE": return ville;
      case "CP": return cp;
      case "ADRESSE": return adresse;
      case "STATUT": return statut;
      case "GLOBAL":
        return [[nom, adresse, cp, ville, ape, statut]];
      default:
        return nom;
    }
  });
}
