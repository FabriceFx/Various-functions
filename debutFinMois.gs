/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Début et Fin de mois — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Retourne le premier ou le dernier jour du mois d'une date donnée.
 *
 *  Fonctions exposées :
 *    • debutMois(date)  → 1er jour du mois
 *    • finMois(date)    → dernier jour du mois
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Retourne le premier jour du mois correspondant à la date fournie.
 *
 * @param {Date|string} date  Date de référence.
 * @return {Date}             Date du premier jour du mois.
 * @customfunction
 *
 * @example
 *   =debutMois("2026-05-15")  → "2026-05-01"
 */
function debutMois(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Erreur: format de date invalide";
  
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Retourne le dernier jour du mois correspondant à la date fournie.
 *
 * @param {Date|string} date  Date de référence.
 * @return {Date}             Date du dernier jour du mois.
 * @customfunction
 *
 * @example
 *   =finMois("2026-05-15")  → "2026-05-31"
 */
function finMois(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Erreur: format de date invalide";
  
  // Le jour 0 du mois suivant correspond au dernier jour du mois courant
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
