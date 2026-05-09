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
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateReception Date et heure ou plage.
 * @param {number} delaiMaxHeures                       Délai maximum en heures.
 * @return {string|Array<Array<string>>}                Statut ou tableau de résultats.
 * @customfunction
 *
 *   =SLA_STATUS(A2; 48)
 *   =SLA_STATUS(A2:A100; 24)
 */
function SLA_STATUS(dateReception, delaiMaxHeures) {
  return batchProcess(dateReception, (val) => {
    if (!val || !delaiMaxHeures) return "Erreur: paramètres manquants";

    const d = _parseDate(val);
    if (!d) return "Erreur: format de date invalide";

    const maintenant = new Date();
    
    const diffHeures = (maintenant.getTime() - d.getTime()) / (1000 * 3600);
    const max = parseFloat(delaiMaxHeures);

    if (diffHeures > max) {
      const depassement = Math.round(diffHeures - max);
      return `🔴 Dépassé (de ${depassement}h)`;
    } else if (diffHeures > max * 0.8) {
      const reste = Math.round(max - diffHeures);
      return `🟠 Urgent (reste ${reste}h)`;
    } else {
      return "🟢 Dans les temps";
    }
  });
}
