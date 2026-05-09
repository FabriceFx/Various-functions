/*
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
 * @OnlyCurrentDoc
 */

/**
 * Récupère le titre SEO d'une URL.
 * Supporte le traitement par lot, le cache et l'Exponential Backoff.
 *
 * @param {string|Array<Array<string>>} url L'URL ou une plage d'URLs.
 * @param {boolean} [bypassCache=false] Si vrai, ignore le cache et force un nouvel appel.
 * @return {string|Array<Array<string>>}       Le contenu de la balise <title> ou tableau de résultats.
 * @customfunction
 *
 *   =EXTRACT_TITLE_TAG("https://faucheux.bzh")
 *   =EXTRACT_TITLE_TAG(A2:A50; VRAI) // Force le rafraîchissement
 */
function EXTRACT_TITLE_TAG(url, bypassCache = false) {
  const cache = CacheService.getScriptCache();
  
  return BATCH_PROCESS(url, (val) => {
    if (!val || String(val).trim() === "") return "";

    let chaineURL = String(val).trim();
    if (!/^https?:\/\//i.test(chaineURL)) {
      chaineURL = "https://" + chaineURL;
    }

    // Vérifier le cache (sauf si bypass demandé)
    if (!bypassCache) {
      const cached = cache.get(chaineURL);
      if (cached) return cached;
    }

    try {
      // Utilisation de l'utilitaire global avec Exponential Backoff
      const response = _fetchWithBackoff(chaineURL, {
        muteHttpExceptions: true,
        followRedirects: true,
        validateHttpsCertificates: false,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GoogleAppsScript-SEO-Bot"
        }
      });

      const html = response.getContentText("UTF-8");
      const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      
      let title = "Aucune balise <title> trouvée";
      
      if (match && match[1]) {
        title = match[1]
          .replace(/\s+/g, ' ') // Nettoie les retours à la ligne
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
      return "Erreur: connexion impossible ou quota atteint";
    }
  });
}
