/** @OnlyCurrentDoc */

/**
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
 */

const PARTICULES_MINUSCULES_ = new Set([
  "de", "du", "des", "le", "la", "les", "l", "d", 
  "et", "ou", "en", "à", "au", "aux", "par", "pour", "sur",
  "von", "van", "di", "da", "do", "das", "dos"
]);

/**
 * Met en majuscule la première lettre de chaque mot, en ignorant
 * certaines particules sauf en début de phrase.
 *
 * @param {string} texte  Le texte à capitaliser.
 * @return {string}       Le texte capitalisé.
 * @customfunction
 *
 * @example
 *   =capitaliser("jean-pierre de la fontaine")  → "Jean-Pierre de la Fontaine"
 *   =capitaliser("L'HOTEL DU NORD")              → "L'Hôtel du Nord"
 */
function capitaliser(texte) {
  if (texte == null || String(texte).trim() === "") return "";

  // On passe tout en minuscules pour commencer
  const str = String(texte).toLowerCase();
  
  // Sépare par espaces ou tirets pour traiter chaque partie
  return str.replace(/(?:^|[\s\-\'])([a-zà-ÿ])/g, (match, lettre, offset) => {
    // Si c'est le tout premier caractère, on met toujours en majuscule
    if (offset === 0) return match.toUpperCase();
    
    // Extrait le mot complet pour vérifier si c'est une particule
    // On cherche depuis ce caractère jusqu'au prochain séparateur
    const finMot = str.substring(offset).search(/[\s\-\']/);
    const motEntier = finMot === -1 
      ? str.substring(offset) 
      : str.substring(offset, offset + finMot);

    // Si c'est une particule et qu'elle n'est pas au début, on laisse en minuscule
    // sauf après un tiret (ex: Jean-Pierre)
    if (PARTICULES_MINUSCULES_.has(motEntier) && match[0] !== '-') {
      return match;
    }
    
    // Sinon on capitalise
    return match.toUpperCase();
  });
}
