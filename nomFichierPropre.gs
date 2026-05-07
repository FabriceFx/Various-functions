/** @OnlyCurrentDoc */

/**
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
 */

/**
 * Sécurise un texte pour en faire un nom de fichier valide.
 *
 * @param {string} texte               Le texte brut.
 * @param {string} [remplacement="-"]  Le caractère pour remplacer les espaces et symboles interdits.
 * @return {string}                    Le nom de fichier valide.
 * @customfunction
 *
 * @example
 *   =NOM_FICHIER_PROPRE("Facture_N°123/2026 ??.pdf") 
 *   → "Facture_N_123-2026.pdf"
 */
function NOM_FICHIER_PROPRE(texte, remplacement = "-") {
  if (!texte || String(texte).trim() === "") return "fichier_sans_nom";

  let nom = String(texte).trim();
  const rep = String(remplacement);

  // Supprimer les caractères interdits (\ / : * ? " < > |)
  // On enlève aussi les caractères de contrôle non imprimables
  nom = nom.replace(/[\x00-\x1f\\/:*?"<>|]/g, rep);

  // Nettoyer les remplacements multiples (ex: "Facture---123" -> "Facture-123")
  // On doit échapper `rep` s'il s'agit d'un caractère regex spécial
  const repEscaped = rep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (repEscaped) {
    const regexMultiple = new RegExp(`(${repEscaped}){2,}`, "g");
    nom = nom.replace(regexMultiple, rep);
  }

  return nom.trim();
}
