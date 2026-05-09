/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Couleur de cellule — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Retourne le code hexadécimal de la couleur de fond d'une cellule.
 *    Attention : en raison des limitations de Google Sheets, la cellule
 *    doit être passée sous forme de chaîne de caractères, ex: "A1".
 *
 *  Fonctions exposées :
 *    • couleurCellule(referenceCellule)  → Code couleur HEX
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Retourne le code couleur hexadécimal de l'arrière-plan d'une cellule.
 * Supporte le traitement par lot (plages de références).
 *
 * @param {string|Array<Array<string>>} referenceCellule La référence A1 ou plage.
 * @return {string|Array<Array<string>>}                  Le code hexadécimal ou tableau.
 * @customfunction
 *
 *   =couleurCellule("A1")
 *   =couleurCellule(B2:B10)
 */
function couleurCellule(referenceCellule) {
  return batchProcess(referenceCellule, (val) => {
    if (!val) return "Erreur: référence requise";

    try {
      const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const cell = activeSheet.getRange(val);
      return cell.getBackground();
    } catch (e) {
      return "Erreur";
    }
  });
}
