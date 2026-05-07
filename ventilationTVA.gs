/** @OnlyCurrentDoc */

/**
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
 */

/**
 * Ventile un montant TTC selon une catégorie.
 *
 * @param {number} montantTTC  Le montant TTC.
 * @param {string} categorie   "STANDARD" (20%), "INTERMEDIAIRE" (10%), "REDUIT" (5.5%), "PARTICULIER" (2.1%).
 * @param {string} [retour="TVA"] Ce qu'il faut retourner : "TVA", "HT" ou "TOUT" (renvoie un tableau).
 * @return {number|Array}      Le montant calculé.
 * @customfunction
 *
 * @example
 *   =VENTILATION_TVA(120; "STANDARD"; "TVA")  → 20
 */
function VENTILATION_TVA(montantTTC, categorie, retour = "TVA") {
  const ttc = parseFloat(montantTTC);
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
      // Si on passe directement le taux numérique
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
  if (ret === "TOUT") return [[resHT, resTVA]]; // Tableau pour déploiement sur 2 colonnes
  
  return resTVA; // Défaut
}
