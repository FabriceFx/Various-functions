/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Conversion HT / TTC — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Convertit un montant HT en TTC ou inversement, en fonction d'un
 *    taux de TVA paramétrable.
 *
 *  Fonctions exposées :
 *    • htToTTC(montantHT, tauxTVA)  → Montant TTC
 *    • ttcToHT(montantTTC, tauxTVA) → Montant HT
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule le montant TTC à partir d'un montant HT et d'un taux de TVA.
 *
 * @param {number} montantHT  Le montant Hors Taxes.
 * @param {number} tauxTVA    Le taux de TVA (ex: 20 pour 20%, ou 0.2).
 * @return {number}           Le montant Toutes Taxes Comprises (arrondi 2 décimales).
 * @customfunction
 *
 * @example
 *   =htToTTC(100; 20)  → 120
 */
function htToTTC(montantHT, tauxTVA) {
  const ht = parseFloat(montantHT);
  const tva = parseFloat(tauxTVA);
  
  if (isNaN(ht) || isNaN(tva)) return "Erreur: nombre attendu";

  // Si l'utilisateur saisit 20 au lieu de 0.2
  const multiplicateur = (tva >= 1) ? (1 + tva / 100) : (1 + tva);
  
  return Math.round((ht * multiplicateur) * 100) / 100;
}

/**
 * Calcule le montant HT à partir d'un montant TTC et d'un taux de TVA.
 *
 * @param {number} montantTTC Le montant Toutes Taxes Comprises.
 * @param {number} tauxTVA    Le taux de TVA (ex: 20 pour 20%, ou 0.2).
 * @return {number}           Le montant Hors Taxes (arrondi 2 décimales).
 * @customfunction
 *
 * @example
 *   =ttcToHT(120; 20)  → 100
 */
function ttcToHT(montantTTC, tauxTVA) {
  const ttc = parseFloat(montantTTC);
  const tva = parseFloat(tauxTVA);
  
  if (isNaN(ttc) || isNaN(tva)) return "Erreur: nombre attendu";

  // Si l'utilisateur saisit 20 au lieu de 0.2
  const diviseur = (tva >= 1) ? (1 + tva / 100) : (1 + tva);
  
  return Math.round((ttc / diviseur) * 100) / 100;
}
