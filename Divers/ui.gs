/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Interface Utilisateur (UI) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *
 *  Description :
 *    Gère la création du menu personnalisé et l'affichage de la barre latérale.
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Se déclenche à l'ouverture du classeur.
 * Crée le menu personnalisé "Various Functions".
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Various Functions')
    .addItem('Aide & Documentation', 'showSidebar')
    .addSeparator()
    .addItem('Vérifier la version', 'checkVersion')
    .addToUi();
}

/**
 * Affiche la barre latérale d'aide (Sidebar).
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Divers/sidebar')
    .setTitle('Various Functions — Aide')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche une boîte de dialogue avec la version actuelle.
 */
function checkVersion() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Version Active', `Vous utilisez la version ${FF_VERSION()} de la bibliothèque.`, ui.ButtonSet.OK);
}

/**
 * Vide le cache de la bibliothèque.
 */
function clearCache() {
  CacheService.getScriptCache().removeAll();
  return "Cache vidé avec succès !";
}

/**
 * Analyse la sélection active pour détecter des PII et retourne un résumé.
 */
function previewPIISelection() {
  try {
    const range = SpreadsheetApp.getActiveRange();
    if (!range) return "Aucune sélection active.";
    
    const values = range.getValues();
    const alertes = new Set();
    let count = 0;

    values.flat().forEach(val => {
      const t = String(val ?? "").trim();
      if (!t) return;
      
      CONFIG.PII_RULES.forEach(rule => {
        const match = t.match(rule.regex);
        if (match && (!rule.validate || rule.validate(match[0]))) {
          alertes.add(rule.label);
          count++;
        }
      });
    });

    if (alertes.size === 0) return "✅ Aucune donnée sensible détectée dans la sélection.";
    
    return `⚠️ ${count} donnée(s) détectée(s) :\n• ${Array.from(alertes).join('\n• ')}`;
  } catch (e) {
    return "Erreur lors de l'analyse : " + e.message;
  }
}
