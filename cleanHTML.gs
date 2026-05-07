/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Nettoyeur de balises HTML — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Prend un bloc de texte contenant des balises HTML (ex: export WordPress)
 *    et renvoie le texte pur en supprimant toutes les balises.
 *
 *  Fonctions exposées :
 *    • CLEAN_HTML(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Supprime les balises HTML d'un texte.
 *
 * @param {string} texte  Le texte HTML.
 * @return {string}       Le texte brut nettoyé.
 * @customfunction
 *
 * @example
 *   =CLEAN_HTML("<p>Bonjour <strong>le monde</strong> !</p>")
 *   → "Bonjour le monde !"
 */
function CLEAN_HTML(texte) {
  if (texte == null || String(texte).trim() === "") return "";

  let chaine = String(texte);

  // Remplace <br> et <p> par des sauts de ligne pour garder la lisibilité
  chaine = chaine.replace(/<br\s*\/?>/gi, "\n");
  chaine = chaine.replace(/<\/p>/gi, "\n\n");

  // Supprime toutes les autres balises HTML
  chaine = chaine.replace(/<[^>]*>?/gm, "");

  // Décodage des entités HTML courantes
  chaine = chaine
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  // Nettoyage des espaces multiples et sauts de ligne excessifs
  return chaine.replace(/\n{3,}/g, "\n\n").trim();
}
