/** @OnlyCurrentDoc */

/**
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
 *  Améliorations v2.0 :
 *    • Parser de date sécurisé (_parseDate) — corrige le décalage UTC
 *    • Renouvellement traité comme un ajout (et non un doublement) : sémantique
 *      conforme à L.1221-21 ("renouvelée une fois pour une durée égale")
 *    • Plafonds légaux max documentés et stockés dans la table STATUTS
 *    • Table de règles STATUTS — extensible sans modifier la logique
 *    • Normalisation du statut plus tolérante (accents, abréviations)
 *    • Helper _addMonths pour un calcul de date robuste (gestion fin de mois)
 *    • Nouvelle fonction : DUREE_PERIODE_ESSAI(statut, renouvellement)
 *
 *  Fonctions exposées :
 *    • FIN_PERIODE_ESSAI(dateEmbauche, statut, [renouvellement])
 *    • DUREE_PERIODE_ESSAI(statut, [renouvellement])
 *
 *  Référence légale : Code du Travail FR — Articles L.1221-19 à L.1221-26
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ─── Constantes ───────────────────────────────────────────────────────────────

const PE_ERR_PARAMS  = "⚠️ Paramètres manquants";
const PE_ERR_DATE    = "⚠️ Date invalide";
const PE_ERR_STATUT  = "⚠️ Statut inconnu — utilisez : Ouvrier/Employé, Maitrise/Technicien, Cadre";

/**
 * Table des durées légales par statut (Art. L.1221-19 Code du Travail).
 *
 * Chaque entrée :
 *   • aliases  : termes acceptés (après normalisation minuscules sans accents)
 *   • initial  : durée initiale en mois
 *   • renouvellement : durée du renouvellement en mois (= durée initiale, L.1221-21)
 *   • maxLegal : plafond total légal en mois (initial + renouvellement)
 *   • label    : libellé canonique pour les messages
 */
const STATUTS_PE = [
  {
    aliases     : ["ouvrier", "ouvriere", "employe", "employee"],
    initial     : 2,
    renouvellement: 2,
    maxLegal    : 4,
    label       : "Ouvrier / Employé",
  },
  {
    aliases     : ["maitrise", "agent de maitrise", "technicien", "am"],
    initial     : 3,
    renouvellement: 3,
    maxLegal    : 6,
    label       : "Agent de maîtrise / Technicien",
  },
  {
    aliases     : ["cadre", "c"],
    initial     : 4,
    renouvellement: 4,
    maxLegal    : 8,
    label       : "Cadre",
  },
];

// ─── Helpers privés ───────────────────────────────────────────────────────────

/**
 * Convertit une valeur Sheets en objet Date local valide.
 * Gère : objet Date, nombre sériel Sheets/Excel, chaîne ISO YYYY-MM-DD.
 *
 * ⚠️  `new Date("YYYY-MM-DD")` est parsé en UTC par V8, ce qui peut décaler
 *     la date d'un jour selon le fuseau du serveur Apps Script → parse manuel.
 *
 * @param  {Date|number|string} val
 * @return {Date|null}
 */
function _parseDate(val) {
  if (!val && val !== 0) return null;

  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  // Nombre sériel Sheets (jours depuis 1899-12-30, comme Excel)
  if (typeof val === "number") {
    const d = new Date(new Date(1899, 11, 30).getTime() + val * 86400000);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof val === "string") {
    // Format ISO YYYY-MM-DD parsé en local (évite le décalage UTC)
    const iso = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
      const d = new Date(+iso[1], +iso[2] - 1, +iso[3]);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * Normalise une chaîne pour la comparaison de statut :
 * minuscules + suppression des accents.
 *
 * @param  {string} s
 * @return {string}
 */
function _normalise(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")                // décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
    .trim();
}

/**
 * Ajoute un nombre entier de mois à une date, en restant dans le bon mois
 * (ex : 31 jan + 1 mois → 28/29 fév, pas 3 mars).
 *
 * @param  {Date}   date
 * @param  {number} mois
 * @return {Date}
 */
function _addMonths(date, mois) {
  const result = new Date(date);
  const targetMonth = result.getMonth() + mois;

  result.setMonth(targetMonth);

  // Correction de débordement de mois (ex : 31 jan + 1 = 3 mars → ramen à 28 fév)
  // Si setMonth a "débordé", getMonth() ne correspond plus au mois attendu
  if (result.getMonth() !== ((targetMonth % 12) + 12) % 12) {
    result.setDate(0); // recule au dernier jour du mois précédent
  }

  return result;
}

/**
 * Recherche la règle de statut correspondant à une chaîne normalisée.
 *
 * @param  {string} statutNormalise
 * @return {object|null}  Entrée de STATUTS_PE, ou null si non trouvé.
 */
function _findStatut(statutNormalise) {
  return STATUTS_PE.find(
    rule => rule.aliases.some(alias => statutNormalise.includes(alias))
  ) ?? null;
}

// ─── Fonctions exposées ───────────────────────────────────────────────────────

/**
 * Calcule la date de fin de période d'essai CDI (droit du travail français).
 *
 * La période d'essai expire à l'issue du délai légal : si l'embauche est
 * le 1er du mois pour une PE de 2 mois, la fin est le 1er du mois +2,
 * soit le dernier jour de la PE = veille du jour anniversaire (J-1).
 *
 * Exemple concret : embauche le 01/01 → PE 2 mois → fin le 28/02
 * (Le salarié est confirmé à partir du 01/03.)
 *
 * @param {Date|number|string} dateEmbauche   Date de début du contrat.
 * @param {string}             statut         "Ouvrier"/"Employé", "Maitrise"/"Technicien", "Cadre".
 * @param {boolean}            [renouvellement=false]  VRAI si la PE est renouvelée.
 * @return {Date|string}       Date de fin de PE, ou message d'erreur.
 * @customfunction
 *
 * @example
 *   =FIN_PERIODE_ESSAI("2026-01-01"; "Cadre"; FAUX)   → 30/04/2026
 *   =FIN_PERIODE_ESSAI("2026-01-01"; "Cadre"; VRAI)   → 31/08/2026
 *   =FIN_PERIODE_ESSAI("2026-01-01"; "Ouvrier"; FAUX) → 28/02/2026
 */
function FIN_PERIODE_ESSAI(dateEmbauche, statut, renouvellement = false) {
  if (!dateEmbauche || !statut) return PE_ERR_PARAMS;

  const d = _parseDate(dateEmbauche);
  if (!d) return PE_ERR_DATE;

  const rule = _findStatut(_normalise(statut));
  if (!rule) return PE_ERR_STATUT;

  // Durée totale = initiale + renouvellement si applicable (L.1221-21)
  const dureeTotal = renouvellement
    ? rule.initial + rule.renouvellement  // ex Cadre : 4 + 4 = 8 mois
    : rule.initial;

  // Calcul de la date de fin : J+N mois, puis -1 jour (veille du jour anniversaire)
  const dateFin = _addMonths(d, dureeTotal);
  dateFin.setDate(dateFin.getDate() - 1);

  return dateFin;
}

/**
 * Retourne la durée de la période d'essai en mois pour un statut donné.
 * Utile pour afficher la durée dans une cellule adjacente.
 *
 * @param {string}  statut                    "Ouvrier"/"Employé", "Maitrise"/"Technicien", "Cadre".
 * @param {boolean} [renouvellement=false]    VRAI si la PE est renouvelée.
 * @return {string}  Durée formatée (ex : "4 mois" ou "8 mois (renouvelée)").
 * @customfunction
 *
 * @example
 *   =DUREE_PERIODE_ESSAI("Cadre"; FAUX)  → "4 mois"
 *   =DUREE_PERIODE_ESSAI("Cadre"; VRAI)  → "8 mois (renouvelée)"
 *   =DUREE_PERIODE_ESSAI("Ouvrier")      → "2 mois"
 */
function DUREE_PERIODE_ESSAI(statut, renouvellement = false) {
  if (!statut) return PE_ERR_PARAMS;

  const rule = _findStatut(_normalise(statut));
  if (!rule) return PE_ERR_STATUT;

  const duree = renouvellement
    ? rule.initial + rule.renouvellement
    : rule.initial;

  const suffix = renouvellement ? " (renouvelée)" : "";
  return `${duree} mois${suffix}`;
}
