/*
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
 * @OnlyCurrentDoc
 */

/**
 * Extrait l'URL réelle cachée derrière un lien de sécurité d'entreprise.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} url L'URL réécrite ou plage.
 * @return {string|Array<Array<string>>}    L'URL propre ou tableau de résultats.
 * @customfunction
 *
 *   =DECODE_SAFE_URL(A2)
 *   =DECODE_SAFE_URL(A2:A100)
 */
function DECODE_SAFE_URL(url) {
  return batchProcess(url, (val) => {
    if (!val) return "";

    const chaine = String(val).trim();

    try {
      if (chaine.includes("safelinks.protection.outlook.com")) {
        const match = chaine.match(/[?&]url=([^&]+)/i);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      }

      if (chaine.includes("urldefense.com") || chaine.includes("urldefense.proofpoint.com")) {
        const match = chaine.match(/__([^_]+)__/);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      }

      return chaine;
    } catch (e) {
      return chaine;
    }
  });
}
