/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Email Studio (Material Design 3) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Envoie des emails stylisés en Material Design 3. Supporte les types
 *    Info, Vigilance et Alerte, ainsi que la gestion des copies (CC/CCI).
 *
 *  Fonctions exposées :
 *    • ENVOYER_EMAIL(to, subject, body, [options])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Envoie un email stylisé Material Design 3.
 *
 * @param {string} to          Destinataire(s) (séparés par des virgules).
 * @param {string} subject     Objet de l'email.
 * @param {string} body        Corps du message (supporte le HTML simple).
 * @param {Object} [options]   Options d'envoi.
 * @param {string} [options.cc]        Destinataires en copie.
 * @param {string} [options.bcc]       Destinataires en copie cachée.
 * @param {boolean} [options.noReply]  Si VRAI, utilise une adresse no-reply (si dispo).
 * @param {string} [options.type="INFO"] Type d'email : "INFO", "VIGILANCE", "ALERTE".
 * @param {string} [options.footer]    Texte personnalisé pour le pied de page.
 * @return {string}                    Message de confirmation ou d'erreur.
 * @customfunction
 */
function ENVOYER_EMAIL(to, subject, body, options = {}) {
  try {
    const type = (options.type || "INFO").toUpperCase();
    const colors = CONFIG.COLORS_MD3[type] || CONFIG.COLORS_MD3.INFO;
    
    const htmlBody = _buildMd3Template(subject, body, colors, options.footer);
    
    const mailOptions = {
      name: "FF Library Studio",
      htmlBody: htmlBody,
      cc: options.cc || "",
      bcc: options.bcc || "",
      noReply: options.noReply === true
    };

    MailApp.sendEmail(to, subject, "", mailOptions);
    
    return `✅ Email envoyé à ${to}`;
  } catch (e) {
    return `❌ Erreur d'envoi : ${e.message}`;
  }
}

/**
 * Génère le template HTML Material Design 3.
 * @private
 */
function _buildMd3Template(title, content, colors, footer) {
  const currentYear = new Date().getFullYear();
  const defaultFooter = footer || "Ce message automatique a été généré par FF Library Studio.";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Roboto', 'Segoe UI', Tahoma, sans-serif; margin: 0; padding: 0; background-color: #F4F4F9; color: #1C1B1F; }
        .container { max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border-radius: 28px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background-color: ${colors.primary}; color: ${colors.onPrimary}; padding: 32px 24px; text-align: left; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 500; letter-spacing: 0.25px; }
        .content { padding: 32px 24px; line-height: 1.6; font-size: 16px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; background-color: ${colors.container}; color: ${colors.onContainer}; }
        .footer { background-color: #F1F3F4; padding: 24px; text-align: center; font-size: 12px; color: #49454F; }
        .divider { height: 1px; background-color: #CAC4D0; margin: 0 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          <div class="badge">${colors.onContainer === "#001D36" ? "Information" : (colors.onContainer === "#291800" ? "Vigilance" : "Alerte Critique")}</div>
          <div>${content.replace(/\n/g, '<br>')}</div>
        </div>
        <div class="divider"></div>
        <div class="footer">
          <p>${defaultFooter}</p>
          <p style="margin-top: 16px;">© ${currentYear} — FF Library Studio</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
