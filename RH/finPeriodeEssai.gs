/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Période d'Essai (CDI — Droit du Travail FR) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 2.0
 *  Date    : 2026-05-08
 *  Licence : MIT
 *
 *  Description :
 *    Calcule la date de fin et la durée de la période d'essai CDI selon
 *    le Code du Travail français (L.1221-19), en fonction du statut.
 *
 *    • Parser de date sécurisé (_parseDate) — corrige le décalage UTC
 *    • Renouvellement traité comme un ajout (et non un doublement) : sémantique
 *      conforme à L.1221-21 ("renouvelée une fois pour une durée égale")
 *    • Plafonds légaux max documentés et stockés dans la table STATUTS
 *    • Table de règles STATUTS — extensible sans modifier la logique
 *    • Normalisation du statut plus tolérante (accents, abréviations)
 *    • Nouvelle fonction : DUREE_PERIODE_ESSAI(statut, renouvellement)
 *
 *  Fonctions exposées :
 *    • FIN_PERIODE_ESSAI(dateEmbauche, statut, [renouvellement])
 *    • DUREE_PERIODE_ESSAI(statut, [renouvellement])
 *
 *  Référence légale : Code du Travail FR — Articles L.1221-19 à L.1221-26
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

// ─── Logique Interne (Privée) ──────────────────────────────────────────────────

/** Recherche le statut dans la table. */
function _findStatut(statutNormalise) {
  return CONFIG.STATUTS_PE.find(
    rule => rule.aliases.some(alias => statutNormalise.includes(alias))
  ) ?? null;
}

// ─── Fonctions exposées ───────────────────────────────────────────────────────

/**
 * Calcule la date de fin de période d'essai CDI (droit du travail français).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} dateEmbauche Date de début ou plage.
 * @param {string}             statut "Ouvrier", "Maitrise", "Cadre".
 * @param {boolean}            [renouvellement=false] Si renouvelée.
 * @return {Date|string|Array<Array<any>>}    Date de fin ou tableau.
 * @customfunction
 *
 *   =FIN_PERIODE_ESSAI("2026-01-01"; "Cadre")
 *   =FIN_PERIODE_ESSAI(A2:A100; "Ouvrier")
 */
function FIN_PERIODE_ESSAI(dateEmbauche, statut, renouvellement = false) {
  return batchProcess(dateEmbauche, (val) => {
    const errDate = GUARD.isDate(val, "Date d'embauche");
    const errStatut = GUARD.isDefined(statut, "Statut");
    
    if (errDate || errStatut) return `Erreur: ${errDate || errStatut}`;

    const d = _parseDate(val);
    const rule = _findStatut(UTIL.normalise(statut));
    if (!rule) return CONFIG.PE_ERR_STATUT;

    const dureeTotal = renouvellement
      ? rule.initial + rule.renouvellement
      : rule.initial;

    const dateFin = UTIL.addMonths(d, dureeTotal);
    dateFin.setDate(dateFin.getDate() - 1);

    return dateFin;
  });
}

/**
 * Retourne la durée de la période d'essai en mois pour un statut donné.
 * Utile pour afficher la durée dans une cellule adjacente.
 *
 * @param {string}  statut "Ouvrier"/"Employé", "Maitrise"/"Technicien", "Cadre".
 * @param {boolean} [renouvellement=false] VRAI si la PE est renouvelée.
 * @return {string}  Durée formatée (ex : "4 mois" ou "8 mois (renouvelée)").
 * @customfunction
 *
 *   =DUREE_PERIODE_ESSAI("Cadre"; FAUX)  → "4 mois"
 *   =DUREE_PERIODE_ESSAI("Cadre"; VRAI)  → "8 mois (renouvelée)"
 *   =DUREE_PERIODE_ESSAI("Ouvrier")      → "2 mois"
 */
function DUREE_PERIODE_ESSAI(statut, renouvellement = false) {
  if (!statut) return CONFIG.PE_ERR_PARAMS;

  const rule = _findStatut(UTIL.normalise(statut));
  if (!rule) return CONFIG.PE_ERR_STATUT;

  const duree = renouvellement
    ? rule.initial + rule.renouvellement
    : rule.initial;

  const suffix = renouvellement ? " (renouvelée)" : "";
  return `${duree} mois${suffix}`;
}
