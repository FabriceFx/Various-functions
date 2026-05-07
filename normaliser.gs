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
 *
 * @param {string} texte  Le texte à normaliser.
 * @return {string}       Le texte normalisé.
 * @customfunction
 *
 * @example
 *   =normaliser("  Café   Crème  à  l'Hôtel ")  → "CAFE CREME A L'HOTEL"
 */
function normaliser(texte) {
  if (texte == null || String(texte).trim() === "") return "";

  return String(texte)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")     // Supprime les diacritiques
    .replace(/[œŒ]/g, (c) => c === "œ" ? "oe" : "OE")
    .replace(/[æÆ]/g, (c) => c === "æ" ? "ae" : "AE")
    .toUpperCase()
    .replace(/\s+/g, " ")               // Espaces multiples → un seul
    .trim();
}


/**
 * Supprime les accents et diacritiques d'un texte sans changer la casse.
 *
 * @param {string} texte  Le texte à traiter.
 * @return {string}       Le texte sans accents.
 * @customfunction
 *
 * @example
 *   =supprimerAccents("Crème brûlée")  → "Creme brulee"
 */
function supprimerAccents(texte) {
  if (texte == null || String(texte).trim() === "") return "";

  return String(texte)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[œŒ]/g, (c) => c === "œ" ? "oe" : "OE")
    .replace(/[æÆ]/g, (c) => c === "æ" ? "ae" : "AE");
}


/**
 * Supprime les espaces multiples et trim le texte.
 *
 * @param {string} texte  Le texte à nettoyer.
 * @return {string}       Le texte nettoyé.
 * @customfunction
 *
 * @example
 *   =supprimerEspaces("  Hello    World  ")  → "Hello World"
 */
function supprimerEspaces(texte) {
  if (texte == null) return "";
  return String(texte).replace(/\s+/g, " ").trim();
}
