/*
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
 * @OnlyCurrentDoc
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

/**
 * Génère une barre de progression visuelle via SPARKLINE (Design Material 3).
 * @param {number} valeur Valeur actuelle.
 * @param {number} [max=100] Valeur maximale.
 * @param {string} [color="#0061A4"] Couleur (HEX).
 * @return {string} Formule SPARKLINE à copier.
 * @customfunction
 */
function UI_PROGRESS_SPARKLINE(valeur, max = 100, color = "#0061A4") {
  const v = parseFloat(valeur) || 0;
  const m = parseFloat(max) || 100;
  // On retourne une formule que Sheets peut interpréter s'il était possible de l'injecter, 
  // mais ici on retourne le texte de la formule pour l'utilisateur.
  return `=SPARKLINE(${v}; {"charttype"\\"bar"; "max"\\${m}; "color1"\\"${color}"})`;
}

/**
 * Retourne la liste des fonctions documentées pour la recherche dans la sidebar.
 */
function getFunctionsDocs() {
  return [
    { name: "FF_VERSION", desc: "Version actuelle", cat: "Système" },
    { name: "MASK_PII", desc: "Anonymisation RGPD", cat: "Compliance" },
    { name: "SEO_LISIBILITE_FLESCH", desc: "Indice Flesch français", cat: "SEO" },
    { name: "SOLDE_CONGES", desc: "Calcul prorata congés", cat: "RH" },
    { name: "joursOuvres", desc: "Jours ouvrés entre 2 dates", cat: "Dates" },
    { name: "AMORTISSEMENT_LINEAIRE", desc: "Calcul d'amortissement", cat: "Finance" },
    { name: "NORMALISER_ADRESSE_FR", desc: "Normalisation via API Gouv", cat: "Data" },
    { name: "TEXT_SIMILARITY", desc: "Taux de ressemblance (%)", cat: "Stats" }
  ];
}

/**
 * Vérifie si une nouvelle version est disponible sur GitHub.
 */
function checkLibraryUpdate() {
  const GITHUB_API_URL = "https://api.github.com/repos/FabriceFx/Various-functions/releases/latest";
  try {
    const response = UrlFetchApp.fetch(GITHUB_API_URL, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) return "Impossible de joindre GitHub.";
    
    const latest = JSON.parse(response.getContentText());
    const latestTag = latest.tag_name.replace('v', '');
    const current = FF_VERSION();

    if (latestTag !== current) {
      return `📢 Nouvelle version disponible : v${latestTag} (Vous avez v${current}).`;
    }
    return "✅ Votre bibliothèque est à jour !";
  } catch (e) {
    return "Erreur lors de la vérification.";
  }
}
