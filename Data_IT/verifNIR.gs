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
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} nir  Le NIR ou plage.
 * @return {string|Array<Array<string>>}        "VALIDE" ou message d'erreur.
 * @customfunction
 *
 * @example
 *   =verifNIR("2 85 01 78 006 084 19")  → "VALIDE"
 *   =verifNIR(A2:A100)
 */
function verifNIR(nir) {
  return batchProcess(nir, (val) => {
    if (val == null || String(val).trim() === "") {
      return "INVALIDE — aucun numéro fourni";
    }

    let clean = String(val).toUpperCase().replace(/[\s.\-]/g, "");

    if (!/^\d{1}\d{2}\d{2}(2[AB]|\d{2})\d{3}\d{3}\d{2}$/.test(clean)) {
      return "INVALIDE — format incorrect (15 chiffres)";
    }

    const sexe = parseInt(clean[0], 10);
    if (sexe !== 1 && sexe !== 2) {
      return "INVALIDE — sexe (1 ou 2)";
    }

    const mois = parseInt(clean.substring(3, 5), 10);
    if (mois < 1 || (mois > 12 && mois < 20) || mois > 42) {
      return `INVALIDE — mois (${mois})`;
    }

    const deptStr = clean.substring(5, 7);
    if (deptStr !== "2A" && deptStr !== "2B") {
      const dept = parseInt(deptStr, 10);
      if (dept < 1 || (dept > 95 && dept < 97) || dept > 99) {
        return `INVALIDE — département (${deptStr})`;
      }
    }

    const cleIndiquee = parseInt(clean.substring(13, 15), 10);
    let nirPourCalcul = clean.substring(0, 13);
    if (deptStr === "2A") nirPourCalcul = nirPourCalcul.replace("2A", "19");
    else if (deptStr === "2B") nirPourCalcul = nirPourCalcul.replace("2B", "18");

    const cleCalculee = 97 - Number(BigInt(nirPourCalcul) % BigInt(97));

    if (cleIndiquee !== cleCalculee) {
      return `INVALIDE — clé (${cleIndiquee} vs ${cleCalculee})`;
    }

    return "VALIDE";
  });
}
