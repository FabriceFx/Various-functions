/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Pénalités de Retard B2B — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule les pénalités de retard légales (B2B) en fonction du montant, 
 *    de la date d'échéance et du taux de la BCE (majoré selon la loi).
 *
 *  Fonctions exposées :
 *    • PENALITES_RETARD(montant, dateEcheance, [tauxBCE], [margeLégale])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule les intérêts de retard.
 *
 * @param {number} montant       Montant impayé (TTC en général).
 * @param {Date|string} dateEcheance Date à laquelle la facture aurait dû être payée.
 * @param {number} [tauxBCE=4.5] Le taux directeur de la BCE en vigueur (%).
 * @param {number} [marge=10]    La marge légale à ajouter au taux BCE (10 points en France).
 * @return {number}              Le montant des pénalités dues à la date du jour.
 * @customfunction
 *
 * @example
 *   =PENALITES_RETARD(5000; "2024-01-01"; 4.5; 10)
 */
function PENALITES_RETARD(montant, dateEcheance, tauxBCE = 4.5, marge = 10) {
  const m = parseFloat(montant);
  if (isNaN(m) || m <= 0) return 0;

  const dEcheance = new Date(dateEcheance);
  if (isNaN(dEcheance.getTime())) return "Erreur: Date invalide";

  const dAujourdhui = new Date();
  
  const diffTime = dAujourdhui.getTime() - dEcheance.getTime();
  if (diffTime <= 0) return 0; // Pas de retard
  
  const joursRetard = Math.floor(diffTime / (1000 * 3600 * 24));

  const tBCE = parseFloat(tauxBCE);
  const mrg = parseFloat(marge);
  
  if (isNaN(tBCE) || isNaN(mrg)) return "Erreur: Taux invalide";

  // Taux légal total appliqué
  const tauxTotal = (tBCE + mrg) / 100;

  // Calcul : (Montant * Jours de retard * Taux) / 365
  const penalites = (m * joursRetard * tauxTotal) / 365;

  // Plus la fameuse indemnité forfaitaire pour frais de recouvrement de 40€ en France
  // (Optionnelle selon ce que veut l'utilisateur, mais souvent appliquée. 
  // On renvoie juste les intérêts ici pour rester strictement mathématique, ou on l'ajoute si on le documente)
  // On laisse l'indemnité de 40€ au choix de la facture.

  return Math.round(penalites * 100) / 100;
}
