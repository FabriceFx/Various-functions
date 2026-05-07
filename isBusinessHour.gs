/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Heures Ouvrées (Business Hours) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Vérifie si une date/heure tombe pendant les horaires d'ouverture 
 *    de l'entreprise (ex: du lundi au vendredi, 09:00 - 18:00).
 *
 *  Fonctions exposées :
 *    • IS_BUSINESS_HOUR(dateTime, [heureDebut], [heureFin])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Vérifie si un timestamp tombe sur un horaire ouvré (LUN-VEN).
 *
 * @param {Date|string} dateTime Heure à vérifier.
 * @param {number} [heureDebut=9]  Heure de début (0-23).
 * @param {number} [heureFin=18]   Heure de fin (0-23).
 * @return {boolean}               VRAI si c'est pendant les heures d'ouverture.
 * @customfunction
 *
 * @example
 *   =IS_BUSINESS_HOUR(A2; 9; 18)
 */
function IS_BUSINESS_HOUR(dateTime, heureDebut = 9, heureFin = 18) {
  if (!dateTime) return false;

  const d = new Date(dateTime);
  if (isNaN(d.getTime())) return false;

  const jour = d.getDay(); // 0 = Dimanche, 6 = Samedi
  if (jour === 0 || jour === 6) return false;

  const heure = d.getHours();
  return (heure >= heureDebut && heure < heureFin);
}
