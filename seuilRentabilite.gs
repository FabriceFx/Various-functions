/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Seuil de Rentabilité — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le seuil de rentabilité (Break-even point) en unités 
 *    ou en chiffre d'affaires.
 *
 *  Fonctions exposées :
 *    • SEUIL_RENTABILITE(chargesFixes, prixVenteUnit, chargesVarUnit, [typeRetour])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule le point mort (seuil de rentabilité).
 *
 * @param {number} chargesFixes    Le total des charges fixes de l'entreprise.
 * @param {number} prixVenteUnit   Le prix de vente d'une unité.
 * @param {number} chargesVarUnit  Le coût variable d'une unité.
 * @param {string} [typeRetour="UNITE"] "UNITE" (renvoie la qté à vendre) ou "CA" (renvoie le CA à atteindre).
 * @return {number}                Le seuil de rentabilité.
 * @customfunction
 *
 * @example
 *   =SEUIL_RENTABILITE(10000; 50; 20)
 */
function SEUIL_RENTABILITE(chargesFixes, prixVenteUnit, chargesVarUnit, typeRetour = "UNITE") {
  const cf = parseFloat(chargesFixes);
  const pv = parseFloat(prixVenteUnit);
  const cv = parseFloat(chargesVarUnit);

  if (isNaN(cf) || isNaN(pv) || isNaN(cv)) return "Erreur: valeurs invalides";

  const margeSurCoutVariable = pv - cv;

  if (margeSurCoutVariable <= 0) {
    return "Erreur: la marge est négative ou nulle (non rentable)";
  }

  const seuilUnites = cf / margeSurCoutVariable;

  if (String(typeRetour).toUpperCase() === "CA") {
    // Seuil de rentabilité en valeur (Chiffre d'affaires)
    const tauxMarge = margeSurCoutVariable / pv;
    const seuilCA = cf / tauxMarge;
    return Math.round(seuilCA * 100) / 100;
  }

  // Renvoi en unités (arrondi à l'entier supérieur car on ne vend pas de demi-produit)
  return Math.ceil(seuilUnites);
}
