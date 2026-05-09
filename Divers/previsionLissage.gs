/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Prévision par Lissage Exponentiel — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Prévoit la prochaine valeur d'une série temporelle en utilisant 
 *    la méthode du lissage exponentiel simple (SES).
 *
 *  Fonctions exposées :
 *    • PREVISION_LISSAGE(plageHistorique, [alpha])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Prédit la prochaine valeur basée sur un historique chronologique.
 *
 * @param {Array<Array<number>>} plageHistorique Les valeurs précédentes (chronologiques).
 * @param {number} [alpha=0.5] Le coefficient de lissage (entre 0 et 1). 
 *                             Proche de 1: réactif. Proche de 0: lisse fortement.
 * @return {number}            La prévision pour la période N+1.
 * @customfunction
 *
 *   =PREVISION_LISSAGE(B2:B12; 0.6)
 */
function PREVISION_LISSAGE(plageHistorique, alpha = 0.5) {
  if (!plageHistorique) return "Erreur: historique manquant";

  const a = parseFloat(alpha);
  if (isNaN(a) || a < 0 || a > 1) return "Erreur: alpha doit être entre 0 et 1";

  const donnees = [];

  // Aplatir l'historique en gardant l'ordre
  if (Array.isArray(plageHistorique)) {
    for (let r = 0; r < plageHistorique.length; r++) {
      for (let c = 0; c < plageHistorique[r].length; c++) {
        const v = parseFloat(plageHistorique[r][c]);
        if (!isNaN(v)) donnees.push(v);
      }
    }
  }

  if (donnees.length === 0) return "Erreur: aucune donnée numérique";
  if (donnees.length === 1) return donnees[0];

  // Initialisation : La première prévision est égale à la première valeur réelle
  let prevision = donnees[0];

  // Calcul itératif du lissage exponentiel : Ft+1 = a * Yt + (1 - a) * Ft
  for (let i = 1; i < donnees.length; i++) {
    const valeurReelle = donnees[i];
    prevision = a * valeurReelle + (1 - a) * prevision;
  }

  // La valeur 'prevision' en fin de boucle correspond bien à N+1
  return Math.round(prevision * 100) / 100;
}
