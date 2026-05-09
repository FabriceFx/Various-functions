/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Arrondi Comptable — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Applique un arrondi comptable / bancaire (round half to even).
 *    Si la décimale est exactement 0.5, on arrondit vers le pair le plus proche.
 *    Ex: 2.5 -> 2 | 3.5 -> 4
 *
 *  Fonctions exposées :
 *    • arrondiComptable(nombre, [decimales])  → Nombre arrondi
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Arrondit un nombre selon la méthode comptable (arrondi au pair).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} nombre     Le nombre à arrondir ou plage.
 * @param {number} [decimales] Le nombre de décimales (2 par défaut).
 * @return {number|Array<Array<number>>}           Le nombre arrondi ou tableau de résultats.
 * @customfunction
 *
 * @example
 *   =arrondiComptable(2.5; 0)  → 2
 *   =arrondiComptable(A2:A100; 2)
 */
function arrondiComptable(nombre, decimales = 2) {
  return batchProcess(nombre, (val) => {
    const num = parseFloat(val);
    const dec = parseInt(decimales, 10);
    
    if (isNaN(num)) return "Erreur: nombre attendu";
    if (isNaN(dec)) return "Erreur: décimales invalides";

    const facteur = Math.pow(10, dec);
    const nbDecale = num * facteur;
    const valEntiere = Math.floor(nbDecale);
    const reste = nbDecale - valEntiere;
    
    let resultat;
    
    // Tolérance pour les erreurs en virgule flottante
    if (Math.abs(reste - 0.5) < Number.EPSILON) {
      // Si la valeur entière est paire, on arrondit au pair inférieur, sinon au pair supérieur
      resultat = (valEntiere % 2 === 0) ? valEntiere : valEntiere + 1;
    } else {
      // Sinon arrondi classique
      resultat = Math.round(nbDecale);
    }
    
    return resultat / facteur;
  });
}
