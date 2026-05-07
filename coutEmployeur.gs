/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Coût Employeur Estimé — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Estime le coût total (Super Brut) que représente un salaire pour 
 *    l'employeur, en ajoutant les charges patronales au salaire brut.
 *
 *  Fonctions exposées :
 *    • COUT_EMPLOYEUR(salaireBrut, [statut])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Estime le coût total pour l'entreprise d'un salaire (Charges patronales).
 *
 * @param {number} salaireBrut Le salaire Brut.
 * @param {string} [statut]    "Cadre", "Non-Cadre" (Défaut).
 * @return {number}            Le coût employeur ("Super Brut").
 * @customfunction
 *
 * @example
 *   =COUT_EMPLOYEUR(3000; "Cadre")
 */
function COUT_EMPLOYEUR(salaireBrut, statut = "Non-Cadre") {
  const brut = parseFloat(salaireBrut);
  if (isNaN(brut) || brut <= 0) return 0;

  const cat = String(statut).trim().toLowerCase();
  
  // Taux indicatifs moyens des charges patronales en France
  // (Varie selon les allègements Fillon, les tranches, etc. Estimation à la louche : ~42 à 45%)
  let tauxPatronal = 0.42;

  if (cat.includes("cadre")) {
    tauxPatronal = 0.45; // Souvent légèrement plus élevé pour les cadres
  } else if (cat.includes("stage") || cat.includes("stagiaire")) {
    tauxPatronal = 0; // Exonéré sur la gratification
  }

  const superBrut = brut * (1 + tauxPatronal);

  return Math.round(superBrut * 100) / 100;
}
