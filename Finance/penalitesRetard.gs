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
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montant  Montant ou plage.
 * @param {Date|string} dateEcheance              Date d'échéance.
 * @param {number} [tauxBCE=4.5]                  Le taux directeur BCE (%).
 * @param {number} [marge=10]                     La marge légale (points).
 * @return {number|Array<Array<number>>}          Le montant des pénalités ou tableau de résultats.
 * @customfunction
 *
 *   =PENALITES_RETARD(5000; "2024-01-01"; 4.5; 10)
 *   =PENALITES_RETARD(A2:A100; "2024-01-01")
 */
function PENALITES_RETARD(montant, dateEcheance, tauxBCE = 4.5, marge = 10) {
  return batchProcess(montant, (val) => {
    const m = parseFloat(val);
    if (isNaN(m) || m <= 0) return 0;

    const dEcheance = _parseDate(dateEcheance);
    if (!dEcheance) return "Erreur: Date invalide";

    const dAujourdhui = new Date();
    
    const diffTime = dAujourdhui.getTime() - dEcheance.getTime();
    if (diffTime <= 0) return 0;
    
    const joursRetard = Math.floor(diffTime / (1000 * 3600 * 24));

    const tBCE = parseFloat(tauxBCE);
    const mrg = parseFloat(marge);
    
    if (isNaN(tBCE) || isNaN(mrg)) return "Erreur: Taux invalide";

    const tauxTotal = (tBCE + mrg) / 100;
    const penalites = (m * joursRetard * tauxTotal) / 365;

    return Math.round(penalites * 100) / 100;
  });
}
