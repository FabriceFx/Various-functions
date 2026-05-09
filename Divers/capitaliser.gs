/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Capitalisation de texte — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Met la première lettre de chaque mot en majuscule.
 *    Gère intelligemment les particules françaises (de, du, le, la, etc.)
 *    qui doivent rester en minuscules au milieu d'un nom.
 *
 *  Fonctions exposées :
 *    • capitaliser(texte)  → texte capitalisé
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Met en majuscule la première lettre de chaque mot, en ignorant
 * certaines particules sauf en début de phrase.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou une plage de cellules.
 * @return {string|Array<Array<string>>}       Le texte capitalisé ou tableau de résultats.
 * @customfunction
 *
 *   =capitaliser("jean-pierre de la fontaine")  → "Jean-Pierre de la Fontaine"
 *   =capitaliser(A2:A100)                       → [Tableau de résultats]
 */
function capitaliser(texte) {
  return batchProcess(texte, (val) => {
    if (val == null || String(val).trim() === "") return "";

    // On passe tout en minuscules pour commencer
    const str = String(val).toLowerCase();
    
    // Sépare par espaces ou tirets pour traiter chaque partie
    return str.replace(/(?:^|[\s\-\'])([a-zà-ÿ])/g, (match, lettre, offset) => {
      // Si c'est le tout premier caractère, on met toujours en majuscule
      if (offset === 0) return match.toUpperCase();
      
      // Extrait le mot complet pour vérifier si c'est une particule
      const finMot = str.substring(offset).search(/[\s\-\']/);
      const motEntier = finMot === -1 
        ? str.substring(offset) 
        : str.substring(offset, offset + finMot);

      // Si c'est une particule et qu'elle n'est pas au début, on laisse en minuscule
      if (CONFIG.PARTICULES_FR.has(motEntier) && match[0] !== '-') {
        return match;
      }
      
      return match.toUpperCase();
    });
  });
}
