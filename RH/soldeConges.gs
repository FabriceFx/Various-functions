/*
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
 * @OnlyCurrentDoc
 */

/**
 * Calcule le nombre de jours de congés acquis au prorata.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateEntree Date de début ou plage.
 * @param {Date|string} [dateFin] Date de fin.
 * @param {number} [joursParMois=2.08] Jours acquis par mois.
 * @return {number|string|Array<Array<number|string>>} Nombre de jours ou tableau de résultats.
 * @customfunction
 *
 *   =SOLDE_CONGES("2025-01-01"; "2025-06-30"; 2.5)
 *   =SOLDE_CONGES(A2:A100)
 */
function SOLDE_CONGES(dateEntree, dateFin, joursParMois = 2.08) {
  return BATCH_PROCESS(dateEntree, (val) => {
    // Clauses de garde systématiques
    const errDateEntree = GUARD.isDate(val, "Date d'entrée");
    const errDateFin = dateFin ? GUARD.isDate(dateFin, "Date de fin") : null;
    const errJours = GUARD.isNumber(joursParMois, "Nombre de jours");

    const error = errDateEntree || errDateFin || errJours;
    if (error) return `Erreur: ${error}`;

    const d1 = _parseDate(val);
    const d2 = dateFin ? _parseDate(dateFin) : new Date();

    if (d1 > d2) return 0;

    const nbJoursTotal = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24) + 1;
    const moisMoyens = nbJoursTotal / 30.416;

    const joursAcquis = moisMoyens * parseFloat(joursParMois);

    return Math.round(joursAcquis * 100) / 100;
  });
}
