/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Clé de Contrôle EAN13 — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule automatiquement le 13e chiffre (clé de contrôle) 
 *    d'un code-barres EAN13 à partir des 12 premiers chiffres.
 *
 *  Fonctions exposées :
 *    • CLE_EAN13(code12Chiffres)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule et ajoute la clé de contrôle EAN13.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} code12Chiffres Les 12 premiers chiffres ou plage.
 * @return {string|Array<Array<string>>}                 Le code-barres complet ou tableau de résultats.
 * @customfunction
 *
 * @example
 *   =CLE_EAN13("304692002260") → "3046920022605"
 *   =CLE_EAN13(A2:A100)
 */
function CLE_EAN13(code12Chiffres) {
  return batchProcess(code12Chiffres, (val) => {
    if (!val) return "Erreur: code manquant";

    const chaine = String(val).trim();
    
    if (!/^\d{12}$/.test(chaine)) {
      return "Erreur: le code doit contenir exactement 12 chiffres";
    }

    let sommePaire = 0;
    let sommeImpaire = 0;

    for (let i = 0; i < 12; i++) {
      const chiffre = parseInt(chaine[i], 10);
      if (i % 2 === 0) {
        sommeImpaire += chiffre;
      } else {
        sommePaire += chiffre * 3;
      }
    }

    const total = sommePaire + sommeImpaire;
    const reste = total % 10;
    let cle = 0;

    if (reste !== 0) {
      cle = 10 - reste;
    }

    return chaine + cle.toString();
  });
}
