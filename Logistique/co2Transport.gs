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

/**
 * Estime le CO2 pour un vol entre deux aéroports (codes IATA).
 * @param {string} codeDep Code IATA de départ (ex: "CDG").
 * @param {string} codeArr Code IATA d'arrivée (ex: "JFK").
 * @return {number} Estimation en kgCO2e.
 * @customfunction
 */
function CO2_FLIGHT_ESTIMATOR(codeDep, codeArr) {
  const airports = {
    "CDG": {lat: 49.0097, lon: 2.5479},
    "JFK": {lat: 40.6413, lon: -73.7781},
    "LHR": {lat: 51.4700, lon: -0.4543},
    "DXB": {lat: 25.2532, lon: 55.3657},
    "SIN": {lat: 1.3644, lon: 103.9915},
    "SFO": {lat: 37.6213, lon: -122.3790},
    "HND": {lat: 35.5494, lon: 139.7798},
    "SYD": {lat: -33.9399, lon: 151.1753}
  };

  const a1 = airports[String(codeDep).toUpperCase().trim()];
  const a2 = airports[String(codeArr).toUpperCase().trim()];

  if (!a1 || !a2) return "⚠️ Codes IATA inconnus (Exemples supportés: CDG, JFK, LHR, DXB, SIN, SFO, HND, SYD)";

  // Distance Haversine
  const R = 6371; // Rayon terre
  const dLat = (a2.lat - a1.lat) * Math.PI / 180;
  const dLon = (a2.lon - a1.lon) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(a1.lat * Math.PI / 180) * Math.cos(a2.lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Facteur moyen avion (kgCO2/km)
  const facteur = distance < 1000 ? 0.259 : 0.187; // Court-courrier vs Long-courrier
  return Math.round(distance * facteur);
}
