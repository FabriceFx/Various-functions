/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Prix Psychologique — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Arrondit un prix brut (issu d'un calcul de marge par exemple) 
 *    vers le prix psychologique le plus cohérent (.90, .99).
 *
 *  Fonctions exposées :
 *    • PRIX_PSYCHOLOGIQUE(prixCalcule, [terminaison])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Convertit un prix brut en prix psychologique.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} prixCalcule Le prix ou plage.
 * @param {number} [terminaison=99] La terminaison souhaitée en centimes.
 * @return {number|Array<Array<number>>}            Le prix formaté ou tableau de résultats.
 * @customfunction
 *
 *   =PRIX_PSYCHOLOGIQUE(14.12; 99) → 14.99
 *   =PRIX_PSYCHOLOGIQUE(A2:A100; 95)
 */
function PRIX_PSYCHOLOGIQUE(prixCalcule, terminaison = 99) {
  return BATCH_PROCESS(prixCalcule, (val) => {
    const p = parseFloat(val);
    const term = parseInt(terminaison, 10);

    if (isNaN(p)) return "Erreur: prix invalide";
    if (isNaN(term) || term < 0 || term > 99) return "Erreur: terminaison invalide";

    const baseEntiere = Math.floor(p);
    const decimales = p - baseEntiere;
    const termDecimale = term / 100;

    let nouveauPrix = 0;

    if (decimales > termDecimale) {
      nouveauPrix = baseEntiere + 1 + termDecimale;
    } else {
      nouveauPrix = baseEntiere + termDecimale;
    }

    return Math.round(nouveauPrix * 100) / 100;
  });
}
