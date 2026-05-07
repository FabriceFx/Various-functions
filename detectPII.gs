/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Détection de Données Personnelles (PII) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Analyse un texte pour détecter la présence probable de données 
 *    personnelles (Emails, IBAN, Téléphones français, Cartes Bancaires).
 *
 *  Fonctions exposées :
 *    • DETECT_PII(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Détecte la présence de données sensibles (PII) dans un texte.
 *
 * @param {string} texte  Le texte à analyser.
 * @return {string}       Statut de détection ("Clean" ou type de PII trouvé).
 * @customfunction
 *
 * @example
 *   =DETECT_PII("Bonjour, voici mon rib : FR76 3000 6000...")
 */
function DETECT_PII(texte) {
  if (!texte || String(texte).trim() === "") return "🟢 Clean";

  const t = String(texte);
  const alertes = [];

  // Regex simplifiées pour la détection
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const ibanRegex = /[A-Z]{2}\d{2}\s?(?:\d{4}\s?){3,7}\d{1,4}/;
  const telRegex = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
  const cbRegex = /(?:\d{4}[\s-]?){3}\d{4}/;
  const nirRegex = /[12]\s?\d{2}\s?(?:0[1-9]|1[0-2])\s?(?:[0-8]\d|9[0-5]|9[78]|2[AB])\s?\d{3}\s?\d{3}\s?\d{2}/;

  if (emailRegex.test(t)) alertes.push("Email");
  if (ibanRegex.test(t)) alertes.push("IBAN");
  if (cbRegex.test(t)) alertes.push("Carte Bancaire");
  if (nirRegex.test(t)) alertes.push("Sécurité Sociale");
  // Le tel est souvent un faux positif avec des références de commande, on le met en dernier
  if (telRegex.test(t) && !cbRegex.test(t) && !ibanRegex.test(t)) alertes.push("Téléphone");

  if (alertes.length > 0) {
    return "🔴 PII Détectée : " + alertes.join(", ");
  }

  return "🟢 Clean";
}
