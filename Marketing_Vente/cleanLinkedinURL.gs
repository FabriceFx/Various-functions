/*
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
 * @OnlyCurrentDoc
 */

/**
 * Enlève les paramètres de tracking superflus d'une URL LinkedIn.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} url L'URL LinkedIn brute ou plage.
 * @return {string|Array<Array<string>>}     L'URL propre ou tableau de résultats.
 * @customfunction
 *
 *   =CLEAN_LINKEDIN_URL("https://www.linkedin.com/in/jean-dupont-1234/?miniProfileUrn=urn:li:fs_miniProfile:123&trk=public_profile")
 *   → "https://www.linkedin.com/in/jean-dupont-1234"
 *   =CLEAN_LINKEDIN_URL(A2:A100)
 */
function CLEAN_LINKEDIN_URL(url) {
  return BATCH_PROCESS(url, (val) => {
    if (!val || String(val).trim() === "") return "";

    const chaine = String(val).trim();
    // On coupe simplement tout ce qui vient après le "?"
    return chaine.split("?")[0].replace(/\/$/, ""); // Et on enlève un éventuel slash final
  });
}
