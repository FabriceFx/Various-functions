/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Alerte Stock — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Retourne un statut de réapprovisionnement basé sur le stock actuel,
 *    le seuil d'alerte, et le rythme de vente quotidien moyen.
 *
 *  Fonctions exposées :
 *    • ALERTE_STOCK(stockActuel, seuilMini, [ventesParJour])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Détermine le statut d'alerte du stock.
 *
 * @param {number} stockActuel    La quantité en stock.
 * @param {number} seuilMini      Le seuil sous lequel il faut commander.
 * @param {number} [ventesParJour=0] Ventes moyennes par jour pour estimer la rupture.
 * @return {string}               Statut (Ex: "Rupture dans X jours").
 * @customfunction
 *
 * @example
 *   =ALERTE_STOCK(15; 20; 2)
 */
function ALERTE_STOCK(stockActuel, seuilMini, ventesParJour = 0) {
  const stock = parseInt(stockActuel, 10);
  const seuil = parseInt(seuilMini, 10);
  const ventes = parseFloat(ventesParJour);

  if (isNaN(stock) || isNaN(seuil)) return "Erreur: valeurs invalides";

  if (stock <= 0) {
    return "❌ RUPTURE";
  }

  if (stock <= seuil) {
    let msg = "⚠️ À COMMANDER";
    if (ventes > 0) {
      const joursRestants = Math.floor(stock / ventes);
      msg += ` (Rupture estimée dans ${joursRestants} j)`;
    }
    return msg;
  }

  return "✅ OK";
}
