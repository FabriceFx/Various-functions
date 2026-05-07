/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Schedule Performance Index (SPI) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le SPI d'un projet. 
 *    SPI = Progression Réelle / Progression Planifiée.
 *    Si SPI < 1 : En retard. Si SPI >= 1 : Dans les temps ou en avance.
 *
 *  Fonctions exposées :
 *    • PROJECT_SPI(dateDebut, dateFin, progressionReelle, [dateActuelle])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule l'indice de performance calendaire (SPI).
 *
 * @param {Date|string} dateDebut     Date de démarrage du projet.
 * @param {Date|string} dateFin       Date de livraison prévue.
 * @param {number} progressionReelle  Avancement réel en % (ex: 0.45 pour 45%).
 * @param {Date|string} [dateActuelle] Date d'évaluation (Aujourd'hui par défaut).
 * @return {number}                   Le SPI arrondi à 2 décimales.
 * @customfunction
 *
 * @example
 *   =PROJECT_SPI("2025-01-01"; "2025-12-31"; 0.5)
 */
function PROJECT_SPI(dateDebut, dateFin, progressionReelle, dateActuelle) {
  const dStart = new Date(dateDebut);
  const dEnd = new Date(dateFin);
  const dNow = dateActuelle ? new Date(dateActuelle) : new Date();

  if (isNaN(dStart.getTime()) || isNaN(dEnd.getTime()) || isNaN(dNow.getTime())) {
    return "Erreur: dates invalides";
  }

  const realProg = parseFloat(progressionReelle);
  if (isNaN(realProg)) return "Erreur: progression invalide";

  // Durée totale du projet en jours
  const dureeTotale = dEnd.getTime() - dStart.getTime();
  if (dureeTotale <= 0) return "Erreur: dates incohérentes";

  // Durée écoulée
  let tempsEcoule = dNow.getTime() - dStart.getTime();
  if (tempsEcoule < 0) tempsEcoule = 0; // Projet pas encore commencé
  if (tempsEcoule > dureeTotale) tempsEcoule = dureeTotale; // Projet théoriquement fini

  const expectedProg = tempsEcoule / dureeTotale;

  if (expectedProg === 0) return realProg > 0 ? 1 : 1; // Pas commencé, SPI neutre

  // Gérer la valeur passée (si c'est 45 au lieu de 0.45)
  const realValue = realProg > 1 ? realProg / 100 : realProg;

  const spi = realValue / expectedProg;

  return Math.round(spi * 100) / 100;
}
