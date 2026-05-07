/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Ancienneté Professionnelle — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Retourne l'ancienneté sous forme textuelle (ex: "12 ans et 4 mois").
 *    Idéal pour les grilles salariales RH.
 *
 *  Fonctions exposées :
 *    • ANCIENNETE_PRO(dateDebut, [dateFin])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Retourne l'ancienneté sous forme textuelle ("X ans et Y mois").
 *
 * @param {Date|string} dateDebut  Date d'embauche.
 * @param {Date|string} [dateFin]  Date de fin (Aujourd'hui par défaut).
 * @return {string}                L'ancienneté au format texte.
 * @customfunction
 *
 * @example
 *   =ANCIENNETE_PRO("2015-09-01")
 */
function ANCIENNETE_PRO(dateDebut, dateFin) {
  if (!dateDebut) return "";

  const d1 = new Date(dateDebut);
  const d2 = dateFin ? new Date(dateFin) : new Date();

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return "Erreur: format de date invalide";
  }

  if (d1 > d2) return "Période invalide (début > fin)";

  let annees = d2.getFullYear() - d1.getFullYear();
  let mois = d2.getMonth() - d1.getMonth();

  if (d2.getDate() < d1.getDate()) {
    mois--;
  }

  if (mois < 0) {
    annees--;
    mois += 12;
  }

  let res = "";
  if (annees > 0) res += `${annees} an${annees > 1 ? "s" : ""}`;
  if (mois > 0) {
    if (res !== "") res += " et ";
    res += `${mois} mois`;
  }

  return res === "" ? "Moins d'un mois" : res;
}
