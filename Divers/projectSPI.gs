/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Schedule Performance Index (SPI) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le SPI d'un projet. 
 *    SPI = Progression Réelle / Progression Planifiée.
 *    Si SPI < 1 : En retard. Si SPI >= 1 : Dans les temps ou en avance.
 *
 *  Fonctions exposées :
 *    • PROJECT_SPI(dateDebut, dateFin, progressionReelle, [dateActuelle])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule l'indice de performance calendaire (SPI).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDebut Date début ou plage.
 * @param {Date|string} dateFin Date livraison.
 * @param {number} progressionReelle Avancement (ex: 0.45).
 * @param {Date|string} [dateActuelle] Date évaluation.
 * @return {number|Array<Array<number>>}               Le SPI ou tableau de résultats.
 * @customfunction
 *
 *   =PROJECT_SPI("2025-01-01"; "2025-12-31"; 0.5)
 *   =PROJECT_SPI(A2:A100; "2025-12-31"; 0.8)
 */
function PROJECT_SPI(dateDebut, dateFin, progressionReelle, dateActuelle) {
  return BATCH_PROCESS(dateDebut, (val) => {
    const dStart = _parseDate(val);
    const dEnd = _parseDate(dateFin);
    const dNow = dateActuelle ? _parseDate(dateActuelle) : new Date();

    if (!dStart || !dEnd || !dNow) return "Erreur: dates invalides";

    const realProg = parseFloat(progressionReelle);
    if (isNaN(realProg)) return "Erreur: progression";

    const dureeTotale = dEnd.getTime() - dStart.getTime();
    if (dureeTotale <= 0) return "Erreur: dates";

    let tempsEcoule = dNow.getTime() - dStart.getTime();
    if (tempsEcoule < 0) tempsEcoule = 0;
    if (tempsEcoule > dureeTotale) tempsEcoule = dureeTotale;

    const expectedProg = tempsEcoule / dureeTotale;
    if (expectedProg === 0) return 1;

    const realValue = realProg > 1 ? realProg / 100 : realProg;
    const spi = realValue / expectedProg;

    return Math.round(spi * 100) / 100;
  });
}
