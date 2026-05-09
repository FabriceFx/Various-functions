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
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte  Le texte source ou plage.
 * @param {string} [motsSupplementaires=""] Mots à ajouter à la liste noire (séparés par des virgules).
 * @return {string|Array<Array<string>>}       Le texte censuré ou tableau de résultats.
 * @customfunction
 *
 *   =CENSURE_MOTS("C'est vraiment un gros connard."; "gros,moche")
 *   =CENSURE_MOTS(A2:A100; "urgent")
 */
function CENSURE_MOTS(texte, motsSupplementaires = "") {
  return batchProcess(texte, (val) => {
    if (!val || String(val).trim() === "") return "";

    let chaine = String(val);

    // Liste noire basique FR
    const listeNoire = [
      "merde", "putain", "connard", "con", "conne", "salope", "encule", "enculé",
      "bâtard", "batard", "pute", "chier", "foutre"
    ];

    if (motsSupplementaires) {
      const ajouts = String(motsSupplementaires).split(",").map(m => m.trim().toLowerCase());
      listeNoire.push(...ajouts);
    }

    listeNoire.sort((a, b) => b.length - a.length);

    for (const mot of listeNoire) {
      if (!mot) continue;
      const regex = new RegExp(`\\b${mot}\\b`, "gi");
      
      chaine = chaine.replace(regex, (match) => {
        return "*".repeat(match.length);
      });
    }

    return chaine;
  });
}
