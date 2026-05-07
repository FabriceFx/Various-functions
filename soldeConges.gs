/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Solde de Congés Payés — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule dynamiquement le nombre de jours de congés acquis 
 *    au prorata du temps de présence entre deux dates.
 *
 *  Fonctions exposées :
 *    • SOLDE_CONGES(dateEntree, dateFin, [joursParMois])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule le nombre de jours de congés acquis au prorata.
 *
 * @param {Date|string} dateEntree   Date de début de contrat ou de période.
 * @param {Date|string} dateFin      Date de fin de période (Aujourd'hui par défaut).
 * @param {number} [joursParMois=2.08] Nombre de jours acquis par mois (2.08 = 25j/an ouvrés, 2.5 = 30j/an ouvrables).
 * @return {number}                  Nombre de jours de congés acquis (arrondi à 2 décimales).
 * @customfunction
 *
 * @example
 *   =SOLDE_CONGES("2025-01-01"; "2025-06-30"; 2.5)
 */
function SOLDE_CONGES(dateEntree, dateFin, joursParMois = 2.08) {
  if (!dateEntree) return "Erreur: Date d'entrée requise";

  const d1 = new Date(dateEntree);
  const d2 = dateFin ? new Date(dateFin) : new Date();

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return "Erreur: format de date invalide";
  }

  if (d1 > d2) return 0;

  // Calcul du nombre de mois exact (y compris prorata pour les jours partiels)
  const nbJoursTotal = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24) + 1; // +1 pour inclure le jour de fin
  const moisMoyens = nbJoursTotal / 30.416; // 365 / 12

  const joursAcquis = moisMoyens * parseFloat(joursParMois);

  return Math.round(joursAcquis * 100) / 100;
}
