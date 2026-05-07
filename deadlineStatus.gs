/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Statut de Deadline — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Retourne un statut textuel selon l'imminence d'une date d'échéance,
 *    en ignorant les week-ends pour le décompte des jours restants.
 *
 *  Fonctions exposées :
 *    • DEADLINE_STATUS(dateEcheance, [dateRef])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Évalue l'urgence d'une échéance en jours ouvrés.
 *
 * @param {Date|string} dateEcheance Date limite.
 * @param {Date|string} [dateRef]    Date de référence (Aujourd'hui par défaut).
 * @return {string}                  Statut (Critique, À surveiller, OK).
 * @customfunction
 *
 * @example
 *   =DEADLINE_STATUS(A2)
 */
function DEADLINE_STATUS(dateEcheance, dateRef) {
  if (!dateEcheance) return "";

  const dEnd = new Date(dateEcheance);
  const dStart = dateRef ? new Date(dateRef) : new Date();

  if (isNaN(dEnd.getTime()) || isNaN(dStart.getTime())) return "Erreur: date invalide";

  dStart.setHours(0,0,0,0);
  dEnd.setHours(0,0,0,0);

  if (dStart > dEnd) {
    return "🔴 Dépassé";
  }

  // Calcul des jours ouvrés restants
  let count = 0;
  let courante = new Date(dStart);

  while (courante < dEnd) {
    const jour = courante.getDay();
    if (jour !== 0 && jour !== 6) {
      count++;
    }
    courante.setDate(courante.getDate() + 1);
  }

  if (count <= 2) return "🔴 Critique";
  if (count <= 5) return "🟠 À surveiller";
  return "🟢 OK";
}
