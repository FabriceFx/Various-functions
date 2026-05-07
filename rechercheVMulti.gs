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
 *
 * @param {string|number} valeurLa  valeur à chercher (ex: ID Client).
 * @param {Array<Array<any>>} plage La plage de recherche (ex: A2:D100).
 * @param {number} indexColonne     Le numéro de la colonne à renvoyer (1-indexé).
 * @param {string} [separateur=", "] Le séparateur (ex: " | ", "\n" ou "").
 * @return {string|Array}           Les valeurs trouvées.
 * @customfunction
 *
 * @example
 *   // Trouve toutes les commandes du client 123
 *   =RECHERCHEV_MULTI("123"; A2:B100; 2; ", ")
 */
function RECHERCHEV_MULTI(valeurRecherchee, plage, indexColonne, separateur = ", ") {
  if (valeurRecherchee == null || !plage || !indexColonne) return "Erreur: paramètres manquants";

  const recherche = String(valeurRecherchee).trim().toLowerCase();
  const index = parseInt(indexColonne, 10) - 1; // Google Sheets est 1-indexé
  
  if (index < 0 || index >= plage[0].length) return "Erreur: index de colonne invalide";

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

  // Si on a explicitement demandé de ne pas avoir de séparateur ("")
  if (separateur === "") {
    // Retourne un tableau horizontal qui s'étendra sur plusieurs colonnes
    return [resultats];
  }

  // Permettre le retour à la ligne
  const sep = separateur.replace(/\\n/g, "\n");
  
  return resultats.join(sep);
}
