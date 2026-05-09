/*
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
 * @OnlyCurrentDoc
 */

// ── Table des longueurs par code pays (ISO 13616, mise à jour 2025) ────────
const LONGUEUR_PAR_PAYS = Object.freeze({
...
  XK: 20,
});

/**
 * Vérifie la validité d'un IBAN (International Bank Account Number).
 *
 * @param {string|Array<Array<string>>} iban L'IBAN ou une plage de cellules.
 * @return {string|Array<Array<string>>} "VALIDE", message d'erreur ou tableau de résultats.
 * @customfunction
 */
function verifIBAN(iban) {
  return batchProcess(iban, (val) => {
    if (val == null || String(val).trim() === "") {
      return "INVALIDE — aucun IBAN fourni";
    }

    const ibanClean = String(val).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const match = ibanClean.match(/^([A-Z]{2})(\d{2})([A-Z0-9]+)$/);
    if (!match) {
      return "INVALIDE — format incorrect (doit commencer par 2 lettres + 2 chiffres)";
    }

    const [, codePays, cleControle, corps] = match;

    if (!(codePays in LONGUEUR_PAR_PAYS)) {
      return `INVALIDE — code pays « ${codePays} » non reconnu`;
    }

    const longueurAttendue = LONGUEUR_PAR_PAYS[codePays];
    if (ibanClean.length !== longueurAttendue) {
      return `INVALIDE — longueur incorrecte (${ibanClean.length} car. au lieu de ${longueurAttendue} pour ${codePays})`;
    }

    const chaineNumerique = (corps + codePays + cleControle)
      .replace(/[A-Z]/g, lettre => lettre.charCodeAt(0) - 55);

    if (mod97_(chaineNumerique) !== 1) {
      return "INVALIDE — clé de contrôle incorrecte";
    }

    return "VALIDE";
  });
}


/**
 * Formate un IBAN en groupes de 4 caractères séparés par des espaces.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} iban  L'IBAN ou une plage de cellules.
 * @return {string|Array<Array<string>>}      L'IBAN formaté ou tableau de résultats.
 * @customfunction
 *
 * @example
 *   =formatIBAN("FR7630006000011234567890189")
 */
function formatIBAN(iban) {
  return batchProcess(iban, (val) => {
    if (val == null || String(val).trim() === "") {
      return "";
    }
    const clean = String(val).toUpperCase().replace(/[^A-Z0-9]/g, "");
    return clean.replace(/(.{4})(?=.)/g, "$1 ");
  });
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