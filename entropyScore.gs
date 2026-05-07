/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Score d'Entropie — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule l'entropie de Shannon d'une chaîne de caractères pour
 *    mesurer sa complexité et son caractère aléatoire.
 *
 *  Fonctions exposées :
 *    • ENTROPY_SCORE(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule l'entropie de Shannon d'une chaîne de caractères (en bits).
 * Plus le score est élevé, plus la chaîne est complexe/aléatoire.
 *
 * @param {string} texte  La chaîne à analyser.
 * @return {number}       Le score d'entropie.
 * @customfunction
 *
 * @example
 *   =ENTROPY_SCORE("P@ssw0rd123!")
 */
function ENTROPY_SCORE(texte) {
  if (!texte || String(texte).length === 0) return 0;

  const chaine = String(texte);
  const freq = {};
  
  // Calculer la fréquence de chaque caractère
  for (let i = 0; i < chaine.length; i++) {
    const char = chaine[i];
    freq[char] = (freq[char] || 0) + 1;
  }

  let entropie = 0;
  const len = chaine.length;

  // Appliquer la formule de Shannon: H = - sum(p * log2(p))
  for (const char in freq) {
    const p = freq[char] / len;
    entropie -= p * Math.log2(p);
  }

  return Math.round(entropie * 100) / 100;
}
