/*
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
 * @OnlyCurrentDoc
 */

/**
 * Détecte si une valeur est un outlier mathématique.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} valeur La valeur ou plage à tester.
 * @param {Array<Array<number>>} plageDonnees L'historique des valeurs (ex: B2:B100).
 * @param {number} [seuilZ=2.5] Le seuil du Z-score.
 * @return {string|Array<Array<string>>}               "Anomalie" ou "Normal" (ou tableau de résultats).
 * @customfunction
 *
 *   =DETECT_OUTLIER(C2; C$2:C$100)
 *   =DETECT_OUTLIER(C2:C10; C$2:C$100)
 */
function DETECT_OUTLIER(valeur, plageDonnees, seuilZ = 2.5) {
  // Pré-calculer la moyenne et l'écart-type de la plage de référence une seule fois
  const donnees = [];
  if (Array.isArray(plageDonnees)) {
    for (let r = 0; r < plageDonnees.length; r++) {
      for (let c = 0; c < plageDonnees[r].length; c++) {
        const v = parseFloat(plageDonnees[r][c]);
        if (!isNaN(v)) donnees.push(v);
      }
    }
  } else {
    return "Erreur: la plage de données doit être une sélection";
  }

  if (donnees.length < 3) return "Plage trop petite";

  const somme = donnees.reduce((acc, curr) => acc + curr, 0);
  const moyenne = somme / donnees.length;
  const sommeEcartsCarres = donnees.reduce((acc, curr) => acc + Math.pow(curr - moyenne, 2), 0);
  const ecartType = Math.sqrt(sommeEcartsCarres / donnees.length);

  // Appliquer le BATCH_PROCESS sur la valeur à tester
  return BATCH_PROCESS(valeur, (valRaw) => {
    const val = parseFloat(valRaw);
    if (isNaN(val)) return "Erreur: valeur invalide";

    if (ecartType === 0) return "🟢 Normal";

    const zScore = Math.abs((val - moyenne) / ecartType);

    if (zScore > parseFloat(seuilZ)) {
      return `🔴 Anomalie (Z=${Math.round(zScore*10)/10})`;
    }
    return "🟢 Normal";
  });
}
