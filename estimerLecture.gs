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
 *
 * @param {string} texte             Le contenu textuel.
 * @param {number} [motsParMinute=250] Vitesse de lecture (250 mpm en moyenne).
 * @return {string}                  Temps estimé (ex: "3 min").
 * @customfunction
 *
 * @example
 *   =ESTIMER_LECTURE(A2)
 */
function ESTIMER_LECTURE(texte, motsParMinute = 250) {
  if (!texte || String(texte).trim() === "") return "0 min";

  const chaine = String(texte).trim();
  const nombreMots = chaine.split(/\s+/).length;

  const minutes = Math.ceil(nombreMots / parseInt(motsParMinute, 10));

  return `${minutes} min`;
}
