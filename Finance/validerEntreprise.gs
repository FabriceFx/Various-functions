/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Validation SIREN / SIRET (Luhn) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-10
 *  Licence : MIT
 *
 *  Description :
 *    Vérifie la validité d'un numéro SIREN (9 chiffres) ou SIRET (14 chiffres)
 *    en utilisant l'algorithme de Luhn. Formate le résultat proprement.
 *
 *  Fonctions exposées :
 *    • VALIDER_ENTREPRISE(input)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Vérifie si une chaîne respecte l'algorithme de Luhn.
 * @private
 */
function _isLuhnValid(code) {
  let sum = 0;
  let iterate = false;
  for (let i = code.length - 1; i >= 0; i--) {
    let n = parseInt(code[i], 10);
    if (iterate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    iterate = !iterate;
  }
  return sum % 10 === 0;
}

/**
 * Valide et formate un numéro SIREN ou SIRET.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} input Le numéro à vérifier ou plage.
 * @return {string|Array<Array<string>>}           Le numéro formaté ou message d'erreur.
 * @customfunction
 *
 *   =VALIDER_ENTREPRISE("123456789")         → "123 456 789"
 *   =VALIDER_ENTREPRISE(12345678900012)      → "123 456 789 00012"
 */
function VALIDER_ENTREPRISE(input) {
  return BATCH_PROCESS(input, (val) => {
    if (val == null || String(val).trim() === "") return "";

    // Nettoyage : on ne garde que les chiffres
    const clean = String(val).replace(/\D/g, "");

    if (clean.length !== 9 && clean.length !== 14) {
      return "INVALIDE (Longueur incorrecte)";
    }

    if (!_isLuhnValid(clean)) {
      return "INVALIDE (Clé de contrôle)";
    }

    // Formatage pour la lisibilité
    if (clean.length === 9) {
      // SIREN : XXX XXX XXX
      return clean.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    } else {
      // SIRET : XXX XXX XXX XXXXX
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, "$1 $2 $3 $4");
    }
  });
}
