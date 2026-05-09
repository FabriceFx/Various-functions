/*
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
 *    • AGE_EXACT(dateNaissance, [dateReference])  → "X ans, Y mois, Z jours"
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule l'âge exact en années, mois et jours.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateNaissance Date de naissance ou plage.
 * @param {Date|string} [dateRef] Date de référence (Aujourd'hui si omis).
 * @return {string|Array<Array<string>>} Âge formaté ou tableau de résultats.
 * @customfunction
 */
function AGE_EXACT(dateNaissance, dateRef) {
  return BATCH_PROCESS(dateNaissance, (val) => {
    const errNaissance = GUARD.isDate(val, "Date de naissance");
    const errRef = dateRef ? GUARD.isDate(dateRef, "Date de référence") : null;
    
    if (errNaissance || errRef) return `Erreur: ${errNaissance || errRef}`;

    const d1 = _parseDate(val);
    const d2 = dateRef ? _parseDate(dateRef) : new Date();

    if (d1 > d2) {
      return "Date de naissance dans le futur !";
    }

    let annees = d2.getFullYear() - d1.getFullYear();
    let mois = d2.getMonth() - d1.getMonth();
    let jours = d2.getDate() - d1.getDate();

    if (jours < 0) {
      mois--;
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
  });
}
