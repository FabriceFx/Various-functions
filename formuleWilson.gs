/** @OnlyCurrentDoc */

/**
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
 */

/**
 * Calcule la quantité économique de commande (Formule de Wilson).
 *
 * @param {number} demandeAnnuelle      Volume de ventes estimé par an (en unités).
 * @param {number} coutCommande         Coût de passation d'une commande (en euros).
 * @param {number} coutStockageUnitaire Coût de possession d'une unité en stock sur un an (en euros).
 * @return {number}                     La quantité optimale à commander (arrondie).
 * @customfunction
 *
 * @example
 *   =QUANTITE_OPTIMALE(10000; 50; 2)
 */
function QUANTITE_OPTIMALE(demandeAnnuelle, coutCommande, coutStockageUnitaire) {
  const d = parseFloat(demandeAnnuelle);
  const s = parseFloat(coutCommande);
  const h = parseFloat(coutStockageUnitaire);

  if (isNaN(d) || isNaN(s) || isNaN(h)) return "Erreur: valeurs invalides";
  if (h <= 0) return "Erreur: le coût de stockage doit être > 0";
  if (d <= 0 || s < 0) return 0;

  // Q = RacineCarrée((2 * D * S) / H)
  const q = Math.sqrt((2 * d * s) / h);

  // On arrondit à l'unité supérieure car on commande rarement des fractions d'objet
  return Math.ceil(q);
}
