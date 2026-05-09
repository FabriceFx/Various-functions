/*
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
 * @OnlyCurrentDoc
 */

/**
 * Indique si une donnée doit être purgée selon le RGPD.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDonnee Date ou plage.
 * @param {number} dureeMois Durée de rétention max en mois.
 * @return {string|Array<Array<string>>}              Statut ou tableau de résultats.
 * @customfunction
 *
 *   =VERIF_GDPR_RETENTION("2021-01-15"; 36)
 *   =VERIF_GDPR_RETENTION(A2:A100; 12)
 */
function VERIF_GDPR_RETENTION(dateDonnee, dureeMois) {
  return batchProcess(dateDonnee, (val) => {
    if (!val || !dureeMois) return "Erreur: paramètres manquants";

    const dCollecte = _parseDate(val);
    const mois = parseInt(dureeMois, 10);

    if (!dCollecte || isNaN(mois)) return "Erreur: paramètres invalides";

    const dateExpiration = new Date(dCollecte);
    dateExpiration.setMonth(dateExpiration.getMonth() + mois);

    const aujourdhui = new Date();

    if (aujourdhui > dateExpiration) {
      return "🔴 À PURGER";
    } else {
      const joursRestants = Math.ceil((dateExpiration.getTime() - aujourdhui.getTime()) / (1000 * 3600 * 24));
      if (joursRestants <= 30) {
        return "🟠 Purge imminente";
      }
      return "🟢 À CONSERVER";
    }
  });
}
