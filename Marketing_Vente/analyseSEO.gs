/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Analyse Sémantique & SEO — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Ensemble de fonctions pour analyser le contenu textuel sous l'angle SEO
 *    et GEO (Generative Engine Optimization).
 *
 *  Fonctions exposées :
 *    • SEO_MOTS_CLES_DENSITE(texte, motCle)
 *    • SEO_LISIBILITE_FLESCH(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule l'indice de lisibilité de Flesch (adapté au français).
 * Plus le score est élevé (proche de 100), plus le texte est facile à lire.
 * Score > 60 : Standard/Clair | Score < 30 : Très complexe (Expert).
 *
 * @param {string|Array<Array<any>>} input  Le texte à analyser ou une plage.
 * @return {number|Array<Array<number>>}    Score de lisibilité (0 à 100+).
 * @customfunction
 *
 * @example
 *   =SEO_LISIBILITE_FLESCH("Le chat mange la souris.") → 102.5
 */
function SEO_LISIBILITE_FLESCH(input) {
  return batchProcess(input, (val) => {
    if (!val || String(val).trim() === "") return 0;

    const texte = String(val).trim();
    
    // 1. Comptage des phrases (terminées par . ! ? :)
    const phrases = texte.split(/[.!?:]+/).filter(p => p.trim().length > 0);
    const nbPhrases = Math.max(1, phrases.length);

    // 2. Comptage des mots
    const mots = texte.match(/[\w\u00C0-\u00FF]+/g) || [];
    const nbMots = mots.length;
    if (nbMots === 0) return 0;

    // 3. Comptage des syllabes
    let nbSyllabes = 0;
    mots.forEach(mot => {
      nbSyllabes += _compterSyllabesFR(mot);
    });

    // Formule de Flesch-Kandel (adaptée au français) :
    // Score = 207 − 1.015 * (mots/phrases) − 73.6 * (syllabes/mots)
    const score = 207 - 1.015 * (nbMots / nbPhrases) - 73.6 * (nbSyllabes / nbMots);

    return Math.round(score * 10) / 10;
  });
}

/**
 * Approximation du nombre de syllabes pour un mot français.
 * @private
 */
function _compterSyllabesFR(mot) {
  let m = mot.toLowerCase().replace(/[^a-zà-ÿ]/g, '').trim();
  if (m.length <= 3) return 1;

  // Remplacer les diphtongues complexes qui comptent généralement pour 1 syllabe
  // ion, ieu, iou, ia, ie, io, ua, ue, ui, uo
  m = m.replace(/(?:eau|au|ai|ei|eu|oi|ou|ui|iou|ieu|ion|ia|ie|io|ua|ue|uo)/g, 'a');
  
  // Cas particulier du 'e' muet final (souvent non prononcé)
  if (m.endsWith('e') && m.length > 2) m = m.slice(0, -1);

  // Compter les voyelles restantes (y compris accentuées)
  const voyelles = m.match(/[aeiouy\u00E0\u00E2\u00E9\u00E8\u00EA\u00EB\u00EE\u00EF\u00F4\u00FB\u00F9]/g);
  
  return voyelles ? Math.max(1, voyelles.length) : 1;
}

/**
 * Calcule la densité d'un mot-clé dans un texte.
 * Supporte le traitement par lot.
 *
 * @param {string|Array<Array<any>>} input  Le texte à analyser ou une plage.
 * @param {string} motCle                   Le mot ou expression à chercher.
 * @return {number|Array<Array<number>>}    Densité en pourcentage (ex: 0.02 pour 2%).
 * @customfunction
 *
 * @example
 *   =SEO_MOTS_CLES_DENSITE(A2; "Google Sheets")
 */
function SEO_MOTS_CLES_DENSITE(input, motCle) {
  return batchProcess(input, (val) => {
    if (!val || !motCle) return 0;

    const t = String(val).toLowerCase();
    const keyword = String(motCle).toLowerCase();

    // On compte le nombre total de mots (approximation simple)
    const words = t.match(/[\w\u00C0-\u00FF]+/g) || [];
    if (words.length === 0) return 0;

    // On compte les occurrences du mot clé (exact ou expression)
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedKeyword, 'g');
    const matches = t.match(regex) || [];

    // Densité = (Occurrences / Nombre de mots)
    return Math.round((matches.length / words.length) * 1000) / 1000;
  });
}
