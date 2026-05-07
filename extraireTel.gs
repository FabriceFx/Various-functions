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
 * Extrait et normalise un numéro de téléphone français.
 *
 * @param {string} texte  Le texte contenant potentiellement un numéro.
 * @return {string}       Le numéro formaté (ex: "06 12 34 56 78") ou vide.
 * @customfunction
 *
 * @example
 *   =EXTRAIRE_TEL("Contactez moi au 06.12.34.56.78 ce soir.")
 *   → "06 12 34 56 78"
 */
function EXTRAIRE_TEL(texte) {
  if (!texte || String(texte).trim() === "") return "";

  // Regex qui cherche un format français : 0 ou +33, suivi de 1 à 9, suivi de 4 blocs de 2 chiffres (séparés ou non par espace, point, tiret)
  const regex = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
  const match = String(texte).match(regex);

  if (!match) return "";

  // Nettoyage: on garde que les chiffres et le +
  let clean = match[0].replace(/[^\d+]/g, "");

  // Si ça commence par +33 ou 0033, on transforme en 0
  if (clean.startsWith("+33")) {
    clean = "0" + clean.substring(3);
  } else if (clean.startsWith("0033")) {
    clean = "0" + clean.substring(4);
  }

  // Si le numéro fait bien 10 chiffres
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  }

  return clean; // Retourne le numéro brut s'il est étrange
}
