/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Vérification d'adresse email — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Vérifie le format d'une adresse email avec une regex robuste conforme
 *    aux standards RFC 5322 (simplifiée). Vérifie également la présence
 *    d'un TLD valide (au moins 2 caractères).
 *
 *  Fonctions exposées :
 *    • verifEmail(email)     → "VALIDE" ou message d'erreur explicite
 *    • extraireEmail(texte)  → Extrait la première adresse email d'un texte
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

// Regex robuste pour validation email (RFC 5322 simplifiée)
const REGEX_EMAIL_ = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;


/**
 * Vérifie le format d'une adresse email.
 *
 * @param {string} email  L'adresse email à vérifier.
 * @return {string}       "VALIDE" ou message d'erreur explicite.
 * @customfunction
 *
 * @example
 *   =verifEmail("fabrice@faucheux.bzh")       → "VALIDE"
 *   =verifEmail("fabrice@faucheux")           → "INVALIDE — TLD manquant ou trop court"
 *   =verifEmail("fabrice@@faucheux.bzh")      → "INVALIDE — format incorrect"
 */
function verifEmail(email) {
  if (email == null || String(email).trim() === "") {
    return "INVALIDE — aucune adresse fournie";
  }

  const clean = String(email).trim();

  // Vérifications de base
  if (!clean.includes("@")) {
    return "INVALIDE — le caractère « @ » est manquant";
  }

  const parties = clean.split("@");
  if (parties.length !== 2) {
    return "INVALIDE — plusieurs caractères « @ » détectés";
  }

  const [local, domaine] = parties;

  if (local.length === 0) {
    return "INVALIDE — partie locale vide (avant le @)";
  }

  if (local.length > 64) {
    return "INVALIDE — partie locale trop longue (max 64 caractères)";
  }

  if (domaine.length === 0) {
    return "INVALIDE — domaine vide (après le @)";
  }

  if (domaine.length > 253) {
    return "INVALIDE — domaine trop long (max 253 caractères)";
  }

  if (!domaine.includes(".")) {
    return "INVALIDE — TLD manquant (pas de point dans le domaine)";
  }

  const tld = domaine.split(".").pop();
  if (tld.length < 2) {
    return "INVALIDE — TLD trop court (min 2 caractères)";
  }

  // Vérification finale par regex
  if (!REGEX_EMAIL_.test(clean)) {
    return "INVALIDE — format incorrect";
  }

  return "VALIDE";
}


/**
 * Extrait la première adresse email trouvée dans un texte.
 *
 * @param {string} texte  Le texte contenant potentiellement une adresse email.
 * @return {string}       L'adresse email trouvée, ou "" si aucune.
 * @customfunction
 *
 * @example
 *   =extraireEmail("Contactez-nous à info@example.com pour plus d'infos")
 *   → "info@example.com"
 */
function extraireEmail(texte) {
  if (texte == null || String(texte).trim() === "") {
    return "";
  }

  const regex = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}/;
  const match = String(texte).match(regex);

  return match ? match[0] : "";
}
