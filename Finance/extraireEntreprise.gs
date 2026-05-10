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
  
  // Utilisation de l'API Sirene (V3 via Etalab proxy)
  const url = `https://entreprise.data.gouv.fr/api/sirene/v3/${type}/${cleanId}`;
  
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      const result = isSiret ? data.etablissement : data.unite_legale;
      
      // On stocke en cache pour 6h
      cache.put(cacheKey, JSON.stringify(result), CONFIG.CACHE_TTL);
      return result;
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
 * @param {string} [info="NOM"] "NOM", "ADRESSE", "VILLE", "CP", "APE", "STATUT".
 * @return {string|Array<Array<string>>}        L'information demandée ou message d'erreur.
 * @customfunction
 *
 *   =EXTRAIRE_ENTREPRISE("123456789")             → "NOM DE L'ENTREPRISE"
 *   =EXTRAIRE_ENTREPRISE("12345678900012"; "VILLE") → "PARIS"
 */
function EXTRAIRE_ENTREPRISE(identifiant, info = "NOM") {
  const typeInfo = String(info).trim().toUpperCase();

  return BATCH_PROCESS(identifiant, (val) => {
    if (val == null || String(val).trim() === "") return "";
    
    const data = _fetchSireneData(val);
    if (!data) return "Erreur: Identifiant non trouvé";

    // Navigation dans la structure de l'API Sirene V3
    // Note: La structure diffère légèrement entre SIREN et SIRET
    const uniteLegale = data.unite_legale || data;
    const etablissement = data.unite_legale ? data : null;

    const nom = uniteLegale.denomination_unite_legale || uniteLegale.nom_raison_sociale || 
                (uniteLegale.nom ? `${uniteLegale.nom} ${uniteLegale.prenom || ""}` : "Inconnu");

    switch (typeInfo) {
      case "NOM": return nom;
      case "APE": return uniteLegale.activite_principale_unite_legale || uniteLegale.activite_principale || "N/A";
      case "VILLE": 
        return etablissement ? etablissement.libelle_commune : "N/A (Utilisez un SIRET)";
      case "CP": 
        return etablissement ? etablissement.code_postal : "N/A (Utilisez un SIRET)";
      case "ADRESSE":
        if (!etablissement) return "N/A (Utilisez un SIRET)";
        return `${etablissement.numero_voie || ""} ${etablissement.type_voie || ""} ${etablissement.libelle_voie || ""}, ${etablissement.code_postal} ${etablissement.libelle_commune}`.trim();
      case "STATUT":
        return uniteLegale.etat_administratif_unite_legale === "A" ? "ACTIF" : "INACTIF";
      default:
        return nom;
    }
  });
}
