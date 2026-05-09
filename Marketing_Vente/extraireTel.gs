/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction de Numéro de Téléphone (FR) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Isole et normalise un numéro de téléphone français (06... ou +33...)
 *    au milieu d'un bloc de texte.
 *
 *  Fonctions exposées :
 *    • EXTRAIRE_TEL(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Extrait et normalise un numéro de téléphone.
 * Supporte les formats français par défaut et internationaux (E.164).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte  Le texte ou une plage de cellules.
 * @param {string} [pays='FR']                 Code pays pour le formatage (ex: 'FR', 'US').
 * @return {string|Array<Array<string>>}       Le numéro formaté ou tableau de résultats.
 * @customfunction
 *
 * @example
 *   =EXTRAIRE_TEL("Call +33612345678"; "FR") → "06 12 34 56 78"
 *   =EXTRAIRE_TEL(A2:A50)                    → [Tableau de résultats]
 */
function EXTRAIRE_TEL(texte, pays = 'FR') {
  return batchProcess(texte, (val) => {
    if (!val || String(val).trim() === "") return "";

    // Regex générique pour détecter un numéro (simplifiée)
    // Cherche une suite de chiffres potentiellement précédée de +
    const regex = /(?:\+|00)?(?:\d[\s.-]*){8,15}/;
    const match = String(val).match(regex);

    if (!match) return "";

    // Nettoyage: on garde que les chiffres et le + initial
    let clean = match[0].trim().replace(/[^\d+]/g, "");
    if (clean.startsWith("00")) clean = "+" + clean.substring(2);

    // Formatage spécifique France
    if (pays.toUpperCase() === 'FR') {
      if (clean.startsWith("+33")) {
        clean = "0" + clean.substring(3);
      } else if (!clean.startsWith("+") && clean.length === 9) {
        clean = "0" + clean;
      }
      
      if (clean.length === 10 && clean.startsWith("0")) {
        return clean.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
      }
    }

    return clean;
  });
}
