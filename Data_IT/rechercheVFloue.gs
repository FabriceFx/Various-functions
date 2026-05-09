/*
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
 *    • RECHERCHE_V_FLOUE(valeurRecherchee, plage, indexColonne, seuil)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Recherche une valeur de façon approchée et renvoie la valeur d'une autre colonne.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} valeurRecherchee La valeur ou plage à chercher.
 * @param {Array<Array<any>>} plage La plage de référence (ex: A2:C100).
 * @param {number} [indexColonne=2] Colonne à renvoyer (1-indexé).
 * @param {number} [seuil=0.7] Similarité (0 à 1).
 * @return {any|Array<Array<any>>}                       La valeur trouvée ou tableau de résultats.
 * @customfunction
 *
 *   =RECHERCHE_V_FLOUE("Societe Generale"; A2:C100; 3)
 *   =RECHERCHE_V_FLOUE(D2:D100; A2:C100; 2)
 */
function RECHERCHE_V_FLOUE(valeurRecherchee, plage, indexColonne = 2, seuil = 0.7) {
  return BATCH_PROCESS(valeurRecherchee, (val) => {
    if (!val || !plage || !plage.length) return "Erreur: paramètres manquants";
    
    const recherche = String(val).trim().toLowerCase();
    if (recherche === "") return "";

    const index = parseInt(indexColonne, 10) - 1;
    if (index < 0 || index >= plage[0].length) return "Erreur: index colonne";

    let meilleurScore = -1;
    let valeurRetour = null;

    for (let i = 0; i < plage.length; i++) {
      const ligne = plage[i];
      if (!ligne || ligne[0] == null) continue;
      
      const candidat = String(ligne[0]).trim().toLowerCase();
      if (candidat === "") continue;

      if (candidat === recherche) {
        return ligne[index];
      }

      const score = similariteLevenshtein_(recherche, candidat);
      
      if (score > meilleurScore) {
        meilleurScore = score;
        valeurRetour = ligne[index];
      }
    }

    if (meilleurScore >= parseFloat(seuil)) {
      return valeurRetour;
    }

    return "Non trouvé";
  });
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
