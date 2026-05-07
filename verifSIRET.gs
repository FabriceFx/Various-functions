/** @OnlyCurrentDoc */

/**
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
 *    • verifSIRET(numero)  → "VALIDE" ou message d'erreur explicite
 *    • verifSIREN(numero)  → "VALIDE" ou message d'erreur explicite
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Vérifie la validité d'un numéro SIRET (14 chiffres) via l'algorithme de Luhn.
 * Gère le cas particulier de La Poste (SIREN 356000000).
 *
 * @param {string|number} numero  Le numéro SIRET à vérifier (espaces tolérés).
 * @return {string}               "VALIDE" ou message d'erreur explicite.
 * @customfunction
 *
 * @example
 *   =verifSIRET("732 829 320 00074")  → "VALIDE"
 *   =verifSIRET("123 456 789 00000")  → "INVALIDE — clé de Luhn incorrecte"
 */
function verifSIRET(numero) {
  if (numero == null || String(numero).trim() === "") {
    return "INVALIDE — aucun numéro fourni";
  }

  const clean = String(numero).replace(/[\s.\-]/g, "");

  if (!/^\d+$/.test(clean)) {
    return "INVALIDE — le SIRET ne doit contenir que des chiffres";
  }

  if (clean.length !== 14) {
    return `INVALIDE — longueur incorrecte (${clean.length} chiffres au lieu de 14)`;
  }

  // Cas particulier : La Poste (SIREN 356000000)
  const siren = clean.substring(0, 9);
  if (siren === "356000000") {
    const somme = clean.split("").reduce((acc, ch) => acc + parseInt(ch, 10), 0);
    if (somme % 5 !== 0) {
      return "INVALIDE — clé de contrôle incorrecte (La Poste)";
    }
    return "VALIDE";
  }

  if (!luhn_(clean)) {
    return "INVALIDE — clé de Luhn incorrecte";
  }

  return "VALIDE";
}


/**
 * Vérifie la validité d'un numéro SIREN (9 chiffres) via l'algorithme de Luhn.
 *
 * @param {string|number} numero  Le numéro SIREN à vérifier (espaces tolérés).
 * @return {string}               "VALIDE" ou message d'erreur explicite.
 * @customfunction
 *
 * @example
 *   =verifSIREN("732 829 320")  → "VALIDE"
 */
function verifSIREN(numero) {
  if (numero == null || String(numero).trim() === "") {
    return "INVALIDE — aucun numéro fourni";
  }

  const clean = String(numero).replace(/[\s.\-]/g, "");

  if (!/^\d+$/.test(clean)) {
    return "INVALIDE — le SIREN ne doit contenir que des chiffres";
  }

  if (clean.length !== 9) {
    return `INVALIDE — longueur incorrecte (${clean.length} chiffres au lieu de 9)`;
  }

  if (!luhn_(clean)) {
    return "INVALIDE — clé de Luhn incorrecte";
  }

  return "VALIDE";
}


/**
 * Vérifie une chaîne de chiffres selon l'algorithme de Luhn.
 *
 * @param {string} chaine  Chaîne composée uniquement de chiffres.
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
