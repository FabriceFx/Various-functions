/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Similarité Textuelle — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le taux de similarité entre deux chaînes de caractères
 *    basé sur la distance de Levenshtein.
 *
 *  Fonctions exposées :
 *    • TEXT_SIMILARITY(texte1, texte2)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule le pourcentage de similarité entre deux textes (0% à 100%).
 * Basé sur la distance de Levenshtein.
 *
 * @param {string} texte1           Première chaîne.
 * @param {string} texte2           Seconde chaîne.
 * @return {number}                 Taux de similarité (entre 0 et 1).
 * @customfunction
 *
 *   =TEXT_SIMILARITY("Google Sheets"; "Google Shet") → 0.92
 */
function TEXT_SIMILARITY(texte1, texte2) {
  if (texte1 == null || texte2 == null) return 0;
  
  const s1 = String(texte1).toLowerCase().trim();
  const s2 = String(texte2).toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  const distance = _levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  
  return (maxLength - distance) / maxLength;
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes.
 * @private
 */
function _levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
