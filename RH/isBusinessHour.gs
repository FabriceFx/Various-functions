/*
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
 * @OnlyCurrentDoc
 */

/**
 * Vérifie si un timestamp tombe sur un horaire ouvré (LUN-VEN, hors jours fériés).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateTime Heure à vérifier ou plage.
 * @param {number} [heureDebut=9] Heure de début (0-23).
 * @param {number} [heureFin=18] Heure de fin (0-23).
 * @return {boolean|Array<Array<boolean>>} VRAI si c'est pendant les heures d'ouverture.
 * @customfunction
 *
 *   =IS_BUSINESS_HOUR(A2; 9; 18)
 *   =IS_BUSINESS_HOUR(A2:A50)
 */
function IS_BUSINESS_HOUR(dateTime, heureDebut = 9, heureFin = 18) {
  return batchProcess(dateTime, (val) => {
    if (!val) return false;

    const d = new Date(val);
    if (isNaN(d.getTime())) return false;

    const jour = d.getDay(); // 0 = Dimanche, 6 = Samedi
    if (jour === 0 || jour === 6) return false;

    // Vérification des jours fériés (si la fonction estJourFerieFR est disponible)
    if (typeof estJourFerieFR === 'function' && estJourFerieFR(d)) {
      return false;
    }

    const heure = d.getHours();
    return (heure >= heureDebut && heure < heureFin);
  });
}
