/** @OnlyCurrentDoc */

/**
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
 */

/**
 * Extrait toutes les correspondances d'une expression régulière dans un texte.
 *
 * @param {string} texte               Le texte source.
 * @param {string} expressionReguliere L'expression régulière (ex: "[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]+").
 * @param {string} [separateur=", "]   Le séparateur utilisé pour concaténer les résultats.
 *                                     Si vide (""), renvoie un tableau (étalé sur plusieurs cellules).
 * @return {string|Array}              Les éléments trouvés.
 * @customfunction
 *
 * @example
 *   // Récupère tous les montants en euros (séparés par des virgules)
 *   =regexExtraireTout(A2; "\d+ €")
 *   
 *   // Récupère tous les hashtags et les étale sur plusieurs colonnes
 *   =regexExtraireTout(A2; "#[a-zA-Z0-9]+"; "")
 */
function regexExtraireTout(texte, expressionReguliere, separateur = ", ") {
  if (texte == null || texte === "" || !expressionReguliere) return "";

  try {
    // Le flag 'g' (global) est crucial pour extraire tout
    // On ajoute 'i' par défaut pour rendre insensible à la casse si pas de flags passés
    let flags = "g";
    
    // Parser la regex si l'utilisateur a écrit "/pattern/gi"
    let pattern = expressionReguliere;
    const matchRegexFormat = expressionReguliere.match(/^\/(.*?)\/([gimsuy]*)$/);
    if (matchRegexFormat) {
      pattern = matchRegexFormat[1];
      flags = matchRegexFormat[2];
      if (!flags.includes('g')) flags += 'g';
    }

    const reg = new RegExp(pattern, flags);
    const resultats = String(texte).match(reg);

    if (!resultats || resultats.length === 0) {
      return "Aucune correspondance";
    }

    // Si on a passé une chaîne vide comme séparateur explicitement (casse les crochets/virgules)
    if (separateur === "") {
      // Renvoie un tableau horizontal (1 ligne, N colonnes)
      return [resultats];
    }

    return resultats.join(separateur);
    
  } catch (e) {
    return "Erreur: expression régulière invalide";
  }
}
