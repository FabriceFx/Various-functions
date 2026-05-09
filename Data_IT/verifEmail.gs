/*
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
 * @OnlyCurrentDoc
 */

// Regex robuste pour validation email (RFC 5322 simplifiée)
const REGEX_EMAIL_ = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Vérifie le format d'une adresse email.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} email L'adresse email ou une plage de cellules.
 * @return {string|Array<Array<string>>}       "VALIDE", message d'erreur ou tableau de résultats.
 * @customfunction
 *
 *   =verifEmail("fabrice@faucheux.bzh")       → "VALIDE"
 *   =verifEmail(A2:A100)                      → [Tableau de résultats]
 */
function verifEmail(email) {
  return batchProcess(email, (val) => {
    if (val == null || String(val).trim() === "") {
      return "INVALIDE — aucune adresse fournie";
    }

    const clean = String(val).trim();

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
  });
}

/**
 * Extrait la première adresse email trouvée dans un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou une plage de cellules.
 * @return {string|Array<Array<string>>}       L'adresse email trouvée ou tableau de résultats.
 * @customfunction
 *
 *   =extraireEmail(B2:B50)                              → [Tableau de résultats]
 */
function extraireEmail(texte) {
  return batchProcess(texte, (val) => {
    if (val == null || String(val).trim() === "") {
      return "";
    }

    const regex = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}/;
    const match = String(val).match(regex);

    return match ? match[0] : "";
  });
}
