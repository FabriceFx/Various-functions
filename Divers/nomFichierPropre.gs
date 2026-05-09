/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Nettoyeur de Nom de Fichier — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Nettoie une chaîne de caractères pour qu'elle puisse être utilisée
 *    de façon sécurisée comme nom de fichier (supprime les caractères
 *    interdits sous Windows/Mac/Linux).
 *
 *  Fonctions exposées :
 *    • NOM_FICHIER_PROPRE(texte, [remplacement])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Sécurise un texte pour en faire un nom de fichier valide.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte brut ou plage.
 * @param {string} [remplacement="-"] Le caractère de remplacement.
 * @return {string|Array<Array<string>>}        Le nom de fichier propre ou tableau de résultats.
 * @customfunction
 *
 *   =NOM_FICHIER_PROPRE("Facture_N°123/2026") → "Facture_N-123-2026"
 *   =NOM_FICHIER_PROPRE(A2:A100)
 */
function NOM_FICHIER_PROPRE(texte, remplacement = "-") {
  return BATCH_PROCESS(texte, (val) => {
    if (!val || String(val).trim() === "") return "fichier_sans_nom";

    let nom = String(val).trim();
    const rep = String(remplacement);

    nom = nom.replace(/[\x00-\x1f\\/:*?"<>|]/g, rep);

    const repEscaped = rep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (repEscaped) {
      const regexMultiple = new RegExp(`(${repEscaped}){2,}`, "g");
      nom = nom.replace(regexMultiple, rep);
    }

    return nom.trim();
  });
}
