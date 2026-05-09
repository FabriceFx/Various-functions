/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Vérification de SIREN / SIRET — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Valide un numéro SIREN (9 chiffres) ou SIRET (14 chiffres) selon
 *    l'algorithme de Luhn. Gère le cas particulier de La Poste.
 *
 *  Fonctions exposées :
 *    • VERIF_SIRET(numero)  → "VALIDE" ou message d'erreur explicite
 *    • VERIF_SIREN(numero)  → "VALIDE" ou message d'erreur explicite
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Vérifie la validité d'un numéro SIRET (14 chiffres) via l'algorithme de Luhn.
 * Gère le cas particulier de La Poste (SIREN 356000000).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} numero Le SIRET ou plage.
 * @return {string|Array<Array<string>>}           "VALIDE" ou message d'erreur.
 * @customfunction
 *
 *   =VERIF_SIRET("732 829 320 00074")  → "VALIDE"
 *   =VERIF_SIRET(A2:A100)
 */
function VERIF_SIRET(numero) {
  return BATCH_PROCESS(numero, (val) => {
    if (val == null || String(val).trim() === "") {
      return "INVALIDE — aucun numéro fourni";
    }

    const clean = String(val).replace(/[\s.\-]/g, "");

    if (!/^\d+$/.test(clean)) {
      return "INVALIDE — chiffres uniquement";
    }

    if (clean.length !== 14) {
      return `INVALIDE — longueur incorrecte (${clean.length})`;
    }

    const siren = clean.substring(0, 9);
    if (siren === "356000000") {
      const somme = clean.split("").reduce((acc, ch) => acc + parseInt(ch, 10), 0);
      if (somme % 5 !== 0) {
        return "INVALIDE — contrôle La Poste";
      }
      return "VALIDE";
    }

    if (!luhn_(clean)) {
      return "INVALIDE — clé de Luhn incorrecte";
    }

    return "VALIDE";
  });
}

/**
 * Vérifie la validité d'un numéro SIREN (9 chiffres) via l'algorithme de Luhn.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} numero Le SIREN ou plage.
 * @return {string|Array<Array<string>>}           "VALIDE" ou message d'erreur.
 * @customfunction
 *
 *   =VERIF_SIREN("732 829 320")  → "VALIDE"
 *   =VERIF_SIREN(A2:A100)
 */
function VERIF_SIREN(numero) {
  return BATCH_PROCESS(numero, (val) => {
    if (val == null || String(val).trim() === "") {
      return "INVALIDE — aucun numéro fourni";
    }

    const clean = String(val).replace(/[\s.\-]/g, "");

    if (!/^\d+$/.test(clean)) {
      return "INVALIDE — chiffres uniquement";
    }

    if (clean.length !== 9) {
      return `INVALIDE — longueur incorrecte (${clean.length})`;
    }

    if (!luhn_(clean)) {
      return "INVALIDE — clé de Luhn incorrecte";
    }

    return "VALIDE";
  });
}

/**
 * Vérifie une chaîne de chiffres selon l'algorithme de Luhn.
 *
 * @param {string} chaine Chaîne composée uniquement de chiffres.
 * @return {boolean}       true si la clé de Luhn est valide.
 * @private
 */
const luhn_ = (chaine) => {
  let somme = 0;
  let pair = false;
  for (let i = chaine.length - 1; i >= 0; i--) {
    let chiffre = parseInt(chaine[i], 10);
    if (pair) {
      chiffre *= 2;
      if (chiffre > 9) chiffre -= 9;
    }
    somme += chiffre;
    pair = !pair;
  }
  return somme % 10 === 0;
};
