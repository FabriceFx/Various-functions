/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Décodeur d'URL Sécurisée (SafeLinks) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Nettoie les wrappers de sécurité (ex: Microsoft SafeLinks, Proofpoint) 
 *    pour extraire l'URL de destination réelle depuis un email transféré.
 *
 *  Fonctions exposées :
 *    • DECODE_SAFE_URL(url)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Extrait l'URL réelle cachée derrière un lien de sécurité d'entreprise.
 *
 * @param {string} url L'URL réécrite (ex: safelinks.protection.outlook.com/?url=...).
 * @return {string}    L'URL propre et décodée.
 * @customfunction
 *
 * @example
 *   =DECODE_SAFE_URL(A2)
 */
function DECODE_SAFE_URL(url) {
  if (!url) return "";

  const chaine = String(url).trim();

  try {
    // 1. Cas Microsoft SafeLinks
    // https://*.safelinks.protection.outlook.com/?url=https%3A%2F%2Fvrai-site.com&data=...
    if (chaine.includes("safelinks.protection.outlook.com")) {
      const match = chaine.match(/[?&]url=([^&]+)/i);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }

    // 2. Cas Proofpoint
    // https://urldefense.com/v3/__https://vrai-site.com__;!!...
    if (chaine.includes("urldefense.com") || chaine.includes("urldefense.proofpoint.com")) {
      const match = chaine.match(/__([^_]+)__/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }

    // Si pas de wrapper connu, renvoie l'URL telle quelle
    return chaine;
  } catch (e) {
    return chaine; // Renvoi silencieux en cas d'erreur de décodage
  }
}
