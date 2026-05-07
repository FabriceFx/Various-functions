/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Recherche V Floue (Fuzzy Match) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Alternative à la fonction native RECHERCHEV. Trouve la correspondance
 *    la plus proche en utilisant l'algorithme de la distance de Levenshtein.
 *    Très utile pour corriger les fautes de frappe ou les variations de noms
 *    (ex: "Soc. Gen." vs "Société Générale").
 *
 *  Fonctions exposées :
 *    • rechercheVFloue(valeurRecherchee, plage, indexColonne, seuil)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Recherche une valeur de façon approchée et renvoie la valeur d'une autre colonne.
 *
 * @param {string} valeurRecherchee La valeur à chercher (ex: "Jean Dupont").
 * @param {Array<Array<any>>} plage La plage de recherche (ex: A2:C100).
 * @param {number} [indexColonne=2] Le numéro de la colonne contenant la valeur à renvoyer (1-indexé).
 * @param {number} [seuil=0.7]      Le score de similarité minimum (entre 0 et 1). 0.7 = 70% de ressemblance.
 * @return {any}                    La valeur trouvée, ou "Non trouvé" si sous le seuil.
 * @customfunction
 *
 * @example
 *   =rechercheVFloue("Societe Generale"; A2:C100; 3; 0.8)
 */
function rechercheVFloue(valeurRecherchee, plage, indexColonne = 2, seuil = 0.7) {
  if (!valeurRecherchee || !plage || !plage.length) return "Erreur: paramètres manquants";
  
  const recherche = String(valeurRecherchee).trim().toLowerCase();
  if (recherche === "") return "Valeur vide";

  const index = parseInt(indexColonne, 10) - 1; // Google Sheets est 1-indexé, les tableaux JS sont 0-indexés
  if (index < 0 || index >= plage[0].length) return "Erreur: index de colonne invalide";

  let meilleurScore = -1;
  let meilleureCorrespondance = null;
  let valeurRetour = null;

  for (let i = 0; i < plage.length; i++) {
    const ligne = plage[i];
    if (!ligne || ligne[0] == null) continue;
    
    const candidat = String(ligne[0]).trim().toLowerCase();
    if (candidat === "") continue;

    // Correspondance exacte (optimisation)
    if (candidat === recherche) {
      return ligne[index];
    }

    const score = similariteLevenshtein_(recherche, candidat);
    
    if (score > meilleurScore) {
      meilleurScore = score;
      valeurRetour = ligne[index];
      meilleureCorrespondance = ligne[0];
    }
  }

  if (meilleurScore >= parseFloat(seuil)) {
    return valeurRetour;
  }

  return "Non trouvé (Meilleur score : " + Math.round(meilleurScore * 100) + "%)";
}

/**
 * Calcule la similarité entre 0 et 1 basée sur la distance de Levenshtein.
 * @private
 */
function similariteLevenshtein_(s1, s2) {
  let plusLong = s1;
  let plusCourt = s2;
  
  if (s1.length < s2.length) {
    plusLong = s2;
    plusCourt = s1;
  }
  
  const maxLength = plusLong.length;
  if (maxLength === 0) return 1.0;
  
  const distance = distanceLevenshtein_(plusLong, plusCourt);
  return (maxLength - distance) / parseFloat(maxLength);
}

/**
 * Implémentation de la distance de Levenshtein (calcul du nombre d'opérations
 * nécessaires pour passer d'une chaîne à l'autre).
 * @private
 */
function distanceLevenshtein_(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // Suppression
          dp[i][j - 1] + 1,    // Insertion
          dp[i - 1][j - 1] + 1 // Substitution
        );
      }
    }
  }
  return dp[m][n];
}
