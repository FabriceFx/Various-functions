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

  // Route de secours ultime via Opendatasoft (Miroir privé souvent disponible quand l'État est en panne)
  const url = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=sirene-v3@public&q=${cleanId}`;
  
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = response.getResponseCode();
    
    if (code === 200) {
      const data = JSON.parse(response.getContentText());
      if (data.records && data.records.length > 0) {
        const result = data.records[0].fields;
        cache.put(cacheKey, JSON.stringify(result), CONFIG.CACHE_TTL);
        return result;
      }
    } else {
      console.warn(`Serveur Opendatasoft indisponible (Code ${code})`);
    }
  } catch (e) {
    console.error(`Erreur réseau (Opendatasoft) : ${e.message}`);
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

    // Navigation dans la structure Opendatasoft (Champs aplatis)
    const nom = data.denominationunitelegale || data.nomunitelegale || data.nom_raison_sociale || "Inconnu";
    const ape = data.activiteprincipaleunitelegale || data.activite_principale || "N/A";
    const statut = (data.etatadministratifunitelegale === "A" || data.etat_administratif === "A") ? "ACTIF" : "INACTIF";
    
    const cp = data.codepostaletablissement || "N/A";
    const ville = data.libellecommuneetablissement || "N/A";
    const adresse = data.adresseetablissement || 
                    `${data.numerovoieetablissement || ""} ${data.typevoieetablissement || ""} ${data.libellevoieetablissement || ""}, ${cp} ${ville}`.trim();

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
