/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Recherche V Multiple — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Contrairement à la fonction native RECHERCHEV qui ne s'arrête qu'à 
 *    la première occurrence, RECHERCHEV_MULTI retourne TOUTES les
 *    correspondances trouvées dans la plage, séparées par un caractère.
 *
 *  Fonctions exposées :
 *    • RECHERCHEV_MULTI(valeur, plage, indexColonne, [separateur])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Recherche toutes les occurrences et concatène les résultats.
 * Supporte le traitement par lot (plages de valeurs recherchées).
 *
 * @param {any|Array<Array<any>>} valeurRecherchee  La valeur ou plage à chercher.
 * @param {Array<Array<any>>} plage                La plage de recherche (ex: A2:D100).
 * @param {number} indexColonne                    Index colonne à renvoyer (1-indexé).
 * @param {string} [separateur=", "]               Le séparateur.
 * @return {string|Array<Array<any>>}               Résultats concaténés ou tableau.
 * @customfunction
 *
 * @example
 *   =RECHERCHEV_MULTI("123"; A2:B100; 2)
 *   =RECHERCHEV_MULTI(F2:F10; A2:B100; 2)
 */
function RECHERCHEV_MULTI(valeurRecherchee, plage, indexColonne, separateur = ", ") {
  return batchProcess(valeurRecherchee, (val) => {
    if (val == null || !plage || !indexColonne) return "Erreur: paramètres";

    const recherche = String(val).trim().toLowerCase();
    const index = parseInt(indexColonne, 10) - 1;
    
    if (index < 0 || index >= plage[0].length) return "Erreur: index";

    const resultats = [];
    for (let i = 0; i < plage.length; i++) {
      const ligne = plage[i];
      if (!ligne || ligne[0] == null) continue;

      const cellText = String(ligne[0]).trim().toLowerCase();
      if (cellText === recherche) {
        if (ligne[index] != null && String(ligne[index]).trim() !== "") {
          resultats.push(ligne[index]);
        }
      }
    }

    if (resultats.length === 0) return "Non trouvé";

    if (separateur === "") return resultats.join(" | "); // Fallback si vide dans batch

    const sep = separateur.replace(/\\n/g, "\n");
    return resultats.join(sep);
  });
}
