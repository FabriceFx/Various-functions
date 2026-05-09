/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Délai de Prévenance (Rupture Période d'Essai) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Calcule la durée légale du délai de prévenance à respecter en cas de
 *    rupture de la période d'essai (CDI/CDD), selon le droit français.
 *
 *  Fonctions exposées :
 *    • DELAI_PREVENANCE(dateDebut, [dateRupture], [coteEmployeur])
 *
 *  Référence légale : Art. L.1221-25 et L.1221-26 du Code du Travail
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule le délai de prévenance légal pour une rupture de période d'essai.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} dateDebut   Date d'entrée.
 * @param {Date|number|string}                   [dateRupture] Date de notification (aujourd'hui par défaut).
 * @param {boolean}                              [coteEmployeur=true] VRAI si rupture par l'employeur.
 * @return {string|Array<Array<string>>}          Le délai (ex: "48 heures", "2 semaines").
 * @customfunction
 *
 *   =DELAI_PREVENANCE("2026-01-01"; "2026-02-15")  → "2 semaines"
 *   =DELAI_PREVENANCE(A2:A100)
 */
function DELAI_PREVENANCE(dateDebut, dateRupture, coteEmployeur = true) {
  return batchProcess(dateDebut, (debutVal) => {
    const errDebut = GUARD.isDate(debutVal, "Date de début");
    if (errDebut) return `Erreur: ${errDebut}`;

    const dDebut = _parseDate(debutVal);
    const dRupture = dateRupture ? _parseDate(dateRupture) : new Date();
    
    if (!dRupture) return "Erreur: Date rupture invalide";

    // Calcul de l'ancienneté en jours
    const diffTime = dRupture.getTime() - dDebut.getTime();
    if (diffTime < 0) return "Erreur: Rupture avant début";
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calcul de l'ancienneté en mois (pour les seuils)
    const diffMonths = (dRupture.getFullYear() - dDebut.getFullYear()) * 12 + (dRupture.getMonth() - dDebut.getMonth());

    if (coteEmployeur) {
      if (diffDays < 8) return "24 heures";
      if (diffMonths < 1) return "48 heures";
      if (diffMonths < 3) return "2 semaines";
      return "1 mois";
    } else {
      // Rupture côté salarié
      if (diffDays < 8) return "24 heures";
      return "48 heures";
    }
  });
}
