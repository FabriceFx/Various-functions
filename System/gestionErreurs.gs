/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Gestion des Erreurs et Surveillance — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Centralise la journalisation des erreurs et l'envoi d'alertes critiques.
 *    Permet de suivre la santé des automatisations en temps réel.
 *
 *  Fonctions exposées :
 *    • LOG_ERREUR(message, [contexte], [gravite])
 *    • NOTIFIER_ADMIN(sujet, message, [type])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Enregistre une erreur dans la feuille de logs et notifie l'admin si critique.
 *
 * @param {string} message   Message de l'erreur.
 * @param {string} [contexte] Où l'erreur s'est produite (ex: "Calcul Paie").
 * @param {string} [gravite="ERROR"] Niveau : "INFO", "WARN", "ERROR", "CRITICAL".
 * @return {string}           Statut de l'enregistrement.
 * @customfunction
 */
function LOG_ERREUR(message, contexte = "Général", gravite = "ERROR") {
  try {
    const timestamp = new Date();
    let user = "Système";
    try { user = Session.getEffectiveUser().getEmail(); } catch(e) {}
    
    const sheet = _getOrCreateLogSheet();
    if (!sheet) return "❌ Pas d'accès à la feuille de logs";
    
    sheet.appendRow([timestamp, gravite.toUpperCase(), contexte, message, user]);
    
    // Notification automatique si critique ou erreur grave
    if (CONFIG.MONITORING.AUTO_NOTIFY && (gravite === "ERROR" || gravite === "CRITICAL")) {
      NOTIFIER_ADMIN(
        `🚨 Alerte Système : ${contexte}`,
        `Une erreur de type <b>${gravite}</b> a été détectée.\n\n<b>Détails :</b> ${message}`,
        gravite === "CRITICAL" ? "ALERTE" : "VIGILANCE"
      );
    }
    
    return `✅ Log enregistré (${gravite})`;
  } catch (e) {
    console.error("Échec de la journalisation : " + e.message);
    return "❌ Erreur de journalisation";
  }
}

/**
 * Envoie une notification immédiate à l'administrateur système.
 * Utilise le module Communication (ENVOYER_EMAIL).
 *
 * @param {string} sujet Sujet de l'alerte.
 * @param {string} message Corps de l'alerte.
 * @param {string} [type="ALERTE"] Type visuel : "INFO", "VIGILANCE", "ALERTE".
 */
function NOTIFIER_ADMIN(sujet, message, type = "ALERTE") {
  let adminEmail = CONFIG.MONITORING.ADMIN_EMAIL;
  
  // Récupération dynamique sécurisée
  if (!adminEmail) {
    try { adminEmail = Session.getEffectiveUser().getEmail(); } catch(e) { return; }
  }

  const options = {
    type: type,
    footer: "Système de Surveillance Automatisé — FF Library"
  };

  // On appelle la fonction de communication interne
  ENVOYER_EMAIL(adminEmail, sujet, message, options);
}

/**
 * Récupère ou crée la feuille de calcul dédiée aux logs.
 * @private
 */
function _getOrCreateLogSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const name = CONFIG.MONITORING.LOG_SHEET_NAME;
  let sheet = ss.getSheetByName(name);
  
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(["Timestamp", "Gravité", "Contexte", "Message", "Utilisateur"]);
    sheet.getRange("A1:E1").setBackground("#1C1B1F").setFontColor("#FFFFFF").setFontWeight("bold");
    sheet.setFrozenRows(1);
    // Masquer la feuille pour ne pas polluer l'UI utilisateur
    sheet.hideSheet();
  }
  
  return sheet;
}
