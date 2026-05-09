/*
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
 *  Fonctions exposées :
 *    • DETECT_PII(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Détecte la présence de données sensibles (PII) dans un texte ou une plage.
 *
 * @param {string|Array<Array<any>>} input Le texte à analyser, ou une plage.
 * @return {string|Array<Array<string>>} "🟢 Clean" ou "🔴 PII Détectée : <types>".
 * @customfunction
 */
function DETECT_PII(input) {
  return batchProcess(input, (val) => {
    const t = String(val ?? "").trim();
    if (!t) return "🟢 Clean";

    const alertes = [];

    for (const rule of CONFIG.PII_RULES) {
      const match = t.match(rule.regex);
      if (!match) continue;

      // Validation complémentaire (ex : Luhn pour CB)
      if (rule.validate && !rule.validate(match[0])) continue;

      alertes.push(rule.label);
    }

    return alertes.length > 0
      ? "🔴 PII Détectée : " + alertes.join(", ")
      : "🟢 Clean";
  });
}
