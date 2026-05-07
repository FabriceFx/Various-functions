/** @OnlyCurrentDoc */

/**
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
 */

/**
 * Convertit un prix brut en prix psychologique.
 *
 * @param {number} prixCalcule Le prix mathématique de base.
 * @param {number} [terminaison=99] La terminaison souhaitée en centimes (ex: 90 ou 99).
 * @return {number}            Le prix formaté.
 * @customfunction
 *
 * @example
 *   =PRIX_PSYCHOLOGIQUE(14.12; 99) → 14.99
 *   =PRIX_PSYCHOLOGIQUE(103.50; 90) → 104.90
 */
function PRIX_PSYCHOLOGIQUE(prixCalcule, terminaison = 99) {
  const p = parseFloat(prixCalcule);
  const term = parseInt(terminaison, 10);

  if (isNaN(p)) return "Erreur: prix invalide";
  if (isNaN(term) || term < 0 || term > 99) return "Erreur: terminaison invalide";

  const baseEntiere = Math.floor(p);
  const decimales = p - baseEntiere;
  const termDecimale = term / 100;

  let nouveauPrix = 0;

  // Si les décimales sont déjà au-dessus de la terminaison souhaitée, 
  // on passe à l'unité supérieure. (ex: 14.99 -> base 15.99)
  if (decimales > termDecimale) {
    nouveauPrix = baseEntiere + 1 + termDecimale;
  } else {
    // Sinon on ajuste simplement les centimes de l'unité courante
    nouveauPrix = baseEntiere + termDecimale;
  }

  return Math.round(nouveauPrix * 100) / 100;
}
