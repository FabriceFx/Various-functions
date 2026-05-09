/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Amortissement Linéaire — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule l'annuité d'amortissement pour l'exercice comptable en cours,
 *    en tenant compte du prorata temporis la première et la dernière année.
 *
 *  Fonctions exposées :
 *    • AMORTISSEMENT_LINEAIRE(valeur, dureeAnnees, dateAchat, anneeExercice)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule la dotation aux amortissements d'une immobilisation pour une année donnée.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} valeur  Valeur d'achat ou plage.
 * @param {number} dureeAnnees                  Durée en années.
 * @param {Date|string} dateAchat                Date de mise en service.
 * @param {number} anneeExercice                Année de calcul.
 * @return {number|Array<Array<number>>}        Dotation ou tableau de résultats.
 * @customfunction
 *
 * @example
 *   =AMORTISSEMENT_LINEAIRE(10000; 5; "2024-07-01"; 2024)
 *   =AMORTISSEMENT_LINEAIRE(A2:A100; 5; "2024-01-01"; 2025)
 */
function AMORTISSEMENT_LINEAIRE(valeur, dureeAnnees, dateAchat, anneeExercice) {
  return batchProcess(valeur, (val) => {
    const v = parseFloat(val);
    const d = parseInt(dureeAnnees, 10);
    const anneeEx = parseInt(anneeExercice, 10);
    
    if (isNaN(v) || isNaN(d) || isNaN(anneeEx)) return "Erreur: paramètres invalides";

    const dateAcq = _parseDate(dateAchat);
    if (!dateAcq) return "Erreur: date invalide";

    const anneeAcq = dateAcq.getFullYear();
    const anneeFin = anneeAcq + d;

    if (anneeEx < anneeAcq || anneeEx > anneeFin) return 0;

    const annuitePleine = v / d;
    const moisAcq = dateAcq.getMonth();
    const jourAcq = dateAcq.getDate();
    
    const joursUtilisesAnnee1 = (12 - moisAcq - 1) * 30 + (30 - Math.min(jourAcq, 30) + 1);
    const prorataAnnee1 = joursUtilisesAnnee1 / 360;
    
    const annuiteAnnee1 = annuitePleine * prorataAnnee1;

    if (anneeEx === anneeAcq) {
      return Math.round(annuiteAnnee1 * 100) / 100;
    }

    if (anneeEx === anneeFin) {
      const annuiteDerniereAnnee = annuitePleine - annuiteAnnee1;
      return Math.round(Math.max(0, annuiteDerniereAnnee) * 100) / 100;
    }

    return Math.round(annuitePleine * 100) / 100;
  });
}
