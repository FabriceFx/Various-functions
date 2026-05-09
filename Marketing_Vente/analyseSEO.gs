/** @OnlyCurrentDoc */

/**
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
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule la densité d'un mot-clé dans un texte.
 * Supporte le traitement par lot.
 *
 * @param {string|Array<Array<any>>} input  Le texte à analyser ou une plage.
 * @param {string} motCle                   Le mot ou expression à chercher.
 * @return {number|Array<Array<number>>}    Densité en pourcentage (ex: 0.02 pour 2%).
 * @customfunction
 *
 * @example
 *   =SEO_MOTS_CLES_DENSITE(A2; "Google Sheets")
 */
function SEO_MOTS_CLES_DENSITE(input, motCle) {
  return batchProcess(input, (val) => {
    if (!val || !motCle) return 0;

    const t = String(val).toLowerCase();
    const keyword = String(motCle).toLowerCase();

    // On compte le nombre total de mots (approximation simple)
    const words = t.match(/[\w\u00C0-\u00FF]+/g) || [];
    if (words.length === 0) return 0;

    // On compte les occurrences du mot clé (exact ou expression)
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedKeyword, 'g');
    const matches = t.match(regex) || [];

    // Densité = (Occurrences / Nombre de mots)
    return Math.round((matches.length / words.length) * 1000) / 1000;
  });
}
