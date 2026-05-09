/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Anonymisation de Données Personnelles (PII) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *  Licence : MIT
 *
 *  Description :
 *    Remplace les données sensibles (Emails, IBAN, CB, etc.) par des versions
 *    masquées pour assurer la conformité RGPD lors du partage de fichiers.
 *
 *  Fonctions exposées :
 *    • MASK_PII(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Masque les données sensibles détectées dans un texte ou une plage.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<any>>} input  Le texte à anonymiser ou une plage.
 * @return {string|Array<Array<string>>}     Le texte masqué ou tableau de résultats.
 * @customfunction
 *
 */
function MASK_PII(input) {
  return batchProcess(input, (val) => {
    let t = String(val ?? "");
    if (!t.trim()) return t;

    for (const rule of CONFIG.PII_RULES) {
      // On utilise une boucle pour remplacer toutes les occurrences trouvées par la regex
      // Si la regex n'a pas le flag 'g', on boucle tant qu'il y a un match
      const globalRegex = new RegExp(rule.regex.source, rule.regex.flags.includes('g') ? rule.regex.flags : rule.regex.flags + 'g');
      
      t = t.replace(globalRegex, (match) => {
        // Si une validation spécifique existe (ex: Luhn), on ne masque que si valide
        if (rule.validate && !rule.validate(match)) return match;
        return rule.mask ? rule.mask(match) : "****";
      });
    }

    return t;
  });
}
