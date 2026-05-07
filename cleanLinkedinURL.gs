/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Nettoyeur d'URL LinkedIn — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Nettoie les URLs de profils ou de posts LinkedIn en retirant
 *    tous les paramètres de tracking (utm, miniProfileUrn, etc.).
 *
 *  Fonctions exposées :
 *    • CLEAN_LINKEDIN_URL(url)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Enlève les paramètres de tracking superflus d'une URL LinkedIn.
 *
 * @param {string} url  L'URL LinkedIn brute.
 * @return {string}     L'URL propre.
 * @customfunction
 *
 * @example
 *   =CLEAN_LINKEDIN_URL("https://www.linkedin.com/in/jean-dupont-1234/?miniProfileUrn=urn:li:fs_miniProfile:123&trk=public_profile")
 *   → "https://www.linkedin.com/in/jean-dupont-1234"
 */
function CLEAN_LINKEDIN_URL(url) {
  if (!url || String(url).trim() === "") return "";

  const chaine = String(url).trim();
  // On coupe simplement tout ce qui vient après le "?"
  return chaine.split("?")[0].replace(/\/$/, ""); // Et on enlève un éventuel slash final
}
