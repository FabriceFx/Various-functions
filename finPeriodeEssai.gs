/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Fin de Période d'Essai (France) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule la date exacte de fin de période d'essai selon le Code du
 *    Travail français, en fonction du statut (Ouvrier, Agent de maîtrise, Cadre).
 *
 *  Fonctions exposées :
 *    • FIN_PERIODE_ESSAI(dateEmbauche, statut, [renouvellement])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule la date de fin de période d'essai (CDI FR).
 *
 * @param {Date|string} dateEmbauche Date de début du contrat.
 * @param {string} statut            Statut ("Ouvrier", "Maitrise", "Cadre").
 * @param {boolean} [renouvellement=false] Si VRAI, calcule avec le délai renouvelé.
 * @return {Date|string}             Date de fin de période d'essai.
 * @customfunction
 *
 * @example
 *   =FIN_PERIODE_ESSAI("2026-01-01"; "Cadre"; FAUX)
 */
function FIN_PERIODE_ESSAI(dateEmbauche, statut, renouvellement = false) {
  if (!dateEmbauche || !statut) return "Erreur: paramètres manquants";

  const d = new Date(dateEmbauche);
  if (isNaN(d.getTime())) return "Erreur: date invalide";

  const cat = String(statut).trim().toLowerCase();
  let moisEssai = 0;

  // Durées légales standard en CDI (Code du Travail FR)
  if (cat.includes("ouvrier") || cat.includes("employé") || cat.includes("employe")) {
    moisEssai = 2;
  } else if (cat.includes("maîtrise") || cat.includes("maitrise") || cat.includes("technicien")) {
    moisEssai = 3;
  } else if (cat.includes("cadre")) {
    moisEssai = 4;
  } else {
    return "Erreur: statut inconnu (Utilisez Ouvrier, Maitrise, Cadre)";
  }

  if (renouvellement) {
    moisEssai *= 2; // Le renouvellement double généralement la période initiale
  }

  const dateFin = new Date(d);
  // La période d'essai se compte en jours calendaires
  dateFin.setMonth(dateFin.getMonth() + moisEssai);
  // La fin est la veille du jour anniversaire
  dateFin.setDate(dateFin.getDate() - 1);

  return dateFin;
}
