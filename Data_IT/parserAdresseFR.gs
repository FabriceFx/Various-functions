/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Analyseur d'Adresse Française — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Prend une adresse française brute sur une ligne et la découpe en
 *    ses composants : Numéro, Voie, Code Postal et Ville.
 *    Renvoie un tableau qui se déploie sur plusieurs colonnes.
 *
 *  Fonctions exposées :
 *    • parserAdresseFR(adresse)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Découpe une adresse française en Numéro, Voie, Code Postal et Ville.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} adresse L'adresse ou plage.
 * @return {Array<Array<string>>}                Tableau [Numéro, Voie, Code Postal, Ville].
 * @customfunction
 *
 *   =parserAdresseFR("8 rue de la paix 75002 Paris")
 *   =parserAdresseFR(A2:A100)
 */
function parserAdresseFR(adresse) {
  return batchProcess(adresse, (val) => {
    if (!val || String(val).trim() === "") return ["", "", "", ""];

    let chaine = String(val).trim();
    let numero = "", voie = "", codePostal = "", ville = "";

    const regexCP = /\b(?:2[A|B]|0[1-9]|[1-8]\d|9[0-5]|9[7-8])\d{3}\b/;
    const matchCP = chaine.match(regexCP);

    if (matchCP) {
      codePostal = matchCP[0];
      const indexCP = chaine.indexOf(codePostal);
      ville = chaine.substring(indexCP + codePostal.length).replace(/^[,\s-]+/, "").trim();
      chaine = chaine.substring(0, indexCP).trim();
    }

    const regexNum = /^\s*(\d+)(?:\s*(bis|ter|quater|quinquies|[A-Z]))?\b/i;
    const matchNum = chaine.match(regexNum);

    if (matchNum) {
      numero = matchNum[0].trim();
      voie = chaine.substring(matchNum[0].length).replace(/^[,\s-]+/, "").trim();
    } else {
      voie = chaine.replace(/^[,\s-]+/, "").trim();
    }

    return [numero, voie, codePostal, ville];
  });
}

/**
 * Normalise une adresse française via l'API officielle (adresse.data.gouv.fr).
 * Version "Premium" beaucoup plus robuste. Supporte le batching et le cache.
 *
 * @param {string|Array<Array<string>>} adresse L'adresse ou une plage de cellules.
 * @return {Array<Array<string>>}                Tableau de [Adresse complète, Score de confiance].
 * @customfunction
 *
 *   =NORMALISER_ADRESSE_FR("8 r de la paix pari") → "8 Rue de la Paix, 75002 Paris"
 */
function NORMALISER_ADRESSE_FR(adresse) {
  const cache = CacheService.getScriptCache();

  return batchProcess(adresse, (val) => {
    if (!val || String(val).trim() === "") return ["", 0];

    const clean = String(val).trim();
    const cacheKey = "addr_" + Utilities.base64Encode(clean).substring(0, 200);
    const cached = cache.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(clean)}&limit=1`;
      const response = _fetchWithBackoff(url, { muteHttpExceptions: true });
      const data = JSON.parse(response.getContentText());

      if (data.features && data.features.length > 0) {
        const feat = data.features[0];
        const res = [feat.properties.label, Math.round(feat.properties.score * 100) / 100];
        cache.put(cacheKey, JSON.stringify(res), CONFIG.CACHE_TTL);
        return res;
      }
      return ["Adresse introuvable", 0];
    } catch (e) {
      return ["Erreur: Quota API atteint ou connexion impossible", 0];
    }
  });
}
