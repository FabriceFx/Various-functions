/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SLA Status (Service Level Agreement) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Vérifie si le délai maximum de réponse (SLA) à une requête client 
 *    est dépassé, proche de l'être, ou dans les temps.
 *
 *  Fonctions exposées :
 *    • SLA_STATUS(dateReception, delaiMaxHeures)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Retourne le statut du SLA par rapport à l'heure actuelle.
 *
 * @param {Date|string} dateReception Date et heure de réception de la demande.
 * @param {number} delaiMaxHeures     Le délai de réponse maximum autorisé en heures.
 * @return {string}                   Statut (ex: "🟢 Dans les temps", "🔴 Dépassé").
 * @customfunction
 *
 * @example
 *   =SLA_STATUS(A2; 48)
 */
function SLA_STATUS(dateReception, delaiMaxHeures) {
  if (!dateReception || !delaiMaxHeures) return "Erreur: paramètres manquants";

  const d = new Date(dateReception);
  if (isNaN(d.getTime())) return "Erreur: format de date invalide";

  const maintenant = new Date();
  
  // Calcul de la différence en heures
  const diffHeures = (maintenant.getTime() - d.getTime()) / (1000 * 3600);
  const max = parseFloat(delaiMaxHeures);

  if (diffHeures > max) {
    const depassement = Math.round(diffHeures - max);
    return `🔴 Dépassé (de ${depassement}h)`;
  } else if (diffHeures > max * 0.8) {
    // S'il reste moins de 20% du temps alloué
    const reste = Math.round(max - diffHeures);
    return `🟠 Urgent (reste ${reste}h)`;
  } else {
    return "🟢 Dans les temps";
  }
}
