/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Calcul d'Agios — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le coût des agios pour un découvert bancaire ou 
 *    des pénalités de retard fournisseur.
 *
 *  Fonctions exposées :
 *    • CALCUL_AGIOS(montant, tauxAnnuel, nbJours)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule le montant des intérêts/agios.
 * Formule : (Montant * Jours * Taux Annuel) / (365 * 100)
 *
 * @param {number} montant     Montant du découvert ou de la créance.
 * @param {number} tauxAnnuel  Taux d'intérêt annuel en % (ex: 8 pour 8%).
 * @param {number} nbJours     Nombre de jours de retard/découvert.
 * @return {number}            Montant des agios.
 * @customfunction
 *
 * @example
 *   =CALCUL_AGIOS(5000; 12; 15)
 */
function CALCUL_AGIOS(montant, tauxAnnuel, nbJours) {
  const m = parseFloat(montant);
  const t = parseFloat(tauxAnnuel);
  const j = parseInt(nbJours, 10);

  if (isNaN(m) || isNaN(t) || isNaN(j)) return "Erreur: valeurs invalides";

  // Si l'utilisateur saisit 8% sous forme 0.08, on l'ajuste
  const tauxReel = t < 1 ? t : t / 100;

  const agios = (Math.abs(m) * j * tauxReel) / 365;

  return Math.round(agios * 100) / 100;
}
