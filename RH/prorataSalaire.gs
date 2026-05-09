/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Prorata de Salaire (Méthode Cour de Cassation — FR) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Calcule le salaire proratisé pour une entrée ou sortie en cours de mois,
 *    selon la méthode des "heures réelles" (obligatoire en France).
 *
 *  Fonctions exposées :
 *    • PRORATA_SALAIRE(salaireMensuel, dateDebut, dateFin)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Calcule le prorata de salaire mensuel selon les jours ouvrés réels.
 * Formule : Salaire * (Jours ouvrés travaillés / Jours ouvrés totaux du mois)
 *
 * @param {number|Array<Array<number>>} salaireMensuel Salaire brut mensuel.
 * @param {Date|string}                dateDebut      Date de début de présence dans le mois.
 * @param {Date|string}                dateFin        Date de fin de présence dans le mois.
 * @return {number|Array<Array<number>>}               Salaire proratisé.
 * @customfunction
 *
 *   =PRORATA_SALAIRE(3000; "2026-05-12"; "2026-05-31")
 */
function PRORATA_SALAIRE(salaireMensuel, dateDebut, dateFin) {
  return BATCH_PROCESS(salaireMensuel, (salaire) => {
    const errSalaire = GUARD.isNumber(salaire, "Le salaire");
    const errDebut = GUARD.isDate(dateDebut, "Date de début");
    const errFin = GUARD.isDate(dateFin, "Date de fin");
    
    if (errSalaire || errDebut || errFin) return `Erreur: ${errSalaire || errDebut || errFin}`;

    const d1 = _parseDate(dateDebut);
    const d2 = _parseDate(dateFin);

    if (d1.getMonth() !== d2.getMonth() || d1.getFullYear() !== d2.getFullYear()) {
      return "Erreur: Les dates doivent être dans le même mois";
    }

    // 1. Calculer les jours ouvrés travaillés sur la période
    const joursTravailles = JOURS_OUVRES(d1, d2);
    
    // 2. Calculer les jours ouvrés totaux du mois entier
    const premierDuMois = new Date(d1.getFullYear(), d1.getMonth(), 1);
    const dernierDuMois = new Date(d1.getFullYear(), d1.getMonth() + 1, 0);
    const joursTotaux = JOURS_OUVRES(premierDuMois, dernierDuMois);

    if (joursTotaux === 0) return 0;

    return (salaire * joursTravailles) / joursTotaux;
  });
}
