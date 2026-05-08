/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Utilitaires Date — Début / Fin / Infos de mois — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 2.0
 *  Date    : 2026-05-08
 *  Licence : MIT
 *
 *  Description :
 *    Utilitaires pour naviguer dans les mois d'une date Google Sheets :
 *    premier jour, dernier jour, nombre de jours, nom du mois.
 *
 *  Améliorations v2.0 :
 *    • Helper _parseDate centralisé (gère Date, serial number Sheets, string ISO)
 *    • Constante ERR_DATE pour des messages d'erreur cohérents
 *    • Nouvelles fonctions : NB_JOURS_MOIS, NOM_MOIS
 *    • JSDoc enrichi (@throws, exemples multiples)
 *
 *  Fonctions exposées :
 *    • DEBUT_MOIS(date)     → 1er jour du mois
 *    • FIN_MOIS(date)       → dernier jour du mois
 *    • NB_JOURS_MOIS(date)  → nombre de jours dans le mois
 *    • NOM_MOIS(date)       → nom du mois en français
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Message retourné à la cellule en cas de date invalide. */
const ERR_DATE = "⚠️ Date invalide";

/**
 * Noms des mois en français (index 0 = janvier).
 * Déclaré une seule fois, partagé par NOM_MOIS.
 */
const NOMS_MOIS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

// ─── Helper privé ─────────────────────────────────────────────────────────────

/**
 * Tente de convertir n'importe quelle valeur Sheets en objet Date local valide.
 *
 * Google Sheets peut passer :
 *   • un objet Date JavaScript  (cas normal)
 *   • un nombre sériel          (ex : 46000 = date Excel/Sheets)
 *   • une chaîne ISO ou locale  (ex : "2026-05-15", "15/05/2026")
 *
 * ⚠️  `new Date("2026-05-15")` est interprété en UTC par V8, ce qui peut
 *     décaler la date d'un jour selon le fuseau du serveur Apps Script.
 *     On parse manuellement les formats ISO pour rester en heure locale.
 *
 * @param  {Date|number|string} val  Valeur brute issue de la cellule Sheets.
 * @return {Date|null}               Objet Date local valide, ou null si invalide.
 */
function _parseDate(val) {
  if (!val && val !== 0) return null;

  // 1. Déjà un objet Date
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  // 2. Nombre sériel Google Sheets / Excel (jours depuis 1899-12-30)
  if (typeof val === "number") {
    // Sheets utilise l'époque 1899-12-30 (comme Excel, avec le bug du 29-fév-1900)
    const SHEETS_EPOCH = new Date(1899, 11, 30);
    const d = new Date(SHEETS_EPOCH.getTime() + val * 86400000);
    return isNaN(d.getTime()) ? null : d;
  }

  // 3. Chaîne — on tente d'abord le format ISO YYYY-MM-DD en local
  if (typeof val === "string") {
    const isoMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const d = new Date(+isoMatch[1], +isoMatch[2] - 1, +isoMatch[3]);
      return isNaN(d.getTime()) ? null : d;
    }
    // Fallback : laisser le moteur JS tenter le parsing (formats localisés, etc.)
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

// ─── Fonctions exposées ───────────────────────────────────────────────────────

/**
 * Retourne le premier jour du mois correspondant à la date fournie.
 *
 * @param {Date|number|string} date  Date de référence (cellule Sheets).
 * @return {Date|string}             Date du 1er jour du mois, ou message d'erreur.
 * @customfunction
 *
 * @example
 *   =DEBUT_MOIS("2026-05-15")  → 01/05/2026
 *   =DEBUT_MOIS(A1)            → premier jour du mois de la date en A1
 */
function DEBUT_MOIS(date) {
  const d = _parseDate(date);
  if (!d) return ERR_DATE;
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Retourne le dernier jour du mois correspondant à la date fournie.
 *
 * Technique : le jour 0 du mois M+1 est le dernier jour du mois M,
 * ce qui gère automatiquement les mois de 28, 29, 30 et 31 jours.
 *
 * @param {Date|number|string} date  Date de référence (cellule Sheets).
 * @return {Date|string}             Date du dernier jour du mois, ou message d'erreur.
 * @customfunction
 *
 * @example
 *   =FIN_MOIS("2026-02-10")  → 28/02/2026  (année non bissextile)
 *   =FIN_MOIS("2024-02-10")  → 29/02/2024  (année bissextile)
 *   =FIN_MOIS("2026-05-01")  → 31/05/2026
 */
function FIN_MOIS(date) {
  const d = _parseDate(date);
  if (!d) return ERR_DATE;
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * Retourne le nombre de jours dans le mois de la date fournie.
 *
 * @param {Date|number|string} date  Date de référence (cellule Sheets).
 * @return {number|string}           Nombre de jours (28–31), ou message d'erreur.
 * @customfunction
 *
 * @example
 *   =NB_JOURS_MOIS("2026-02-01")  → 28
 *   =NB_JOURS_MOIS("2024-02-01")  → 29
 *   =NB_JOURS_MOIS("2026-07-14")  → 31
 */
function NB_JOURS_MOIS(date) {
  const d = _parseDate(date);
  if (!d) return ERR_DATE;
  // getDate() sur le "jour 0 du mois suivant" = numéro du dernier jour
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

/**
 * Retourne le nom du mois en français pour la date fournie.
 *
 * @param {Date|number|string} date  Date de référence (cellule Sheets).
 * @return {string}                  Nom du mois (ex : "Mai"), ou message d'erreur.
 * @customfunction
 *
 * @example
 *   =NOM_MOIS("2026-05-08")  → "Mai"
 *   =NOM_MOIS("2026-12-31")  → "Décembre"
 */
function NOM_MOIS(date) {
  const d = _parseDate(date);
  if (!d) return ERR_DATE;
  return NOMS_MOIS_FR[d.getMonth()];
}
