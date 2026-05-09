/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Ventilation de TVA — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Déduit automatiquement le montant de la TVA et le montant HT
 *    à partir d'un TTC et d'un code de catégorie (FR).
 *
 *  Fonctions exposées :
 *    • VENTILATION_TVA(montantTTC, categorie, [retour])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Ventile un montant TTC selon une catégorie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montantTTC Le montant TTC ou plage.
 * @param {string} categorie Catégorie (STANDARD, REDUIT, etc.).
 * @param {string} [retour="TVA"] "TVA", "HT" ou "TOUT".
 * @return {number|Array<Array<any>>}               Le montant calculé ou tableau de résultats.
 * @customfunction
 *
 *   =VENTILATION_TVA(120; "STANDARD")
 *   =VENTILATION_TVA(A2:A100; "REDUIT")
 */
function VENTILATION_TVA(montantTTC, categorie, retour = "TVA") {
  return batchProcess(montantTTC, (val) => {
    const ttc = parseFloat(val);
    if (isNaN(ttc)) return "Erreur: montant invalide";

    const cat = String(categorie).trim().toUpperCase();
    let taux = 0;

    switch (cat) {
      case "STANDARD": taux = 0.20; break;
      case "INTERMEDIAIRE": taux = 0.10; break;
      case "RESTAURATION": taux = 0.10; break;
      case "REDUIT": taux = 0.055; break;
      case "LIVRE": taux = 0.055; break;
      case "PARTICULIER": taux = 0.021; break;
      case "PRESSE": taux = 0.021; break;
      case "EXONERE": taux = 0; break;
      default:
        const t = parseFloat(categorie);
        if (!isNaN(t)) {
          taux = t > 1 ? t / 100 : t;
        } else {
          return "Catégorie inconnue";
        }
    }

    const ht = ttc / (1 + taux);
    const tva = ttc - ht;

    const resHT = Math.round(ht * 100) / 100;
    const resTVA = Math.round(tva * 100) / 100;

    const ret = String(retour).toUpperCase();
    if (ret === "HT") return resHT;
    if (ret === "TOUT") return [resHT, resTVA];
    
    return resTVA;
  });
}
