/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Estimation Brut/Net (France) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Convertit rapidement un salaire Brut en Net (ou Net en Brut) 
 *    en appliquant des taux de charges moyens selon le statut (FR).
 *    /!\ À titre indicatif, ne remplace pas un logiciel de paie.
 *
 *  Fonctions exposées :
 *    • ESTIMATION_BRUT_NET(montant, statut, [sens])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Estime le salaire Brut/Net.
 *
 * @param {number} montant         Le salaire de base.
 * @param {string} statut          "Cadre", "Non-Cadre", "Fonctionnaire", "Stage", "Alternance".
 * @param {string} [sens="B2N"]    "B2N" (Brut vers Net) ou "N2B" (Net vers Brut).
 * @return {number}                Le salaire estimé.
 * @customfunction
 *
 * @example
 *   =ESTIMATION_BRUT_NET(3000; "Cadre"; "B2N")
 */
function ESTIMATION_BRUT_NET(montant, statut, sens = "B2N") {
  const m = parseFloat(montant);
  if (isNaN(m) || m <= 0) return "Erreur: montant invalide";

  const cat = String(statut).trim().toLowerCase();
  
  // Taux indicatifs moyens des charges salariales en France (2024/2025)
  let tauxCharges = 0;

  if (cat.includes("non")) { // "non-cadre"
    tauxCharges = 0.22; // ~22%
  } else if (cat.includes("cadre")) {
    tauxCharges = 0.25; // ~25%
  } else if (cat.includes("fonction") || cat.includes("public")) {
    tauxCharges = 0.15; // ~15%
  } else if (cat.includes("stage") || cat.includes("stagiaire")) {
    tauxCharges = 0; // Exonération (sur gratification légale)
  } else if (cat.includes("alternan") || cat.includes("apprenti")) {
    tauxCharges = 0; // Souvent exonéré de charges salariales
  } else {
    // Défaut
    tauxCharges = 0.23;
  }

  const direction = String(sens).toUpperCase();

  if (direction === "B2N" || direction === "BRUT2NET") {
    // Brut -> Net : Net = Brut * (1 - Taux)
    const net = m * (1 - tauxCharges);
    return Math.round(net * 100) / 100;
  } else if (direction === "N2B" || direction === "NET2BRUT") {
    // Net -> Brut : Brut = Net / (1 - Taux)
    // Protection division par 0
    if (tauxCharges >= 1) return "Erreur taux";
    const brut = m / (1 - tauxCharges);
    return Math.round(brut * 100) / 100;
  }

  return "Erreur: sens inconnu (utilisez B2N ou N2B)";
}
