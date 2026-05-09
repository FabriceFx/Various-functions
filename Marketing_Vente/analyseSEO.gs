/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Analyse Sémantique & SEO — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Ensemble de fonctions pour analyser le contenu textuel sous l'angle SEO
 *    et GEO (Generative Engine Optimization).
 *
 *  Fonctions exposées :
 *    • SEO_MOTS_CLES_DENSITE(texte, motCle)
 *    • SEO_LISIBILITE_FLESCH(texte)
 *    • GEO_STRUCTURE_CHECK(url_ou_html)
 *    • GEO_SCHEMA_DETECTOR(url)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule l'indice de lisibilité de Flesch (adapté au français).
 * Plus le score est élevé (proche de 100), plus le texte est facile à lire.
 *
 * @param {string|Array<Array<any>>} input Le texte à analyser ou une plage.
 * @return {number|Array<Array<number>>} Score de lisibilité (0 à 100+).
 * @customfunction
 */
function SEO_LISIBILITE_FLESCH(input) {
  return batchProcess(input, (val) => {
...
    return Math.round(score * 10) / 10;
  });
}

/**
 * Approximation du nombre de syllabes pour un mot français.
 * @private
 */
function _compterSyllabesFR(mot) {
...
  return voyelles ? Math.max(1, voyelles.length) : 1;
}

/**
 * Calcule la densité d'un mot-clé dans un texte.
 *
 * @param {string|Array<Array<any>>} input Le texte à analyser ou une plage.
 * @param {string} motCle Le mot ou expression à chercher.
 * @return {number|Array<Array<number>>} Densité en pourcentage (ex: 0.02 pour 2%).
 * @customfunction
 */
function SEO_MOTS_CLES_DENSITE(input, motCle) {
...
    return Math.round((matches.length / words.length) * 1000) / 1000;
  });
}

/**
 * Vérifie la structure sémantique d'une page (H1-H3, listes) pour le GEO.
 *
 * @param {string} urlOrHtml URL ou contenu HTML brut.
 * @return {string} Résumé de l'analyse structurelle.
 * @customfunction
 */
function GEO_STRUCTURE_CHECK(urlOrHtml) {
...
  return `H1: ${h1} | H2: ${h2} | H3: ${h3} | Listes: ${lists} | [${score}]`;
}

/**
 * Détecte la présence de schémas JSON-LD (Schema.org) dans une page.
 *
 * @param {string} url URL de la page à analyser.
 * @return {string} Liste des types de schémas détectés.
 * @customfunction
 */
function GEO_SCHEMA_DETECTOR(url) {
  if (!url || !url.startsWith('http')) return "⚠️ URL invalide";
  
  try {
    const html = _fetchWithBackoff(url).getContentText();
    const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    const schemas = [];

    while ((match = regex.exec(html)) !== null) {
      try {
        const json = JSON.parse(match[1]);
        const types = Array.isArray(json) ? json.map(j => j["@type"]) : [json["@type"]];
        schemas.push(...types.filter(t => t));
      } catch (e) { /* Ignorer JSON mal formé */ }
    }

    return schemas.length > 0 
      ? "Schemas: " + [...new Set(schemas)].join(", ") 
      : "❌ Aucun JSON-LD détecté";
  } catch (e) {
    return "⚠️ Erreur d'accès";
  }
}
