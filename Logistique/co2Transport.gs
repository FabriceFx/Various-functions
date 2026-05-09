/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Calcul de l'Empreinte Carbone Transport — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule les émissions de CO2 (en kg) pour un trajet donné 
 *    selon le mode de transport, en se basant sur les facteurs moyens (ADEME).
 *
 *  Fonctions exposées :
 *    • CO2_TRANSPORT(km, modeTransport)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule l'empreinte carbone d'un trajet en kgCO2e.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} km   La distance ou plage.
 * @param {string} modeTransport             Le mode ("voiture", "avion", "tgv", "bus", "velo").
 * @return {number|Array<Array<number>>}     Le poids en kg de CO2 équivalent ou tableau de résultats.
 * @customfunction
 *
 * @example
 *   =CO2_TRANSPORT(500; "avion")
 *   =CO2_TRANSPORT(A2:A100; "voiture")
 */
function CO2_TRANSPORT(km, modeTransport) {
  return batchProcess(km, (val) => {
    const distance = parseFloat(val);
    if (isNaN(distance) || distance < 0) return "Erreur: distance invalide";

    const mode = String(modeTransport).trim().toLowerCase();
    
    const facteurs = {
      "avion": 0.259,
      "voiture": 0.192,
      "voiture elec": 0.05,
      "bus": 0.03,
      "tgv": 0.002,
      "metro": 0.003,
      "velo": 0,
      "marche": 0
    };

    let facteur = facteurs[mode];
    if (facteur === undefined) {
      if (mode.includes("voiture") && mode.includes("elec")) facteur = facteurs["voiture elec"];
      else if (mode.includes("voiture")) facteur = facteurs["voiture"];
      else if (mode.includes("train")) facteur = facteurs["tgv"];
      else return "Erreur: Mode inconnu";
    }

    const co2 = distance * facteur;
    return Math.round(co2 * 100) / 100;
  });
}
