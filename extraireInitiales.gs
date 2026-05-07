/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction d'initiales — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Extrait les initiales d'un nom ou d'une phrase. Gère les noms
 *    composés avec tirets et les particules françaises.
 *
 *  Fonctions exposées :
 *    • extraireInitiales(texte)  → initiales en majuscules
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

// Particules françaises à ignorer
const PARTICULES_ = new Set(["de", "du", "des", "le", "la", "les", "l", "d", "von", "van", "di"]);


/**
 * Extrait les initiales d'un nom ou d'une phrase.
 * Gère les noms composés (tirets) et ignore les particules françaises.
 *
 * @param {string} texte           Le texte dont extraire les initiales.
 * @param {boolean} [avecParticules=false]  Si true, inclut les particules.
 * @return {string}                Les initiales en majuscules.
 * @customfunction
 *
 * @example
 *   =extraireInitiales("Jean-Pierre Dupont")                → "JPD"
 *   =extraireInitiales("Charles de Gaulle")                 → "CG"
 *   =extraireInitiales("Charles de Gaulle"; VRAI)           → "CDG"
 */
function extraireInitiales(texte, avecParticules = false) {
  if (texte == null || String(texte).trim() === "") return "";

  const mots = String(texte).trim().split(/[\s]+/);
  let initiales = "";

  for (const mot of mots) {
    const motClean = mot.replace(/['']/g, " ").trim();
    if (motClean === "") continue;

    // Ignorer les particules sauf si demandé
    if (!avecParticules && PARTICULES_.has(motClean.toLowerCase())) continue;

    // Gérer les noms composés avec tiret
    const sousParties = motClean.split("-");
    for (const partie of sousParties) {
      if (partie.length > 0) {
        initiales += partie[0].toUpperCase();
      }
    }
  }

  return initiales;
}
