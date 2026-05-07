/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Lead Scoring — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Attribue une note automatique (score) à un prospect selon des critères 
 *    (budget, secteur, source). Ces critères sont pondérés pour 
 *    déterminer la qualification du lead (Froid, Tiède, Chaud).
 *
 *  Fonctions exposées :
 *    • SCORE_LEAD(budget, secteur, source)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule le score d'un lead (sur 100) selon 3 critères.
 *
 * @param {number} budget  Le budget estimé (en euros).
 * @param {string} secteur Le secteur d'activité (ex: "IT", "Santé").
 * @param {string} source  La source d'acquisition (ex: "Inbound", "Outbound").
 * @return {string}        Score et qualification (ex: "85 - Chaud").
 * @customfunction
 *
 * @example
 *   =SCORE_LEAD(15000; "IT"; "Inbound")
 */
function SCORE_LEAD(budget, secteur, source) {
  let score = 0;

  // 1. Critère Budget (max 40 pts)
  const b = parseFloat(budget) || 0;
  if (b > 50000) score += 40;
  else if (b > 10000) score += 25;
  else if (b > 5000) score += 10;
  else score += 0;

  // 2. Critère Secteur (max 30 pts)
  const s = String(secteur).trim().toLowerCase();
  if (s === "it" || s === "tech") score += 30;
  else if (s === "santé" || s === "finance") score += 20;
  else score += 5;

  // 3. Critère Source (max 30 pts)
  const src = String(source).trim().toLowerCase();
  if (src === "inbound" || src === "recommandation") score += 30;
  else if (src === "outbound") score += 15;
  else score += 5;

  // Qualification
  let qualif = "Froid";
  if (score >= 70) qualif = "Chaud 🔥";
  else if (score >= 40) qualif = "Tiède ☀️";
  else qualif = "Froid ❄️";

  return `${score}/100 - ${qualif}`;
}
