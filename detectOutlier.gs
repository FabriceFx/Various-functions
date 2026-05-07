/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Détection d'Outliers (Anomalies) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Vérifie si une valeur est statistiquement anormale par rapport à 
 *    une plage de données, en utilisant la méthode Z-Score.
 *
 *  Fonctions exposées :
 *    • DETECT_OUTLIER(valeur, plageDonnees, [seuilZ])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Détecte si une valeur est un outlier mathématique.
 *
 * @param {number} valeur         La valeur à tester.
 * @param {Array<Array<number>>} plageDonnees L'historique des valeurs (ex: B2:B100).
 * @param {number} [seuilZ=2.5]   Le seuil du Z-score (2.5 ou 3 est la norme).
 * @return {string}               "Anomalie" ou "Normal".
 * @customfunction
 *
 * @example
 *   =DETECT_OUTLIER(C2; C$2:C$100)
 */
function DETECT_OUTLIER(valeur, plageDonnees, seuilZ = 2.5) {
  const val = parseFloat(valeur);
  if (isNaN(val) || !plageDonnees) return "Erreur: données invalides";

  const donnees = [];

  // Aplatir et filtrer les données numériques
  if (Array.isArray(plageDonnees)) {
    for (let r = 0; r < plageDonnees.length; r++) {
      for (let c = 0; c < plageDonnees[r].length; c++) {
        const v = parseFloat(plageDonnees[r][c]);
        if (!isNaN(v)) donnees.push(v);
      }
    }
  } else {
    return "Erreur: la plage doit être une sélection";
  }

  if (donnees.length < 3) return "Plage trop petite";

  // Calcul de la moyenne
  const somme = donnees.reduce((acc, curr) => acc + curr, 0);
  const moyenne = somme / donnees.length;

  // Calcul de l'écart-type (Standard Deviation)
  const sommeEcartsCarres = donnees.reduce((acc, curr) => acc + Math.pow(curr - moyenne, 2), 0);
  const ecartType = Math.sqrt(sommeEcartsCarres / donnees.length);

  if (ecartType === 0) return "Normal"; // Toutes les valeurs sont identiques

  // Calcul du Z-Score
  const zScore = Math.abs((val - moyenne) / ecartType);

  if (zScore > parseFloat(seuilZ)) {
    return `🔴 Anomalie (Z=${Math.round(zScore*10)/10})`;
  }

  return "🟢 Normal";
}
