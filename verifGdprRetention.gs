/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Vérification de Rétention RGPD — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Vérifie si une donnée personnelle dépasse la durée de conservation
 *    autorisée par le RGPD. Utile pour les purges de bases de données.
 *
 *  Fonctions exposées :
 *    • VERIF_GDPR_RETENTION(dateDonnee, dureeMois)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Indique si une donnée doit être purgée selon le RGPD.
 *
 * @param {Date|string} dateDonnee  Date de collecte ou de dernière activité.
 * @param {number} dureeMois        Durée de rétention max en mois (ex: 36 pour prospects).
 * @return {string}                 Statut ("À CONSERVER" ou "🔴 À PURGER").
 * @customfunction
 *
 * @example
 *   =VERIF_GDPR_RETENTION("2021-01-15"; 36)
 */
function VERIF_GDPR_RETENTION(dateDonnee, dureeMois) {
  if (!dateDonnee || !dureeMois) return "Erreur: paramètres manquants";

  const dCollecte = new Date(dateDonnee);
  const mois = parseInt(dureeMois, 10);

  if (isNaN(dCollecte.getTime()) || isNaN(mois)) return "Erreur: paramètres invalides";

  const dateExpiration = new Date(dCollecte);
  dateExpiration.setMonth(dateExpiration.getMonth() + mois);

  const aujourdhui = new Date();

  if (aujourdhui > dateExpiration) {
    return "🔴 À PURGER";
  } else {
    // Calcul de l'échéance en jours
    const joursRestants = Math.ceil((dateExpiration.getTime() - aujourdhui.getTime()) / (1000 * 3600 * 24));
    if (joursRestants <= 30) {
      return "🟠 Purge imminente";
    }
    return "🟢 À CONSERVER";
  }
}
