/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Génération de Slug (URL) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Transforme un texte en "slug", format idéal pour les URLs.
 *    Convertit en minuscules, supprime les accents, remplace les espaces
 *    et caractères spéciaux par des tirets.
 *
 *  Fonctions exposées :
 *    • slugify(texte)  → texte formaté en slug
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Convertit une chaîne de caractères en slug (format URL).
 *
 * @param {string} texte  Le texte à convertir.
 * @return {string}       Le slug généré.
 * @customfunction
 *
 * @example
 *   =slugify("Café Crème à l'Hôtel !")  → "cafe-creme-a-l-hotel"
 */
function slugify(texte) {
  if (texte == null || String(texte).trim() === "") return "";

  return String(texte)
    .normalize("NFD")                      // Décompose les accents
    .replace(/[\u0300-\u036f]/g, "")       // Supprime les accents
    .replace(/[œŒ]/g, "oe")
    .replace(/[æÆ]/g, "ae")
    .toLowerCase()                         // Minuscules
    .replace(/[^a-z0-9]+/g, "-")           // Remplace tout sauf lettres/chiffres par un tiret
    .replace(/^-+|-+$/g, "");              // Supprime les tirets au début et à la fin
}
