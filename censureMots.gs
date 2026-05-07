/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Censure de Mots — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Remplace les mots sensibles, vulgaires ou interdits par des astérisques.
 *
 *  Fonctions exposées :
 *    • CENSURE_MOTS(texte, [motsSupplementaires])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Censure les mots indésirables dans un texte.
 *
 * @param {string} texte                Le texte source.
 * @param {string} [motsSupplementaires=""] Mots à ajouter à la liste noire (séparés par des virgules).
 * @return {string}                     Le texte censuré.
 * @customfunction
 *
 * @example
 *   =CENSURE_MOTS("C'est vraiment un gros connard."; "gros,moche")
 */
function CENSURE_MOTS(texte, motsSupplementaires = "") {
  if (!texte || String(texte).trim() === "") return "";

  let chaine = String(texte);

  // Liste noire basique FR
  const listeNoire = [
    "merde", "putain", "connard", "con", "conne", "salope", "encule", "enculé",
    "bâtard", "batard", "pute", "chier", "foutre"
  ];

  if (motsSupplementaires) {
    const ajouts = String(motsSupplementaires).split(",").map(m => m.trim().toLowerCase());
    listeNoire.push(...ajouts);
  }

  // Création dynamique d'une Regex pour capturer ces mots en entier
  // Les mots sont triés par longueur décroissante pour éviter qu'un mot court ne remplace une partie d'un mot long
  listeNoire.sort((a, b) => b.length - a.length);

  for (const mot of listeNoire) {
    if (!mot) continue;
    // La regex cible le mot exact, insensible à la casse et aux accents basiques (simplifié ici)
    const regex = new RegExp(`\\b${mot}\\b`, "gi");
    
    // Remplace par des étoiles de la même longueur
    chaine = chaine.replace(regex, (match) => {
      // Pour garder la 1ère lettre visible, on peut faire: match[0] + "*".repeat(match.length-1)
      // Ici on cache tout :
      return "*".repeat(match.length);
    });
  }

  return chaine;
}
