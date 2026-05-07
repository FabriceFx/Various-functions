/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Calcul de l'âge exact — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule l'âge exact en années, mois et jours à partir d'une
 *    date de naissance et d'une date de référence (aujourd'hui par défaut).
 *
 *  Fonctions exposées :
 *    • ageExact(dateNaissance, [dateReference])  → "X ans, Y mois, Z jours"
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule l'âge exact en années, mois et jours.
 *
 * @param {Date|string} dateNaissance  Date de naissance.
 * @param {Date|string} [dateRef]      Date de référence (Aujourd'hui si omis).
 * @return {string}                    Âge formaté (ex: "32 ans, 4 mois, 12 jours").
 * @customfunction
 *
 * @example
 *   =ageExact("1990-05-15")
 *   =ageExact(A2; B2)
 */
function ageExact(dateNaissance, dateRef) {
  if (!dateNaissance) return "";

  const d1 = new Date(dateNaissance);
  const d2 = dateRef ? new Date(dateRef) : new Date();

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return "Erreur: format de date invalide";
  }

  if (d1 > d2) {
    return "Date de naissance dans le futur !";
  }

  let annees = d2.getFullYear() - d1.getFullYear();
  let mois = d2.getMonth() - d1.getMonth();
  let jours = d2.getDate() - d1.getDate();

  if (jours < 0) {
    mois--;
    // Trouver le nombre de jours dans le mois précédent
    const moisPrecedent = new Date(d2.getFullYear(), d2.getMonth(), 0);
    jours += moisPrecedent.getDate();
  }

  if (mois < 0) {
    annees--;
    mois += 12;
  }

  const parties = [];
  if (annees > 0) parties.push(`${annees} an${annees > 1 ? "s" : ""}`);
  if (mois > 0) parties.push(`${mois} mois`);
  if (jours > 0) parties.push(`${jours} jour${jours > 1 ? "s" : ""}`);

  if (parties.length === 0) return "Moins d'un jour";

  return parties.join(", ");
}
