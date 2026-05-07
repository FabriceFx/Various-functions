/** @OnlyCurrentDoc */

/**
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
 */

/**
 * Retourne le code couleur hexadécimal de l'arrière-plan d'une cellule.
 * La référence de la cellule doit être fournie entre guillemets.
 *
 * @param {string} referenceCellule  La référence A1 de la cellule (ex: "B2").
 * @return {string}                  Le code hexadécimal (ex: "#ff0000").
 * @customfunction
 *
 * @example
 *   =couleurCellule("A1")
 */
function couleurCellule(referenceCellule) {
  if (!referenceCellule) return "Erreur: référence requise (ex: \"A1\")";
  
  try {
    const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const cell = activeSheet.getRange(referenceCellule);
    return cell.getBackground();
  } catch (e) {
    return "Erreur: référence invalide ou contexte non autorisé";
  }
}
