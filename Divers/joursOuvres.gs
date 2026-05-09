/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Jours ouvrés et fériés (France) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le nombre de jours ouvrés entre deux dates en tenant compte
 *    des week-ends et des jours fériés français (fixes et mobiles comme Pâques).
 *
 *  Fonctions exposées :
 *    • joursOuvres(debut, fin)    → nombre de jours ouvrés
 *    • estJourFerieFR(date)       → VRAI/FAUX
 *    • listerFeriesFR(annee)      → liste des jours fériés de l'année
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule le nombre de jours ouvrés entre deux dates (incluses).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDebut  Date de début ou plage.
 * @param {Date|string} dateFin                      Date de fin.
 * @return {number|Array<Array<number>>}             Nombre de jours ouvrés ou tableau.
 * @customfunction
 *
 *   =joursOuvres("2026-05-01"; "2026-05-31")
 *   =joursOuvres(A2:A100; "2026-12-31")
 */
function joursOuvres(dateDebut, dateFin) {
  return batchProcess(dateDebut, (val) => {
    // Clauses de garde systématiques
    const errDebut = GUARD.isDate(val, "Date de début");
    const errFin = GUARD.isDate(dateFin, "Date de fin");
    
    const error = errDebut || errFin;
    if (error) return `Erreur: ${error}`;

    const start = _parseDate(val);
    const end = _parseDate(dateFin);

    const d1 = start <= end ? start : end;
    const d2 = start <= end ? end : start;
    
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    let count = 0;
    const courante = new Date(d1);

    const anneesFeries = new Map();
    for (let annee = d1.getFullYear(); annee <= d2.getFullYear(); annee++) {
      const feriesStr = listerFeriesFR_(annee).map(d => d.getTime());
      anneesFeries.set(annee, new Set(feriesStr));
    }

    while (courante <= d2) {
      const jourSemaine = courante.getDay();
      if (jourSemaine !== 0 && jourSemaine !== 6) {
        const feriesAnnee = anneesFeries.get(courante.getFullYear());
        if (!feriesAnnee.has(courante.getTime())) {
          count++;
        }
      }
      courante.setDate(courante.getDate() + 1);
    }

    return start <= end ? count : -count;
  });
}

/**
 * Indique si une date est un jour férié en France.
 *
 * @param {Date|string} date  Date à vérifier.
 * @return {boolean|string}   VRAI si c'est un jour férié, ou message d'erreur.
 * @customfunction
 */
function estJourFerieFR(date) {
  const error = GUARD.isDate(date, "La date");
  if (error) return `Erreur: ${error}`;

  const d = _parseDate(date);
  d.setHours(0, 0, 0, 0);
  
  const feries = listerFeriesFR_(d.getFullYear()).map(f => f.getTime());
  return feries.includes(d.getTime());
}

/**
 * Calcule les jours fériés français pour une année donnée.
 *
 * @param {number} annee  L'année.
 * @return {Date[]}       Tableau des dates des jours fériés.
 * @private
 */
function listerFeriesFR_(annee) {
  const feriesFixes = [
    new Date(annee, 0, 1),   // 1er Janvier
    new Date(annee, 4, 1),   // 1er Mai
    new Date(annee, 4, 8),   // 8 Mai
    new Date(annee, 6, 14),  // 14 Juillet
    new Date(annee, 7, 15),  // 15 Août
    new Date(annee, 10, 1),  // 1er Novembre
    new Date(annee, 10, 11), // 11 Novembre
    new Date(annee, 11, 25)  // 25 Décembre
  ];

  // Calcul de la date de Pâques (algorithme de Butcher-Meeus)
  const a = annee % 19;
  const b = Math.floor(annee / 100);
  const c = annee % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const moisPaques = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexé
  const jourPaques = ((h + l - 7 * m + 114) % 31) + 1;

  const paques = new Date(annee, moisPaques, jourPaques);
  
  // Jours fériés mobiles
  const lundiDePaques = new Date(paques);
  lundiDePaques.setDate(paques.getDate() + 1);
  
  const ascension = new Date(paques);
  ascension.setDate(paques.getDate() + 39);
  
  const lundiDePentecote = new Date(paques);
  lundiDePentecote.setDate(paques.getDate() + 50);

  const tousFeries = [...feriesFixes, lundiDePaques, ascension, lundiDePentecote];
  
  // S'assurer que toutes les heures sont à 0 pour la comparaison
  tousFeries.forEach(d => d.setHours(0, 0, 0, 0));
  
  return tousFeries;
}
