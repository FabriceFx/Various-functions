/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction Meta Title (SEO) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Permet d'extraire la balise <title> d'une page web via UrlFetchApp.
 *    Très utile pour des audits SEO automatisés dans Sheets.
 *    Attention : ralentit si utilisé sur des centaines de lignes simultanément.
 *
 *  Fonctions exposées :
 *    • EXTRACT_TITLE_TAG(url)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Récupère le titre SEO d'une URL.
 *
 * @param {string} url  L'URL de la page web.
 * @return {string}     Le contenu de la balise <title>.
 * @customfunction
 *
 * @example
 *   =EXTRACT_TITLE_TAG("https://faucheux.bzh")
 */
function EXTRACT_TITLE_TAG(url) {
  if (!url || String(url).trim() === "") return "";

  let chaineURL = String(url).trim();
  if (!/^https?:\/\//i.test(chaineURL)) {
    chaineURL = "https://" + chaineURL;
  }

  try {
    const response = UrlFetchApp.fetch(chaineURL, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        // Ajout d'un faux User-Agent pour éviter certains blocages anti-bot basiques
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GoogleAppsScript"
      }
    });

    const html = response.getContentText("UTF-8");

    // Recherche de la balise <title>...</title>
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    
    if (match && match[1]) {
      // Nettoyage des entités HTML de base (ex: &amp;)
      return match[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .trim();
    }
    
    return "Aucune balise <title> trouvée";
  } catch (e) {
    return "Erreur de connexion à l'URL";
  }
}
