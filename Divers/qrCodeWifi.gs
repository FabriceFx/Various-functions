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
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} ssid   Nom du réseau (SSID) ou plage.
 * @param {string} motDePasse                  Mot de passe du Wi-Fi.
 * @param {string} [securite="WPA"]             Sécurité ("WPA", "WEP", "nopass").
 * @return {string|Array<Array<string>>}        URL du QR Code ou tableau.
 * @customfunction
 *
 *   =IMAGE(QR_CODE_WIFI("Livebox-1234"; "MonMotDePasse"))
 *   =IMAGE(QR_CODE_WIFI(A2:A100; "MotDePasseUnique"))
 */
function QR_CODE_WIFI(ssid, motDePasse, securite = "WPA") {
  return batchProcess(ssid, (val) => {
    if (!val) return "Erreur: SSID requis";

    const s = String(val);
    const p = String(motDePasse || "");
    let sec = String(securite).toUpperCase();

    if (sec !== "WEP" && sec !== "WPA" && sec !== "NOPASS") {
      sec = "WPA";
    }

    const wifiString = `WIFI:T:${sec};S:${s};P:${p};;`;
    const encodedData = encodeURIComponent(wifiString);
    
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
  });
}
