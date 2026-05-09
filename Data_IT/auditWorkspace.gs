/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Audit Workspace & Sécurité — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *
 *  Description :
 *    Fonctions d'audit pour les fichiers Drive et les comptes utilisateurs.
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Analyse le niveau de partage d'un fichier Drive.
 *
 * @param {string|Array<Array<string>>} fileId ID du fichier ou URL.
 * @return {string|Array<Array<string>>} Résumé des permissions.
 * @customfunction
 */
function DRIVE_PERMISSION_AUDITOR(fileId) {
  return batchProcess(fileId, (val) => {
    if (!val) return "⚠️ ID Manquant";
    
    // Extraire l'ID si c'est une URL
    const id = val.includes('/') ? val.split('/d/')[1]?.split('/')[0] || val : val;
    
    try {
      const file = DriveApp.getFileById(id);
      const access = file.getSharingAccess();
      const permission = file.getSharingPermission();
      
      let level = "🔒 INTERNE";
      if (access === DriveApp.Access.ANYONE) {
        level = "🌐 PUBLIC";
      } else if (access === DriveApp.Access.ANYONE_WITH_LINK) {
        level = "🔗 LIEN PUBLIC";
      } else if (access === DriveApp.Access.DOMAIN || access === DriveApp.Access.DOMAIN_WITH_LINK) {
        level = "🏢 DOMAINE";
      }

      const viewers = file.getViewers().length;
      const editors = file.getEditors().length;

      return `${level} (V:${viewers}, E:${editors}) | ${permission}`;
    } catch (e) {
      return "❌ Accès Refusé / ID Invalide";
    }
  });
}

/**
 * Retourne le statut de santé d'un compte utilisateur.
 * Note: Nécessite l'activation du service avancé "Admin SDK API".
 * @param {string} email Adresse email de l'utilisateur.
 * @return {string} Résumé du compte (Connexion, Quota).
 * @customfunction
 */
function WORKSPACE_USER_HEALTH(email) {
  if (!email) return "⚠️ Email manquant";
  
  try {
    // Tentative via Admin SDK
    if (typeof AdminDirectory !== 'undefined') {
      const user = AdminDirectory.Users.get(email);
      const lastLogin = _parseDate(user.lastLoginTime);
      const storage = Math.round(user.agreedTerms ? 0 : 0); // Placeholder si besoin d'autres champs
      return `Dernière connexion: ${lastLogin ? lastLogin.toLocaleDateString() : 'Jamais'} | Suspendu: ${user.suspended}`;
    }
    
    // Fallback limité (si admin non activé)
    return "💡 Activez 'Admin SDK' pour un audit complet.";
  } catch (e) {
    return "❌ Erreur Admin: " + e.message;
  }
}
