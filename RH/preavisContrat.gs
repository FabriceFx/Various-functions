/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Préavis de Contrat (CDI — France) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Estime la durée du préavis de fin de contrat (CDI) selon le type de 
 *    rupture (Démission ou Licenciement) et l'ancienneté.
 *
 *  Fonctions exposées :
 *    • PREAVIS_CONTRAT(dateDebut, [dateRupture], [statut], [typeRupture])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule la durée du préavis de fin de contrat CDI (France).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} dateDebut   Date d'entrée.
 * @param {Date|number|string}                   [dateRupture] Date de notification (aujourd'hui par défaut).
 * @param {string}                               [statut="Cadre"] "Cadre" ou "Ouvrier"/"Employé".
 * @param {string}                               [type="Démission"] "Démission" ou "Licenciement".
 * @return {string|Array<Array<string>>}          Durée estimée (ex: "3 mois").
 * @customfunction
 *
 *   =PREAVIS_CONTRAT("2020-01-01"; "2026-05-09"; "Cadre"; "Démission") → "3 mois"
 *   =PREAVIS_CONTRAT(A2:A100; ; "Employé"; "Licenciement")
 */
function PREAVIS_CONTRAT(dateDebut, dateRupture, statut = "Cadre", type = "Démission") {
  return BATCH_PROCESS(dateDebut, (debutVal) => {
    const errDebut = GUARD.isDate(debutVal, "Date de début");
    if (errDebut) return `Erreur: ${errDebut}`;

    const dDebut = _parseDate(debutVal);
    const dRupture = dateRupture ? _parseDate(dateRupture) : new Date();
    
    if (!dRupture) return "Erreur: Date rupture invalide";

    // Calcul de l'ancienneté en mois
    let diffMonths = (dRupture.getFullYear() - dDebut.getFullYear()) * 12 + (dRupture.getMonth() - dDebut.getMonth());
    // Ajustement si le jour n'est pas encore atteint dans le mois
    if (dRupture.getDate() < dDebut.getDate()) {
      diffMonths--;
    }

    const typeNormalise = UTIL.normalise(type);
    const statutNormalise = UTIL.normalise(statut);
    const isCadre = statutNormalise.includes("cadre");

    if (typeNormalise.includes("demission")) {
      return isCadre 
        ? `${CONFIG.PREAVIS_RULES.demission.cadre} mois`
        : `${CONFIG.PREAVIS_RULES.demission.non_cadre} mois`;
    } 
    else if (typeNormalise.includes("licenciement")) {
      if (diffMonths < 6) return CONFIG.PREAVIS_RULES.licenciement.moins_6m;
      if (diffMonths < 24) return `${CONFIG.PREAVIS_RULES.licenciement.entre_6m_2ans} mois`;
      
      // Cas >= 2 ans : légal 2 mois, mais usage cadre = 3 mois
      const duree = isCadre ? 3 : CONFIG.PREAVIS_RULES.licenciement.plus_2ans;
      return `${duree} mois`;
    }

    return "Type de rupture inconnu";
  });
}
