/*
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
 * @OnlyCurrentDoc
 */

/**
 * Estime le coût total pour l'entreprise d'un salaire (Charges patronales).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} salaireBrut Le salaire Brut ou plage.
 * @param {string} [statut] "Cadre", "Non-Cadre" (Défaut).
 * @return {number|Array<Array<number>>}            Le coût employeur ou tableau de résultats.
 * @customfunction
 *
 *   =COUT_EMPLOYEUR(3000; "Cadre")
 *   =COUT_EMPLOYEUR(A2:A100)
 */
function COUT_EMPLOYEUR(salaireBrut, statut = "Non-Cadre") {
  return BATCH_PROCESS(salaireBrut, (val) => {
    const brut = parseFloat(val);
    if (isNaN(brut) || brut <= 0) return 0;

    const cat = String(statut).trim().toLowerCase();
    let tauxPatronal = 0.42;

    if (cat.includes("cadre")) {
      tauxPatronal = 0.45;
    } else if (cat.includes("stage") || cat.includes("stagiaire")) {
      tauxPatronal = 0;
    }

    const superBrut = brut * (1 + tauxPatronal);
    return Math.round(superBrut * 100) / 100;
  });
}
