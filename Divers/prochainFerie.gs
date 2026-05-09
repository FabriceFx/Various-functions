/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Prochain Jour Férié (France) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Retourne la date du prochain jour férié en France à partir d'une date.
 *
 *  Fonctions exposées :
 *    • prochainFerie(date)  → Date du prochain jour férié
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Retourne la date du prochain jour férié en France à partir d'une date donnée.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateRef  Date de référence ou plage.
 * @return {Date|Array<Array<Date>>}                La date du prochain jour férié.
 * @customfunction
 *
 *   =prochainFerie(AUJOURDHUI())
 *   =prochainFerie(A2:A100)
 */
function prochainFerie(dateRef) {
  return batchProcess(dateRef, (val) => {
    const reference = val ? _parseDate(val) : new Date();
    if (!reference) return "Erreur: format de date invalide";
    
    reference.setHours(0, 0, 0, 0);

    const annee = reference.getFullYear();
    let feries = listerFeriesPourAnnee_(annee);
    
    feries.sort((a, b) => a - b);
    
    for (const f of feries) {
      if (f > reference) {
        return f;
      }
    }
    
    return new Date(annee + 1, 0, 1);
  });
}

/**
 * Calcule les jours fériés français pour une année donnée.
 * @private
 */
function listerFeriesPourAnnee_(annee) {
  const feries = [
    new Date(annee, 0, 1),   // 1er Janvier
    new Date(annee, 4, 1),   // 1er Mai
    new Date(annee, 4, 8),   // 8 Mai
    new Date(annee, 6, 14),  // 14 Juillet
    new Date(annee, 7, 15),  // 15 Août
    new Date(annee, 10, 1),  // 1er Novembre
    new Date(annee, 10, 11), // 11 Novembre
    new Date(annee, 11, 25)  // 25 Décembre
  ];

  // Calcul Pâques (Butcher-Meeus)
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
  const moisPaques = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const jourPaques = ((h + l - 7 * m + 114) % 31) + 1;

  const paques = new Date(annee, moisPaques, jourPaques);
  
  const lundiDePaques = new Date(paques);
  lundiDePaques.setDate(paques.getDate() + 1);
  
  const ascension = new Date(paques);
  ascension.setDate(paques.getDate() + 39);
  
  const lundiDePentecote = new Date(paques);
  lundiDePentecote.setDate(paques.getDate() + 50);

  feries.push(lundiDePaques, ascension, lundiDePentecote);
  feries.forEach(d => d.setHours(0,0,0,0));
  
  return feries;
}
