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
 * S'utilise généralement avec =IMAGE() pour l'afficher dans la cellule.
 *
 * @param {string} texte   Le texte ou l'URL à encoder.
 * @param {number} [taille] La taille du QR Code en pixels (défaut 200).
 * @return {string}        L'URL de l'image générée.
 * @customfunction
 *
 * @example
 *   =IMAGE(qrCodeURL("https://faucheux.bzh"))
 */
function qrCodeURL(texte, taille = 200) {
  if (texte == null || String(texte).trim() === "") return "";
  
  const textEncoded = encodeURIComponent(String(texte));
  const size = parseInt(taille, 10);
  const sizeParam = isNaN(size) ? "200x200" : `${size}x${size}`;
  
  return `https://api.qrserver.com/v1/create-qr-code/?size=${sizeParam}&data=${textEncoded}`;
}
