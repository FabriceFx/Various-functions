/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Formule de Wilson (EOQ) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    La formule de Wilson (Economic Order Quantity) permet de déterminer
 *    la quantité optimale à commander afin de minimiser le coût total 
 *    de gestion des stocks (coût de passation de commande + coût de possession).
 *
 *  Fonctions exposées :
 *    • QUANTITE_OPTIMALE(demandeAnnuelle, coutCommande, coutStockageUnitaire)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule la quantité économique de commande (Formule de Wilson).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} demandeAnnuelle Volume de ventes ou plage.
 * @param {number} coutCommande Coût passation commande.
 * @param {number} coutStockageUnitaire Coût possession unitaire.
 * @return {number|Array<Array<number>>}                La quantité optimale ou tableau.
 * @customfunction
 *
 *   =QUANTITE_OPTIMALE(10000; 50; 2)
 *   =QUANTITE_OPTIMALE(A2:A100; 50; 2)
 */
function QUANTITE_OPTIMALE(demandeAnnuelle, coutCommande, coutStockageUnitaire) {
  return batchProcess(demandeAnnuelle, (val) => {
    const d = parseFloat(val);
    const s = parseFloat(coutCommande);
    const h = parseFloat(coutStockageUnitaire);

    if (isNaN(d) || isNaN(s) || isNaN(h)) return "Erreur: valeurs invalides";
    if (h <= 0) return "Erreur: stockage > 0";
    if (d <= 0 || s < 0) return 0;

    const q = Math.sqrt((2 * d * s) / h);
    return Math.ceil(q);
  });
}
