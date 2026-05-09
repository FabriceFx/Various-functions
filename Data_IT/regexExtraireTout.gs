/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction Multiple par Regex — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Pousse la fonction native REGEXEXTRACT plus loin en extrayant TOUTES
 *    les occurrences d'un motif dans un texte, et non pas seulement la première.
 *
 *  Fonctions exposées :
 *    • regexExtraireTout(texte, regex, [separateur])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Extrait toutes les correspondances d'une expression régulière dans un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte source ou plage.
 * @param {string} expressionReguliere L'expression régulière.
 * @param {string} [separateur=", "]            Le séparateur.
 * @return {string|Array<Array<any>>}            Les éléments trouvés ou tableau.
 * @customfunction
 *
 *   =regexExtraireTout(A2; "\d+ €")
 *   =regexExtraireTout(A2:A100; "#[a-zA-Z0-9]+")
 */
function regexExtraireTout(texte, expressionReguliere, separateur = ", ") {
  return batchProcess(texte, (val) => {
    if (val == null || val === "" || !expressionReguliere) return "";

    try {
      let flags = "g";
      let pattern = expressionReguliere;
      const matchRegexFormat = expressionReguliere.match(/^\/(.*?)\/([gimsuy]*)$/);
      if (matchRegexFormat) {
        pattern = matchRegexFormat[1];
        flags = matchRegexFormat[2];
        if (!flags.includes('g')) flags += 'g';
      }

      const reg = new RegExp(pattern, flags);
      const resultats = String(val).match(reg);

      if (!resultats || resultats.length === 0) return "Aucune correspondance";

      if (separateur === "") return resultats.join(" | "); // Fallback dans batch

      return resultats.join(separateur);
    } catch (e) {
      return "Erreur: regex invalide";
    }
  });
}
