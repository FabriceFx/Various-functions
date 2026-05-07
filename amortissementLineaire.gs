/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Amortissement Linéaire — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule l'annuité d'amortissement pour l'exercice comptable en cours,
 *    en tenant compte du prorata temporis la première et la dernière année.
 *
 *  Fonctions exposées :
 *    • AMORTISSEMENT_LINEAIRE(valeur, dureeAnnees, dateAchat, anneeExercice)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule la dotation aux amortissements d'une immobilisation pour une année donnée.
 *
 * @param {number} valeur         Valeur d'achat HT du bien.
 * @param {number} dureeAnnees    Durée d'amortissement prévue en années.
 * @param {Date|string} dateAchat Date de mise en service/achat.
 * @param {number} anneeExercice  L'année pour laquelle on calcule la dotation.
 * @return {number}               Le montant de l'amortissement pour cette année.
 * @customfunction
 *
 * @example
 *   =AMORTISSEMENT_LINEAIRE(10000; 5; "2024-07-01"; 2024)
 */
function AMORTISSEMENT_LINEAIRE(valeur, dureeAnnees, dateAchat, anneeExercice) {
  const v = parseFloat(valeur);
  const d = parseInt(dureeAnnees, 10);
  const anneeEx = parseInt(anneeExercice, 10);
  
  if (isNaN(v) || isNaN(d) || isNaN(anneeEx)) return "Erreur: paramètres invalides";

  const dateAcq = new Date(dateAchat);
  if (isNaN(dateAcq.getTime())) return "Erreur: date invalide";

  const anneeAcq = dateAcq.getFullYear();
  const anneeFin = anneeAcq + d;

  // Si l'année demandée est en dehors de la période d'amortissement
  if (anneeEx < anneeAcq || anneeEx > anneeFin) return 0;

  const annuitePleine = v / d;

  // Calcul du prorata temporis pour la première année (en jours comptables = mois de 30 jours, année de 360)
  // Mois entier pour le mois d'achat, on va simplifier ici en prenant la différence de mois
  const moisAcq = dateAcq.getMonth(); // 0-11
  const jourAcq = dateAcq.getDate();
  
  // Règle comptable FR : l'amortissement linéaire démarre à la date de mise en service.
  // On compte en jours sur 360.
  const joursUtilisesAnnee1 = (12 - moisAcq - 1) * 30 + (30 - Math.min(jourAcq, 30) + 1);
  const prorataAnnee1 = joursUtilisesAnnee1 / 360;
  
  const annuiteAnnee1 = annuitePleine * prorataAnnee1;

  if (anneeEx === anneeAcq) {
    return Math.round(annuiteAnnee1 * 100) / 100;
  }

  if (anneeEx === anneeFin) {
    // La dernière année absorbe le reste du prorata de la première année
    const annuiteDerniereAnnee = annuitePleine - annuiteAnnee1;
    // Eviter les arrondis négatifs ou bizarres
    return Math.round(Math.max(0, annuiteDerniereAnnee) * 100) / 100;
  }

  // Année pleine
  return Math.round(annuitePleine * 100) / 100;
}
