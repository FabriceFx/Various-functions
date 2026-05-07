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
 *
 * @param {number} km             La distance en kilomètres.
 * @param {string} modeTransport  Le mode ("voiture", "avion", "tgv", "bus", "velo").
 * @return {number}               Le poids en kg de CO2 équivalent.
 * @customfunction
 *
 * @example
 *   =CO2_TRANSPORT(500; "avion")
 */
function CO2_TRANSPORT(km, modeTransport) {
  const distance = parseFloat(km);
  if (isNaN(distance) || distance < 0) return "Erreur: distance invalide";

  const mode = String(modeTransport).trim().toLowerCase();
  
  // Facteurs d'émission moyens (kg CO2e par passager.km) - Valeurs indicatives ADEME
  const facteurs = {
    "avion": 0.259,       // Vol court/moyen courrier
    "voiture": 0.192,     // Voiture thermique moyenne (1 passager)
    "voiture elec": 0.05, // Voiture électrique (mix FR)
    "bus": 0.03,          // Autocar
    "tgv": 0.002,         // Train grande ligne (FR)
    "metro": 0.003,
    "velo": 0,
    "marche": 0
  };

  let facteur = facteurs[mode];
  if (facteur === undefined) {
    // Si inconnu, on retourne une erreur ou on cherche des correspondances
    if (mode.includes("voiture") && mode.includes("elec")) facteur = facteurs["voiture elec"];
    else if (mode.includes("voiture")) facteur = facteurs["voiture"];
    else if (mode.includes("train")) facteur = facteurs["tgv"];
    else return "Erreur: Mode inconnu (essayez: voiture, avion, tgv, bus...)";
  }

  const co2 = distance * facteur;
  return Math.round(co2 * 100) / 100;
}
