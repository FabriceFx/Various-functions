/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Estimateur de Temps de Lecture — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le temps de lecture estimé d'un texte basé sur
 *    une vitesse moyenne de lecture (ex: 250 mots par minute).
 *
 *  Fonctions exposées :
 *    • ESTIMER_LECTURE(texte, [motsParMinute])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Estime le temps de lecture d'un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte  Le contenu ou plage.
 * @param {number} [motsParMinute=250] Vitesse de lecture (250 mpm en moyenne).
 * @return {string|Array<Array<string>>}       Temps estimé ou tableau de résultats.
 * @customfunction
 *
 * @example
 *   =ESTIMER_LECTURE(A2)
 *   =ESTIMER_LECTURE(A2:A100)
 */
function ESTIMER_LECTURE(texte, motsParMinute = 250) {
  return batchProcess(texte, (val) => {
    if (!val || String(val).trim() === "") return "0 min";

    const chaine = String(val).trim();
    const nombreMots = chaine.split(/\s+/).length;

    const minutes = Math.ceil(nombreMots / parseInt(motsParMinute, 10));

    return `${minutes} min`;
  });
}
