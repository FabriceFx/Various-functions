/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Génération d'URL QR Code — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Génère l'URL d'une API publique créant un QR Code. 
 *    Peut être utilisé avec la fonction native =IMAGE() de Google Sheets.
 *
 *  Fonctions exposées :
 *    • qrCodeURL(texte, [taille])  → URL de l'image du QR Code
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Génère l'URL d'un QR code pour un texte donné (via api.qrserver.com).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte  Le texte ou plage.
 * @param {number} [taille=200]                 Taille en pixels.
 * @return {string|Array<Array<string>>}        L'URL de l'image ou tableau.
 * @customfunction
 *
 *   =IMAGE(qrCodeURL("https://faucheux.bzh"))
 *   =IMAGE(qrCodeURL(A2:A100))
 */
function qrCodeURL(texte, taille = 200) {
  return batchProcess(texte, (val) => {
    if (val == null || String(val).trim() === "") return "";
    
    const textEncoded = encodeURIComponent(String(val));
    const size = parseInt(taille, 10);
    const sizeParam = isNaN(size) ? "200x200" : `${size}x${size}`;
    
    return `https://api.qrserver.com/v1/create-qr-code/?size=${sizeParam}&data=${textEncoded}`;
  });
}
