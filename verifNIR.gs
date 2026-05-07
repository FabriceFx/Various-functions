/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Vérification du NIR (n° de Sécurité Sociale) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Valide un NIR français à 15 caractères. Vérifie le format, la
 *    cohérence (sexe, mois, département) et la clé modulo 97.
 *    Gère les départements corses (2A, 2B).
 *
 *  Fonctions exposées :
 *    • verifNIR(nir)  → "VALIDE" ou message d'erreur explicite
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Vérifie la validité d'un NIR (n° de Sécurité Sociale français).
 *
 * @param {string|number} nir  Le NIR à vérifier (espaces tolérés).
 * @return {string}            "VALIDE" ou message d'erreur explicite.
 * @customfunction
 *
 * @example
 *   =verifNIR("2 85 01 78 006 084 19")  → "VALIDE"
 */
function verifNIR(nir) {
  if (nir == null || String(nir).trim() === "") {
    return "INVALIDE — aucun numéro fourni";
  }

  let clean = String(nir).toUpperCase().replace(/[\s.\-]/g, "");

  if (!/^\d{1}\d{2}\d{2}(2[AB]|\d{2})\d{3}\d{3}\d{2}$/.test(clean)) {
    return "INVALIDE — format incorrect (attendu : 15 caractères)";
  }

  const sexe = parseInt(clean[0], 10);
  if (sexe !== 1 && sexe !== 2) {
    return "INVALIDE — le 1er chiffre doit être 1 (homme) ou 2 (femme)";
  }

  const mois = parseInt(clean.substring(3, 5), 10);
  if (mois < 1 || (mois > 12 && mois < 20) || mois > 42) {
    return `INVALIDE — mois de naissance incorrect (${mois})`;
  }

  const deptStr = clean.substring(5, 7);
  if (deptStr !== "2A" && deptStr !== "2B") {
    const dept = parseInt(deptStr, 10);
    if (dept < 1 || (dept > 95 && dept < 97) || dept > 99) {
      return `INVALIDE — département incorrect (${deptStr})`;
    }
  }

  const cleIndiquee = parseInt(clean.substring(13, 15), 10);
  let nirPourCalcul = clean.substring(0, 13);
  if (deptStr === "2A") nirPourCalcul = nirPourCalcul.replace("2A", "19");
  else if (deptStr === "2B") nirPourCalcul = nirPourCalcul.replace("2B", "18");

  const cleCalculee = 97 - Number(BigInt(nirPourCalcul) % 97n);

  if (cleIndiquee !== cleCalculee) {
    return `INVALIDE — clé incorrecte (${cleIndiquee} au lieu de ${cleCalculee})`;
  }

  return "VALIDE";
}
