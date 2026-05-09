/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction d'initiales — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Extrait les initiales d'un nom ou d'une phrase. Gère les noms
 *    composés avec tirets et les particules françaises.
 *
 *  Fonctions exposées :
 *    • EXTRAIRE_INITIALES(texte)  → initiales en majuscules
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Extrait les initiales d'un nom ou d'une phrase.
 * Gère les noms composés (tirets) et ignore les particules françaises.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou une plage de cellules.
 * @param {boolean} [avecParticules=false] Si true, inclut les particules.
 * @return {string|Array<Array<string>>}                Les initiales en majuscules ou tableau de résultats.
 * @customfunction
 *
 *   =EXTRAIRE_INITIALES("Jean-Pierre Dupont")                → "JPD"
 *   =EXTRAIRE_INITIALES(A2:A50; FAUX)                        → [Tableau de résultats]
 */
function EXTRAIRE_INITIALES(texte, avecParticules = false) {
  return BATCH_PROCESS(texte, (val) => {
    if (val == null || String(val).trim() === "") return "";

    const mots = String(val).trim().split(/[\s]+/);
    let initiales = "";

    for (const mot of mots) {
      const motClean = mot.replace(/['']/g, " ").trim();
      if (motClean === "") continue;

      // Ignorer les particules sauf si demandé
      if (!avecParticules && CONFIG.PARTICULES_FR.has(motClean.toLowerCase())) continue;

      // Gérer les noms composés avec tiret
      const sousParties = motClean.split("-");
      for (const partie of sousParties) {
        if (partie.length > 0) {
          initiales += partie[0].toUpperCase();
        }
      }
    }

    return initiales;
  });
}
