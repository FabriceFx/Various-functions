/*
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
 * @OnlyCurrentDoc
 */

/**
 * Convertit une chaîne de caractères en slug (format URL).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou plage à convertir.
 * @return {string|Array<Array<string>>}       Le slug généré ou tableau de résultats.
 * @customfunction
 *
 *   =slugify("Café Crème à l'Hôtel !")  → "cafe-creme-a-l-hotel"
 *   =slugify(A2:A100)
 */
function slugify(texte) {
  return batchProcess(texte, (val) => {
    if (val == null || String(val).trim() === "") return "";

    return String(val)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[œŒ]/g, "oe")
      .replace(/[æÆ]/g, "ae")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });
}
