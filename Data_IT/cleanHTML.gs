/*
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
 * @OnlyCurrentDoc
 */

/**
 * Supprime les balises HTML d'un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte HTML ou plage.
 * @return {string|Array<Array<string>>}       Le texte brut nettoyé ou tableau de résultats.
 * @customfunction
 *
 *   =CLEAN_HTML("<p>Bonjour <strong>le monde</strong> !</p>")
 *   → "Bonjour le monde !"
 *   =CLEAN_HTML(A2:A100)
 */
function CLEAN_HTML(texte) {
  return batchProcess(texte, (val) => {
    if (val == null || String(val).trim() === "") return "";

    let chaine = String(val);

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
  });
}
