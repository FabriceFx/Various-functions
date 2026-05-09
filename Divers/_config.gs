/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Configuration Globale — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 2.1.0
 *  Date    : 2026-05-09
 *
 *  Description :
 *    Centralise les constantes, les listes de mots et les utilitaires partagés
 *    pour l'ensemble de la bibliothèque.
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Retourne la version actuelle de la bibliothèque.
 * @return {string} Version (ex: "2.1.0").
 * @customfunction
 */
function FF_VERSION() {
  return CONFIG.LIBRARY_VERSION;
}

const CONFIG = {
  LIBRARY_VERSION: "2.1.0",
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
  },

  // Règles de détection de données personnelles (PII)
  PII_RULES: [
    {
      label: "Email",
      regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
      mask: (val) => {
        const [user, domain] = val.split('@');
        return user.charAt(0) + "****@" + domain;
      }
    },
    {
      label: "IBAN",
      regex: /\bFR\d{2}(?:\s?\d{4}){5}\s?\d{3}\b/,
      mask: (val) => val.substring(0, 4) + " **** **** **** **** " + val.slice(-4)
    },
    {
      label: "Sécurité Sociale",
      regex: /\b[12]\s?\d{2}\s?(?:0[1-9]|1[0-2])\s?(?:[0-8]\d|9[0-5]|2[AB])\s?\d{3}\s?\d{3}\s?\d{2}\b/i,
      mask: (val) => val.charAt(0) + " ** ** ** *** *** **"
    },
    {
      label: "Carte Bancaire",
      regex: /\b(?:\d[\s\-]?){13,19}\b/,
      validate: (match) => {
        const digits = match.replace(/[\s\-]/g, "");
        if (digits.length < 13 || digits.length > 19) return false;
        let sum = 0, shouldDouble = false;
        for (let i = digits.length - 1; i >= 0; i--) {
          let d = parseInt(digits[i], 10);
          if (shouldDouble) { d *= 2; if (d > 9) d -= 9; }
          sum += d; shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
      },
      mask: (val) => "**** **** **** " + val.replace(/[\s\-]/g, "").slice(-4)
    },
    {
      label: "Téléphone FR",
      regex: /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.\-]?\d{2}){4}/,
      mask: (val) => val.substring(0, 3) + " ** ** ** " + val.slice(-2)
    }
  ]
};

/**
 * Utilitaire pour gérer le traitement par lot (Batch Processing).
 * Si l'entrée est un tableau 2D, applique le callback sur chaque cellule.
 * 
 * @param {string|number|Date|Array<Array<any>>} input  Valeur unique ou plage Sheets (tableau 2D).
 * @param {function(any): any} callback                 Fonction à appliquer sur chaque valeur simple.
 * @return {any|Array<Array<any>>}                      Résultat unique ou tableau 2D de résultats.
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
 * Exécute un appel URL avec une stratégie d'Exponential Backoff.
 * Utile pour gérer les quotas Google et les erreurs 429/500.
 * 
 * @param {string} url 
 * @param {Object} options 
 * @param {number} [maxRetries=3] 
 * @return {GoogleAppsScript.URL_Fetch.HTTPResponse}
 */
function _fetchWithBackoff(url, options = {}, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();
      if (code === 200) return response;
      if (code === 429 || code >= 500) {
        throw new Error("Quota ou Erreur Serveur");
      }
      return response;
    } catch (e) {
      retries++;
      if (retries >= maxRetries) throw e;
      Utilities.sleep(Math.pow(2, retries) * 1000 + Math.round(Math.random() * 1000));
    }
  }
}

/**
 * Clauses de garde pour validation des entrées.
 */
const GUARD = {
  isDefined: (val, label = "La valeur") => {
    if (val === null || val === undefined || (typeof val === 'string' && val.trim() === "")) {
      return `${label} manquante`;
    }
    return null;
  },
  isNumber: (val, label = "La valeur") => {
    if (isNaN(parseFloat(val))) return `${label} non numérique`;
    return null;
  },
  isDate: (val, label = "La date") => {
    const d = _parseDate(val);
    if (!d) return `${label} invalide`;
    return null;
  }
};

/**
 * Tente de convertir n'importe quelle valeur Sheets en objet Date local valide.
 * Gère les décalages de fuseaux horaires via Session.getScriptTimeZone().
 * 
 * @param  {Date|number|string} val  Valeur brute issue de la cellule Sheets.
 * @return {Date|null}               Objet Date local valide, ou null si invalide.
 */
function _parseDate(val) {
  if (!val && val !== 0) return null;

  // 1. Déjà un objet Date
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  // 2. Nombre sériel Google Sheets / Excel (jours depuis 1899-12-30)
  if (typeof val === "number") {
    // On utilise Utilities.formatDate pour s'assurer que le nombre est interprété 
    // selon le fuseau horaire du script.
    const dateBase = new Date(1899, 11, 30);
    const ms = dateBase.getTime() + Math.round(val * 86400000);
    const d = new Date(ms);
    
    // Correction potentielle de décalage si le script et la feuille diffèrent
    return isNaN(d.getTime()) ? null : d;
  }

  // 3. Chaîne — on tente d'abord le format ISO YYYY-MM-DD en local
  if (typeof val === "string") {
    const isoMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      // Les mois sont 0-indexés dans l'objet Date
      const d = new Date(+isoMatch[1], +isoMatch[2] - 1, +isoMatch[3]);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}
