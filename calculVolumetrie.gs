/** @OnlyCurrentDoc */

/**
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
 */

/**
 * Calcule le volume (en m3) ou le poids volumétrique.
 *
 * @param {number} longueur   Longueur.
 * @param {number} largeur    Largeur.
 * @param {number} hauteur    Hauteur.
 * @param {string} [unite="cm"] Unité de mesure ("cm" ou "m"). Par défaut "cm".
 * @param {boolean} [calculPoidsVol=false] Si VRAI, renvoie le poids volumétrique (base 5000).
 * @return {number}           Le résultat arrondi.
 * @customfunction
 *
 * @example
 *   =CALCUL_VOLUMETRIE(50; 40; 30; "cm"; FAUX)  → 0.06 (m3)
 */
function CALCUL_VOLUMETRIE(longueur, largeur, hauteur, unite = "cm", calculPoidsVol = false) {
  const l = parseFloat(longueur);
  const w = parseFloat(largeur);
  const h = parseFloat(hauteur);

  if (isNaN(l) || isNaN(w) || isNaN(h)) return "Erreur: dimensions invalides";

  let volumeEnCm3 = l * w * h;

  if (String(unite).toLowerCase() === "m") {
    // Si c'est en mètres, on convertit le volume résultant en cm³ (1 m³ = 1 000 000 cm³) pour la consistance
    volumeEnCm3 = volumeEnCm3 * 1000000;
  }

  if (calculPoidsVol) {
    // Poids volumétrique standard (IATA) : L(cm) x l(cm) x h(cm) / 5000 = Poids volumétrique en Kg
    const poidsVol = volumeEnCm3 / 5000;
    return Math.round(poidsVol * 100) / 100;
  } else {
    // Retour en m3
    const volumeM3 = volumeEnCm3 / 1000000;
    return Math.round(volumeM3 * 1000) / 1000;
  }
}
