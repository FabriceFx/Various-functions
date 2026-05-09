/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Calcul de Volumétrie Transport — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le volume en m³ d'un colis.
 *    Optionnellement, calcule le poids volumétrique (standard aérien : divisé par 5000).
 *
 *  Fonctions exposées :
 *    • CALCUL_VOLUMETRIE(longueur, largeur, hauteur, [unite], [calculPoidsVol])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule le volume (en m3) ou le poids volumétrique.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} longueur Longueur ou plage.
 * @param {number} largeur Largeur.
 * @param {number} hauteur Hauteur.
 * @param {string} [unite="cm"] Unité de mesure ("cm" ou "m"). Par défaut "cm".
 * @param {boolean} [calculPoidsVol=false] Si VRAI, renvoie le poids volumétrique (base 5000).
 * @return {number|Array<Array<number>>}           Le résultat arrondi ou tableau de résultats.
 * @customfunction
 *
 *   =CALCUL_VOLUMETRIE(50; 40; 30; "cm"; FAUX)  → 0.06 (m3)
 *   =CALCUL_VOLUMETRIE(A2:A100; 40; 30)
 */
function CALCUL_VOLUMETRIE(longueur, largeur, hauteur, unite = "cm", calculPoidsVol = false) {
  return batchProcess(longueur, (val) => {
    const l = parseFloat(val);
    const w = parseFloat(largeur);
    const h = parseFloat(hauteur);

    if (isNaN(l) || isNaN(w) || isNaN(h)) return "Erreur: dimensions invalides";

    let volumeEnCm3 = l * w * h;

    if (String(unite).toLowerCase() === "m") {
      volumeEnCm3 = volumeEnCm3 * 1000000;
    }

    if (calculPoidsVol) {
      const poidsVol = volumeEnCm3 / 5000;
      return Math.round(poidsVol * 100) / 100;
    } else {
      const volumeM3 = volumeEnCm3 / 1000000;
      return Math.round(volumeM3 * 1000) / 1000;
    }
  });
}
