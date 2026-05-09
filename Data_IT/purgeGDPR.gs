/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Conformité RGPD & Purge — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *
 *  Description :
 *    Automatisation du nettoyage des données obsolètes.
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Parcourt une plage et anonymise les lignes dépassant le délai de rétention.
 * @param {string} rangeName Nom de la plage (ex: "A2:E100").
 * @param {number} colDate Index de la colonne date (1-based).
 * @param {number} moisRetention Nombre de mois de rétention.
 * @return {string} Résumé des actions effectuées.
 */
function GDPR_PURGE_TRIGGER(rangeName, colDate, moisRetention = 36) {
  try {
    const sheet = SpreadsheetApp.getActiveSelection().getSheet();
    const range = sheet.getRange(rangeName);
    const data = range.getValues();
    const now = new Date();
    let count = 0;

    for (let i = 0; i < data.length; i++) {
      const dateCell = _parseDate(data[i][colDate - 1]);
      if (!dateCell) continue;

      // Calcul de la différence en mois
      const diffMois = (now.getFullYear() - dateCell.getFullYear()) * 12 + (now.getMonth() - dateCell.getMonth());
      
      if (diffMois >= moisRetention) {
        // Purge : On anonymise les colonnes
        for (let j = 0; j < data[i].length; j++) {
          if (j === colDate - 1) continue; // On garde la date pour trace
          data[i][j] = MASK_PII(data[i][j]);
        }
        count++;
      }
    }

    if (count > 0) {
      range.setValues(data);
    }

    return `🛡️ RGPD : ${count} ligne(s) anonymisée(s) (${moisRetention} mois).`;
  } catch (e) {
    return "❌ Erreur Purge : " + e.message;
  }
}
