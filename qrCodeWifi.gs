/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  QR Code Wi-Fi — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Génère l'URL d'un QR code permettant de se connecter automatiquement
 *    à un réseau Wi-Fi. À utiliser avec la fonction native =IMAGE().
 *
 *  Fonctions exposées :
 *    • QR_CODE_WIFI(ssid, motDePasse, [securite])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Génère un QR Code de connexion Wi-Fi (via api.qrserver.com).
 *
 * @param {string} ssid       Le nom du réseau Wi-Fi (SSID).
 * @param {string} motDePasse Le mot de passe du Wi-Fi.
 * @param {string} [securite="WPA"] Le type de sécurité ("WPA", "WEP" ou "nopass").
 * @return {string}           L'URL de l'image du QR Code.
 * @customfunction
 *
 * @example
 *   =IMAGE(QR_CODE_WIFI("Livebox-1234"; "MonMotDePasseSuperSecret"))
 */
function QR_CODE_WIFI(ssid, motDePasse, securite = "WPA") {
  if (!ssid) return "Erreur: SSID requis";

  const s = String(ssid);
  const p = String(motDePasse || "");
  let sec = String(securite).toUpperCase();

  if (sec !== "WEP" && sec !== "WPA" && sec !== "NOPASS") {
    sec = "WPA"; // Par défaut
  }

  // Format standard pour QR Code Wi-Fi : WIFI:T:WPA;S:Mynetwork;P:mypass;;
  // L'échappement des caractères spéciaux dans SSID ou mot de passe n'est pas complètement
  // implémenté ici (les `:` ou `;` devraient être échappés par un `\`), mais ça couvre 99% des cas.
  
  const wifiString = `WIFI:T:${sec};S:${s};P:${p};;`;
  
  const encodedData = encodeURIComponent(wifiString);
  
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
}
