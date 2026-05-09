/*
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
 * @OnlyCurrentDoc
 */

/**
 * Calcule l'entropie de Shannon d'une chaîne de caractères (en bits).
 * Plus le score est élevé, plus la chaîne est complexe/aléatoire.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte La chaîne ou plage à analyser.
 * @return {number|Array<Array<number>>}       Le score d'entropie ou tableau de résultats.
 * @customfunction
 *
 *   =ENTROPY_SCORE("P@ssw0rd123!")
 *   =ENTROPY_SCORE(A2:A100)
 */
function ENTROPY_SCORE(texte) {
  return BATCH_PROCESS(texte, (val) => {
    if (!val || String(val).length === 0) return 0;

    const chaine = String(val);
    const freq = {};
    
    for (let i = 0; i < chaine.length; i++) {
      const char = chaine[i];
      freq[char] = (freq[char] || 0) + 1;
    }

    let entropie = 0;
    const len = chaine.length;

    for (const char in freq) {
      const p = freq[char] / len;
      entropie -= p * Math.log2(p);
    }

    return Math.round(entropie * 100) / 100;
  });
}
