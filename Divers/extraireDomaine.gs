/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction de domaine — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Extrait le nom de domaine principal d'une URL complète,
 *    en supprimant le protocole (http/https), les sous-domaines (www)
 *    et le chemin d'accès.
 *
 *  Fonctions exposées :
 *    • extraireDomaine(url)  → Nom de domaine
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Extrait le domaine principal d'une URL.
 * Gère les sous-domaines (www) et les TLDs complexes (ex: .co.uk).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} url  L'URL ou une plage d'URLs.
 * @return {string|Array<Array<string>>}     Le domaine extrait ou tableau de résultats.
 * @customfunction
 *
 *   =extraireDomaine("https://www.google.co.uk/search") → "google.co.uk"
 *   =extraireDomaine(A2:A50)                           → [Tableau de résultats]
 */
function extraireDomaine(url) {
  return batchProcess(url, (val) => {
    if (val == null || String(val).trim() === "") return "";

    let domaine = String(val).trim();
    
    if (!/^https?:\/\//i.test(domaine)) {
      domaine = "http://" + domaine;
    }

    try {
      const match = domaine.match(/^https?:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      if (!match || !match[1]) return "";
      
      let hostname = match[1].toLowerCase();
      hostname = hostname.split(':')[0]; // Supprimer port
      
      const parts = hostname.split('.');
      if (parts.length <= 2) return hostname;

      // Gestion des TLDs complexes (ex: co.uk)
      const lastTwo = parts.slice(-2).join('.');
      const isDoubleTLD = CONFIG.DOUBLE_TLDS.has(lastTwo);

      // Si c'est un double TLD, on garde 3 parties si elles existent (ex: domain.co.uk)
      // Sinon on garde 2 parties (ex: domain.com)
      const partsToKeep = isDoubleTLD ? 3 : 2;
      
      if (parts.length >= partsToKeep) {
        return parts.slice(-partsToKeep).join('.');
      }
      
      return hostname;
    } catch(e) {
      return "Erreur d'extraction";
    }
  });
}
