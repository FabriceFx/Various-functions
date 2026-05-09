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
 * Supporte le traitement par lot (plages de cellules) et utilise le cache.
 *
 * @param {string|Array<Array<string>>} url  L'URL ou une plage d'URLs.
 * @return {string|Array<Array<string>>}     Le contenu de la balise <title> ou tableau de résultats.
 * @customfunction
 *
 * @example
 *   =EXTRACT_TITLE_TAG("https://faucheux.bzh")
 *   =EXTRACT_TITLE_TAG(A2:A50)
 */
function EXTRACT_TITLE_TAG(url) {
  const cache = CacheService.getScriptCache();
  
  return batchProcess(url, (val) => {
    if (!val || String(val).trim() === "") return "";

    let chaineURL = String(val).trim().toLowerCase();
    if (!/^https?:\/\//i.test(chaineURL)) {
      chaineURL = "https://" + chaineURL;
    }

    // Vérifier le cache
    const cached = cache.get(chaineURL);
    if (cached) return cached;

    try {
      const response = UrlFetchApp.fetch(chaineURL, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GoogleAppsScript"
        }
      });

      const html = response.getContentText("UTF-8");
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      
      let title = "Aucune balise <title> trouvée";
      
      if (match && match[1]) {
        title = match[1]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .trim();
      }
      
      // Stocker en cache pour 6 heures
      cache.put(chaineURL, title, CONFIG.CACHE_TTL);
      return title;

    } catch (e) {
      return "Erreur de connexion à l'URL";
    }
  });
}
