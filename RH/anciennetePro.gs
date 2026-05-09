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
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDebut  Date d'embauche ou plage.
 * @param {Date|string} [dateFin]                    Date de fin.
 * @return {string|Array<Array<string>>}             L'ancienneté ou tableau de résultats.
 * @customfunction
 *
 *   =ANCIENNETE_PRO("2015-09-01")
 *   =ANCIENNETE_PRO(A2:A100)
 */
function ANCIENNETE_PRO(dateDebut, dateFin) {
  return batchProcess(dateDebut, (val) => {
    if (!val) return "";

    const d1 = _parseDate(val);
    const d2 = dateFin ? _parseDate(dateFin) : new Date();

    if (!d1 || !d2) {
      return "Erreur: format de date invalide";
    }

    if (d1 > d2) return "Période invalide";

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
  });
}
