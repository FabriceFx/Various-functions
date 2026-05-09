/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Normalisation de texte — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Normalise un texte pour faciliter la comparaison et le dédoublonnage :
 *    suppression des accents, des espaces multiples, mise en majuscules.
 *
 *  Fonctions exposées :
 *    • normaliser(texte)           → texte normalisé
 *    • supprimerAccents(texte)     → texte sans accents
 *    • supprimerEspaces(texte)     → texte sans espaces multiples
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Normalise un texte : supprime les accents, les espaces multiples,
 * et convertit en majuscules. Idéal pour dédoublonner.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte  Le texte ou plage à normaliser.
 * @return {string|Array<Array<string>>}       Le texte normalisé ou tableau de résultats.
 * @customfunction
 *
 *   =normaliser("  Café   Crème  à  l'Hôtel ")  → "CAFE CREME A L'HOTEL"
 *   =normaliser(A2:A100)
 */
function normaliser(texte) {
  return batchProcess(texte, (val) => {
    if (val == null || String(val).trim() === "") return "";

    return String(val)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[œŒ]/g, (c) => c === "œ" ? "oe" : "OE")
      .replace(/[æÆ]/g, (c) => c === "æ" ? "ae" : "AE")
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();
  });
}

/**
 * Supprime les accents et diacritiques d'un texte sans changer la casse.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte  Le texte ou plage à traiter.
 * @return {string|Array<Array<string>>}       Le texte sans accents ou tableau de résultats.
 * @customfunction
 *
 *   =supprimerAccents("Crème brûlée")  → "Creme brulee"
 *   =supprimerAccents(A2:A100)
 */
function supprimerAccents(texte) {
  return batchProcess(texte, (val) => {
    if (val == null || String(val).trim() === "") return "";

    return String(val)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[œŒ]/g, (c) => c === "œ" ? "oe" : "OE")
      .replace(/[æÆ]/g, (c) => c === "æ" ? "ae" : "AE");
  });
}

/**
 * Supprime les espaces multiples et trim le texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte  Le texte ou plage à nettoyer.
 * @return {string|Array<Array<string>>}       Le texte nettoyé ou tableau de résultats.
 * @customfunction
 *
 *   =supprimerEspaces("  Hello    World  ")  → "Hello World"
 *   =supprimerEspaces(A2:A100)
 */
function supprimerEspaces(texte) {
  return batchProcess(texte, (val) => {
    if (val == null) return "";
    return String(val).replace(/\s+/g, " ").trim();
  });
}
