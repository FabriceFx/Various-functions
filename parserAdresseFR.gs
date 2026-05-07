/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Analyseur d'Adresse Française — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Prend une adresse française brute sur une ligne et la découpe en
 *    ses composants : Numéro, Voie, Code Postal et Ville.
 *    Renvoie un tableau qui se déploie sur plusieurs colonnes.
 *
 *  Fonctions exposées :
 *    • parserAdresseFR(adresse)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Découpe une adresse française en Numéro, Voie, Code Postal et Ville.
 * Renvoie un tableau qui s'étendra sur 4 colonnes adjacentes.
 *
 * @param {string} adresse  L'adresse complète (ex: "12 bis rue de la Paix 75002 Paris").
 * @return {Array<string>}  [Numéro, Voie, Code Postal, Ville]
 * @customfunction
 *
 * @example
 *   =parserAdresseFR("12 rue de la Paix 75002 Paris")
 *   // Déploiera: | 12 | rue de la Paix | 75002 | Paris |
 */
function parserAdresseFR(adresse) {
  if (!adresse || String(adresse).trim() === "") return [["", "", "", ""]];

  let chaine = String(adresse).trim();
  
  let numero = "";
  let voie = "";
  let codePostal = "";
  let ville = "";

  // 1. Extraire le code postal (5 chiffres)
  // On cherche la première occurrence de 5 chiffres (avec ou sans espace au milieu pour les coquilles)
  const regexCP = /\b(?:2[A|B]|0[1-9]|[1-8]\d|9[0-5]|9[7-8])\d{3}\b/;
  const matchCP = chaine.match(regexCP);

  if (matchCP) {
    codePostal = matchCP[0];
    
    // Découper la chaîne autour du code postal
    const indexCP = chaine.indexOf(codePostal);
    ville = chaine.substring(indexCP + codePostal.length).replace(/^[,\s-]+/, "").trim();
    chaine = chaine.substring(0, indexCP).trim();
  }

  // 2. Chercher le numéro au début de ce qu'il reste
  // Numéro + extension possible (bis, ter, a, b...)
  const regexNum = /^\s*(\d+)(?:\s*(bis|ter|quater|quinquies|[A-Z]))?\b/i;
  const matchNum = chaine.match(regexNum);

  if (matchNum) {
    numero = matchNum[0].trim();
    // La voie est ce qu'il reste
    voie = chaine.substring(matchNum[0].length).replace(/^[,\s-]+/, "").trim();
  } else {
    // S'il n'y a pas de numéro clair, tout est considéré comme la voie
    voie = chaine.replace(/^[,\s-]+/, "").trim();
  }

  // Nettoyage final
  ville = ville.replace(/[,\-\s]+$/, "").trim(); // Enlever les virgules finales
  voie = voie.replace(/[,\-\s]+$/, "").trim();

  // Renvoi sous forme de tableau horizontal (1 ligne, 4 colonnes)
  return [[numero, voie, codePostal, ville]];
}
