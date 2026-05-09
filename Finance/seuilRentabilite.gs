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
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} chargesFixes    Le total des charges fixes ou plage.
 * @param {number} prixVenteUnit   Le prix de vente d'une unité.
 * @param {number} chargesVarUnit  Le coût variable d'une unité.
 * @param {string} [typeRetour="UNITE"] "UNITE" ou "CA".
 * @return {number|Array<Array<number>>}                Le seuil de rentabilité ou tableau de résultats.
 * @customfunction
 *
 *   =SEUIL_RENTABILITE(10000; 50; 20)
 *   =SEUIL_RENTABILITE(A2:A100; 50; 20)
 */
function SEUIL_RENTABILITE(chargesFixes, prixVenteUnit, chargesVarUnit, typeRetour = "UNITE") {
  return batchProcess(chargesFixes, (val) => {
    const cf = parseFloat(val);
    const pv = parseFloat(prixVenteUnit);
    const cv = parseFloat(chargesVarUnit);

    if (isNaN(cf) || isNaN(pv) || isNaN(cv)) return "Erreur: valeurs invalides";

    const margeSurCoutVariable = pv - cv;

    if (margeSurCoutVariable <= 0) {
      return "Erreur: la marge est négative ou nulle (non rentable)";
    }

    const seuilUnites = cf / margeSurCoutVariable;

    if (String(typeRetour).toUpperCase() === "CA") {
      const tauxMarge = margeSurCoutVariable / pv;
      const seuilCA = cf / tauxMarge;
      return Math.round(seuilCA * 100) / 100;
    }

    return Math.ceil(seuilUnites);
  });
}
