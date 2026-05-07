/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Vérification & formatage d'IBAN — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 2.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Fonctions personnalisées pour Google Sheets permettant de valider
 *    un IBAN selon la norme ISO 13616 (algorithme Modulo 97 — ISO 7064)
 *    et de le formater en groupes de 4 caractères.
 *
 *  Fonctions exposées :
 *    • verifIBAN(iban)   → "VALIDE" ou message d'erreur explicite
 *    • formatIBAN(iban)  → IBAN formaté (ex. "FR76 3000 6000 …")
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ── Table des longueurs par code pays (ISO 13616, mise à jour 2025) ────────
const LONGUEUR_PAR_PAYS = Object.freeze({
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28,
  BA: 20, BE: 16, BG: 22, BH: 22, BI: 27, BR: 29, BY: 28,
  CH: 21, CR: 22, CY: 28, CZ: 24,
  DE: 22, DJ: 27, DK: 18, DO: 28,
  EE: 20, EG: 29, ES: 24,
  FI: 18, FK: 18, FO: 18, FR: 27,
  GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28,
  HR: 21, HU: 28,
  IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27,
  JO: 30,
  KW: 30, KZ: 20,
  LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, LY: 25,
  MC: 27, MD: 24, ME: 22, MK: 19, MN: 20, MR: 27, MT: 31, MU: 30,
  NI: 28, NL: 18, NO: 15,
  PK: 24, PL: 28, PS: 29, PT: 25,
  QA: 29,
  RO: 24, RS: 22, RU: 33,
  SA: 24, SC: 31, SD: 18, SE: 24, SI: 19, SK: 24, SM: 27, SO: 23, ST: 25, SV: 28,
  TL: 23, TN: 24, TR: 26,
  UA: 29,
  VA: 22, VG: 24,
  XK: 20,
});


/**
 * Vérifie la validité d'un IBAN (International Bank Account Number).
 *
 * Effectue 3 niveaux de vérification :
 *   1. Format : l'IBAN ne contient que des caractères alphanumériques
 *   2. Longueur : l'IBAN a la longueur attendue pour son code pays
 *   3. Clé de contrôle : validation par l'algorithme Modulo 97 (ISO 7064)
 *
 * @param {string} iban  L'IBAN à vérifier (espaces et tirets tolérés).
 * @return {string}      "VALIDE" si l'IBAN est correct, sinon un message d'erreur explicite.
 * @customfunction
 *
 * @example
 *   =verifIBAN("FR76 3000 6000 0112 3456 7890 189")   → "VALIDE"
 *   =verifIBAN("FR76 3000 6000 0112 3456 7890 188")   → "INVALIDE — clé de contrôle incorrecte"
 *   =verifIBAN("XX12 3456")                            → "INVALIDE — code pays « XX » non reconnu"
 */
function verifIBAN(iban) {

  // ── 0. Vérification de l'entrée ──────────────────────────────────────────
  if (iban == null || String(iban).trim() === "") {
    return "INVALIDE — aucun IBAN fourni";
  }

  // Nettoyage : majuscules, suppression de tout sauf A-Z et 0-9
  const ibanClean = String(iban).toUpperCase().replace(/[^A-Z0-9]/g, "");

  // ── 1. Vérification du format global ─────────────────────────────────────
  // Un IBAN valide = 2 lettres (pays) + 2 chiffres (clé) + corps alphanumérique
  const match = ibanClean.match(/^([A-Z]{2})(\d{2})([A-Z0-9]+)$/);
  if (!match) {
    return "INVALIDE — format incorrect (doit commencer par 2 lettres + 2 chiffres)";
  }

  const [, codePays, cleControle, corps] = match;

  // ── 2. Vérification du code pays ─────────────────────────────────────────
  if (!(codePays in LONGUEUR_PAR_PAYS)) {
    return `INVALIDE — code pays « ${codePays} » non reconnu`;
  }

  // ── 3. Vérification de la longueur ───────────────────────────────────────
  const longueurAttendue = LONGUEUR_PAR_PAYS[codePays];
  if (ibanClean.length !== longueurAttendue) {
    return `INVALIDE — longueur incorrecte (${ibanClean.length} car. au lieu de ${longueurAttendue} pour ${codePays})`;
  }

  // ── 4. Vérification de la clé de contrôle (Modulo 97-1, ISO 7064) ───────
  const chaineNumerique = (corps + codePays + cleControle)
    .replace(/[A-Z]/g, lettre => lettre.charCodeAt(0) - 55);

  if (mod97_(chaineNumerique) !== 1) {
    return "INVALIDE — clé de contrôle incorrecte";
  }

  return "VALIDE";
}


/**
 * Formate un IBAN en groupes de 4 caractères séparés par des espaces.
 *
 * @param {string} iban  L'IBAN brut ou déjà partiellement formaté.
 * @return {string}      L'IBAN formaté (ex. "FR76 3000 6000 0112 3456 7890 189").
 * @customfunction
 *
 * @example
 *   =formatIBAN("FR7630006000011234567890189")
 *   → "FR76 3000 6000 0112 3456 7890 189"
 */
function formatIBAN(iban) {
  if (iban == null || String(iban).trim() === "") {
    return "";
  }
  const clean = String(iban).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return clean.replace(/(.{4})(?=.)/g, "$1 ");
}


/**
 * Calcule le modulo 97 d'un grand nombre représenté sous forme de chaîne.
 * Utilise un découpage par blocs pour éviter les dépassements d'entiers JS.
 *
 * @param {string} chaine  Chaîne de chiffres.
 * @return {number}        Résultat du modulo 97.
 * @private
 */
const mod97_ = (chaine) => {
  let reste = chaine.slice(0, 2);
  for (let i = 2; i < chaine.length; i += 7) {
    reste = parseInt(`${reste}${chaine.substring(i, i + 7)}`, 10) % 97;
  }
  return reste;
};