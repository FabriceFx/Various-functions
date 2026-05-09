/*
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
 * @OnlyCurrentDoc
 */

/**
 * Évalue l'urgence d'une échéance en jours ouvrés.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateEcheance Date limite ou plage.
 * @param {Date|string} [dateRef] Date de référence.
 * @return {string|Array<Array<string>>}                Statut ou tableau de résultats.
 * @customfunction
 *
 *   =DEADLINE_STATUS(A2)
 *   =DEADLINE_STATUS(A2:A100)
 */
function DEADLINE_STATUS(dateEcheance, dateRef) {
  return BATCH_PROCESS(dateEcheance, (val) => {
    if (!val) return "";

    const dEnd = _parseDate(val);
    const dStart = dateRef ? _parseDate(dateRef) : new Date();

    if (!dEnd || !dStart) return "Erreur: date invalide";

    dStart.setHours(0,0,0,0);
    dEnd.setHours(0,0,0,0);

    if (dStart > dEnd) {
      return "🔴 Dépassé";
    }

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
  });
}
