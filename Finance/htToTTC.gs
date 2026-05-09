/*
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
 *    • HT_TO_TTC(montantHT, tauxTVA)  → Montant TTC
 *    • TTC_TO_HT(montantTTC, tauxTVA) → Montant HT
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule le montant TTC à partir d'un montant HT et d'un taux de TVA.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montantHT Le montant Hors Taxes ou plage.
 * @param {number} tauxTVA Le taux de TVA (ex: 20 pour 20%, ou 0.2).
 * @return {number|Array<Array<number>>}           Le montant TTC ou tableau de résultats.
 * @customfunction
 *
 *   =HT_TO_TTC(100; 20)  → 120
 *   =HT_TO_TTC(A2:A100; 20)
 */
function HT_TO_TTC(montantHT, tauxTVA) {
  return BATCH_PROCESS(montantHT, (val) => {
    const ht = parseFloat(val);
    const tva = parseFloat(tauxTVA);
    
    if (isNaN(ht) || isNaN(tva)) return "Erreur: nombre attendu";

    const multiplicateur = (tva >= 1) ? (1 + tva / 100) : (1 + tva);
    return Math.round((ht * multiplicateur) * 100) / 100;
  });
}

/**
 * Calcule le montant HT à partir d'un montant TTC et d'un taux de TVA.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montantTTC Le montant TTC ou plage.
 * @param {number} tauxTVA Le taux de TVA (ex: 20 pour 20%, ou 0.2).
 * @return {number|Array<Array<number>>}           Le montant HT ou tableau de résultats.
 * @customfunction
 *
 *   =TTC_TO_HT(120; 20)  → 100
 *   =TTC_TO_HT(A2:A100; 20)
 */
function TTC_TO_HT(montantTTC, tauxTVA) {
  return BATCH_PROCESS(montantTTC, (val) => {
    const ttc = parseFloat(val);
    const tva = parseFloat(tauxTVA);
    
    if (isNaN(ttc) || isNaN(tva)) return "Erreur: nombre attendu";

    const diviseur = (tva >= 1) ? (1 + tva / 100) : (1 + tva);
    return Math.round((ttc / diviseur) * 100) / 100;
  });
}
