/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Utilitaires Date — Début / Fin / Infos de mois — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 2.0
 *  Date    : 2026-05-08
 *  Licence : MIT
 *
 *  Description :
 *    Utilitaires pour naviguer dans les mois d'une date Google Sheets :
 *    premier jour, dernier jour, nombre de jours, nom du mois.
 *
 *    • Helper _parseDate centralisé (gère Date, serial number Sheets, string ISO)
 *    • Constante ERR_DATE pour des messages d'erreur cohérents
 *    • Nouvelles fonctions : NB_JOURS_MOIS, NOM_MOIS
 *    • JSDoc enrichi (@throws, exemples multiples)
 *
 *  Fonctions exposées :
 *    • DEBUT_MOIS(date)     → 1er jour du mois
 *    • FIN_MOIS(date)       → dernier jour du mois
 *    • NB_JOURS_MOIS(date)  → nombre de jours dans le mois
 *    • NOM_MOIS(date)       → nom du mois en français
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

// ─── Fonctions exposées ───────────────────────────────────────────────────────

/**
 * Retourne le premier jour du mois correspondant à la date fournie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} date Date de référence ou plage.
 * @return {Date|string|Array<Array<Date|string>>}      Date du 1er jour ou tableau de résultats.
 * @customfunction
 *
 *   =DEBUT_MOIS("2026-05-15")  → 01/05/2026
 *   =DEBUT_MOIS(A2:A100)
 */
function DEBUT_MOIS(date) {
  return batchProcess(date, (val) => {
    const d = _parseDate(val);
    if (!d) return CONFIG.ERR_DATE;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
}

/**
 * Retourne le dernier jour du mois correspondant à la date fournie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} date Date de référence ou plage.
 * @return {Date|string|Array<Array<Date|string>>}      Date du dernier jour ou tableau de résultats.
 * @customfunction
 *
 *   =FIN_MOIS("2026-02-10")  → 28/02/2026
 *   =FIN_MOIS(A2:A100)
 */
function FIN_MOIS(date) {
  return batchProcess(date, (val) => {
    const d = _parseDate(val);
    if (!d) return CONFIG.ERR_DATE;
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  });
}

/**
 * Retourne le nombre de jours dans le mois de la date fournie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} date Date de référence ou plage.
 * @return {number|string|Array<Array<number|string>>}   Nombre de jours ou tableau de résultats.
 * @customfunction
 *
 *   =NB_JOURS_MOIS("2026-02-01")  → 28
 *   =NB_JOURS_MOIS(A2:A100)
 */
function NB_JOURS_MOIS(date) {
  return batchProcess(date, (val) => {
    const d = _parseDate(val);
    if (!d) return CONFIG.ERR_DATE;
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  });
}

/**
 * Retourne le nom du mois en français pour la date fournie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} date Date de référence ou plage.
 * @return {string|Array<Array<string>>}                Nom du mois ou tableau de résultats.
 * @customfunction
 *
 *   =NOM_MOIS("2026-05-08")  → "Mai"
 *   =NOM_MOIS(A2:A100)
 */
function NOM_MOIS(date) {
  return batchProcess(date, (val) => {
    const d = _parseDate(val);
    if (!d) return CONFIG.ERR_DATE;
    return CONFIG.NOMS_MOIS_FR[d.getMonth()];
  });
}
