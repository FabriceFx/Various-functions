/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Vérification de TVA intracommunautaire — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Valide un numéro de TVA intracommunautaire. Vérifie le format par
 *    pays et, pour les numéros français (FR), la clé de contrôle.
 *
 *  Fonctions exposées :
 *    • VERIF_TVA(numero)  → "VALIDE" ou message d'erreur explicite
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

// Formats de TVA par pays (regex)
const FORMATS_TVA_ = Object.freeze({
  AT: /^ATU\d{8}$/,
  BE: /^BE[01]\d{9}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  EL: /^EL\d{9}$/,
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-Z0-9]{2}\d{9}$/,
  GB: /^GB(\d{9}|\d{12}|GD\d{3}|HA\d{3})$/,
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE(\d{7}[A-Z]{1,2}|\d[A-Z+*]\d{5}[A-Z])$/,
  IT: /^IT\d{11}$/,
  LT: /^LT(\d{9}|\d{12})$/,
  LU: /^LU\d{8}$/,
  LV: /^LV\d{11}$/,
  MT: /^MT\d{8}$/,
  NL: /^NL\d{9}B\d{2}$/,
  PL: /^PL\d{10}$/,
  PT: /^PT\d{9}$/,
  RO: /^RO\d{2,10}$/,
  SE: /^SE\d{12}$/,
  SI: /^SI\d{8}$/,
  SK: /^SK\d{10}$/,
});

/**
 * Vérifie la validité d'un numéro de TVA intracommunautaire.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} numero Le numéro ou plage.
 * @return {string|Array<Array<string>>}        "VALIDE" ou message d'erreur.
 * @customfunction
 *
 *   =VERIF_TVA("FR 40 303656847")  → "VALIDE"
 *   =VERIF_TVA(A2:A100)
 */
function VERIF_TVA(numero) {
  return BATCH_PROCESS(numero, (val) => {
    if (val == null || String(val).trim() === "") {
      return "INVALIDE — aucun numéro fourni";
    }

    const clean = String(val).toUpperCase().replace(/[\s.\-]/g, "");

    if (clean.length < 4) {
      return "INVALIDE — trop court";
    }

    const codePays = clean.substring(0, 2);

    if (!FORMATS_TVA_.hasOwnProperty(codePays)) {
      return `INVALIDE — pays « ${codePays} » inconnu`;
    }

    if (!FORMATS_TVA_[codePays].test(clean)) {
      return `INVALIDE — format incorrect (${codePays})`;
    }

    if (codePays === "FR") {
      const cle = clean.substring(2, 4);
      const siren = clean.substring(4);

      if (/^\d{2}$/.test(cle)) {
        const cleAttendue = (12 + 3 * (parseInt(siren, 10) % 97)) % 97;
        const cleIndiquee = parseInt(cle, 10);

        if (cleIndiquee !== cleAttendue) {
          return `INVALIDE — clé FR incorrecte (${cleIndiquee} vs ${cleAttendue})`;
        }
      }
    }

    return "VALIDE";
  });
}
