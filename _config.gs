/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Configuration Globale — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.1
 *  Date    : 2026-05-08
 *
 *  Description :
 *    Centralise les constantes, les listes de mots et les utilitaires partagés
 *    pour l'ensemble de la bibliothèque.
 * ════════════════════════════════════════════════════════════════════════════
 */

const CONFIG = {
  // Particules et mots de liaison pour les fonctions de texte
  PARTICULES_FR: new Set([
    "de", "du", "des", "le", "la", "les", "l", "d", 
    "et", "ou", "en", "à", "au", "aux", "par", "pour", "sur",
    "von", "van", "di", "da", "do", "das", "dos"
  ]),
  
  // Mots de liaison (Stop Words) pour l'analyse fréquentielle
  STOP_WORDS_FR: new Set([
    "le", "la", "les", "l", "un", "une", "des", "d", "du", "de",
    "et", "ou", "mais", "donc", "or", "ni", "car",
    "a", "à", "au", "aux", "en", "par", "pour", "avec", "sans", "sous", "sur", "vers", "dans",
    "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
    "me", "te", "se", "y", "qui", "que", "quoi", "dont", "où",
    "ce", "cet", "cette", "ces", "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses",
    "est", "sont", "c", "qu", "n", "ne", "pas", "plus"
  ]),

  // Durée du cache par défaut (6 heures)
  CACHE_TTL: 21600,

  // Codes pays par défaut
  DEFAULT_COUNTRY: 'FR',

  // Suffixes de domaines complexes (double TLDs)
  DOUBLE_TLDS: new Set([
    "com.au", "net.au", "org.au",
    "co.uk", "me.uk", "org.uk", "net.uk",
    "com.br", "net.br",
    "co.jp", "or.jp", "ne.jp",
    "com.cn", "net.cn", "org.cn",
    "com.fr", "gouv.fr", "asso.fr"
  ]),

  // Taux indicatifs moyens des charges salariales (France)
  SALAIRE_TAUX: {
    cadre: 0.25,
    non_cadre: 0.22,
    fonctionnaire: 0.15,
    stage: 0,
    alternance: 0,
    defaut: 0.23
  }
};

/**
 * Utilitaire pour gérer le traitement par lot (Batch Processing).
 * Si l'entrée est un tableau, applique le callback sur chaque cellule.
 * 
 * @param {any} input       Valeur unique ou tableau 2D (plage Sheets).
 * @param {Function} callback Fonction à appliquer sur chaque valeur simple.
 * @return {any}            Résultat unique ou tableau 2D de résultats.
 */
function batchProcess(input, callback) {
  if (Array.isArray(input)) {
    return input.map(row => {
      if (Array.isArray(row)) {
        return row.map(cell => callback(cell));
      }
      return callback(row);
    });
  }
  return callback(input);
}

/**
 * Clauses de garde pour validation des entrées.
 */
const GUARD = {
  isDefined: (val, label = "La valeur") => {
    if (val === null || val === undefined || (typeof val === 'string' && val.trim() === "")) {
      throw new Error(`${label} ne peut pas être vide.`);
    }
  },
  isDate: (val, label = "La date") => {
    if (!(val instanceof Date) || isNaN(val.getTime())) {
      throw new Error(`${label} doit être une date valide.`);
    }
  }
};
