/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Détection de Données Personnelles (PII) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 2.0
 *  Date    : 2026-05-08
 *  Licence : MIT
 *
 *  Description :
 *    Analyse un texte pour détecter la présence probable de données
 *    personnelles (PII) : Email, IBAN, Téléphone FR, Carte Bancaire,
 *    Numéro de Sécurité Sociale, IPv4, Passeport FR.
 *
 *
 *  Fonctions exposées :
 *    • DETECT_PII(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ─── Regex pré-compilées (une seule fois au chargement) ───────────────────────

const PII_RULES = [
  {
    label: "Email",
    // RFC-5321 simplifié ; couvre les cas courants
    regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
  },
  {
    label: "IBAN",
    // IBAN FR : FR + 2 chiffres clé + 23 chiffres/lettres (longueur 27)
    // Espaces optionnels tous les 4 caractères (format papier)
    regex: /\bFR\d{2}(?:\s?\d{4}){5}\s?\d{3}\b/,
  },
  {
    label: "Sécurité Sociale",
    // NIR : sexe(1) + AA(2) + MM(2) + dép(2-3 dont 2A/2B) + commune(3) + ordre(3) + clé(2)
    regex: /\b[12]\s?\d{2}\s?(?:0[1-9]|1[0-2])\s?(?:[0-8]\d|9[0-5]|2[AB])\s?\d{3}\s?\d{3}\s?\d{2}\b/i,
  },
  {
    label: "Carte Bancaire",
    // 13-19 chiffres groupés (séparateurs espace ou tiret optionnels)
    // La validation de longueur et l'algorithme de Luhn sont faits dans `validate`
    regex: /\b(?:\d[\s\-]?){13,19}\b/,
    validate: luhnCheck,
  },
  {
    label: "Téléphone FR",
    // Formats : 0X XX XX XX XX | +33 X XX... | 00 33 X XX...
    regex: /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.\-]?\d{2}){4}/,
    // Désactivée si un IBAN ou une CB a déjà été trouvé (séquences numériques longues)
    skipIfAlreadyFound: ["IBAN", "Carte Bancaire"],
  },
  {
    label: "Adresse IPv4",
    // Octets 0-255, pas de correspondance partielle (word boundaries)
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/,
  },
  {
    label: "Passeport FR",
    // Format OACI livret FR : 2 lettres majuscules + 7 chiffres
    regex: /\b[A-Z]{2}\d{7}\b/,
  },
];

// ─── Algorithme de Luhn ───────────────────────────────────────────────────────

/**
 * Valide un numéro par l'algorithme de Luhn (cartes bancaires).
 * @param {string} match  La chaîne extraite par la regex (peut contenir des espaces/tirets).
 * @return {boolean}      true si le numéro passe la vérification de Luhn.
 */
function luhnCheck(match) {
  const digits = match.replace(/[\s\-]/g, "");
  // Longueurs valides pour les réseaux courants : Visa(13,16), MC(16), Amex(15), etc.
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// ─── Fonction principale ──────────────────────────────────────────────────────

/**
 * Détecte la présence de données sensibles (PII) dans un texte ou une plage.
 *
 * @param {string|Array} texte  Le texte à analyser, ou une plage de cellules.
 * @return {string}             "🟢 Clean" ou "🔴 PII Détectée : <types>".
 * @customfunction
 *
 * @example
 *   =DETECT_PII("Contacter alice@example.com pour le remboursement")
 *   → "🔴 PII Détectée : Email"
 *
 * @example
 *   =DETECT_PII("RIB : FR76 3000 6000 0123 4567 8900 189")
 *   → "🔴 PII Détectée : IBAN"
 *
 * @example
 *   =DETECT_PII("Référence commande : 2024-0042")
 *   → "🟢 Clean"
 */
function DETECT_PII(texte) {
  // Support des plages de cellules (tableau 2D renvoyé par Google Sheets)
  if (Array.isArray(texte)) {
    texte = texte.flat().join(" ");
  }

  const t = String(texte ?? "").trim();
  if (!t) return "🟢 Clean";

  const alertes = [];

  for (const rule of PII_RULES) {
    // Vérification conditionnelle (ex : ne pas tester le tel si IBAN déjà trouvé)
    if (rule.skipIfAlreadyFound && rule.skipIfAlreadyFound.some(l => alertes.includes(l))) {
      continue;
    }

    const match = t.match(rule.regex);
    if (!match) continue;

    // Validation complémentaire (ex : Luhn pour CB)
    if (rule.validate && !rule.validate(match[0])) continue;

    alertes.push(rule.label);
  }

  return alertes.length > 0
    ? "🔴 PII Détectée : " + alertes.join(", ")
    : "🟢 Clean";
}
