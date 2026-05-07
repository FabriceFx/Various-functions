/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Vérification de carte bancaire — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Valide un numéro de carte bancaire via l'algorithme de Luhn.
 *    Détecte le réseau (Visa, Mastercard, Amex, CB).
 *
 *  Fonctions exposées :
 *    • verifCB(numero)    → "VALIDE (Visa)" ou message d'erreur
 *    • detectReseau(num)  → "Visa", "Mastercard", etc.
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Vérifie la validité d'un numéro de carte bancaire (algorithme de Luhn).
 *
 * @param {string|number} numero  Numéro de CB (espaces et tirets tolérés).
 * @return {string}               "VALIDE (réseau)" ou message d'erreur.
 * @customfunction
 *
 * @example
 *   =verifCB("4539 1488 0343 6467")  → "VALIDE (Visa)"
 */
function verifCB(numero) {
  if (numero == null || String(numero).trim() === "") {
    return "INVALIDE — aucun numéro fourni";
  }

  const clean = String(numero).replace(/[\s\-\.]/g, "");

  if (!/^\d+$/.test(clean)) {
    return "INVALIDE — ne doit contenir que des chiffres";
  }

  if (clean.length < 13 || clean.length > 19) {
    return `INVALIDE — longueur incorrecte (${clean.length} chiffres, attendu 13-19)`;
  }

  // Algorithme de Luhn
  let somme = 0;
  let pair = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let chiffre = parseInt(clean[i], 10);
    if (pair) {
      chiffre *= 2;
      if (chiffre > 9) chiffre -= 9;
    }
    somme += chiffre;
    pair = !pair;
  }

  if (somme % 10 !== 0) {
    return "INVALIDE — clé de Luhn incorrecte";
  }

  const reseau = detectReseau(clean);
  return `VALIDE (${reseau})`;
}


/**
 * Détecte le réseau d'une carte bancaire à partir de son numéro.
 *
 * @param {string} numero  Numéro de CB (chiffres uniquement).
 * @return {string}        Nom du réseau ou "Inconnu".
 * @customfunction
 */
function detectReseau(numero) {
  const clean = String(numero).replace(/[\s\-\.]/g, "");
  const n = clean.length;

  if (/^4/.test(clean) && (n === 13 || n === 16 || n === 19)) return "Visa";
  if (/^5[1-5]/.test(clean) && n === 16) return "Mastercard";
  if (/^2(2[2-9]|[3-6]\d|7[01]|720)/.test(clean) && n === 16) return "Mastercard";
  if (/^3[47]/.test(clean) && n === 15) return "American Express";
  if (/^3(0[0-5]|[68])/.test(clean) && (n === 14 || n === 16)) return "Diners Club";
  if (/^6(?:011|5)/.test(clean) && n === 16) return "Discover";
  if (/^35(2[89]|[3-8]\d)/.test(clean) && (n >= 15 && n <= 19)) return "JCB";
  if (/^(5018|5020|5038|6304|6759|676[1-3])/.test(clean)) return "Maestro";

  return "Réseau inconnu";
}
