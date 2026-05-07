/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Constructeur UTM — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Génère proprement une URL taguée (paramètres UTM) pour 
 *    le tracking des campagnes Marketing (Google Analytics, etc.).
 *
 *  Fonctions exposées :
 *    • CONSTRUCTEUR_UTM(url, source, support, campagne, [terme], [contenu])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Génère une URL avec des paramètres UTM d'Analytics.
 *
 * @param {string} url       URL de destination (ex: https://monsite.com).
 * @param {string} source    utm_source (ex: google, newsletter).
 * @param {string} support   utm_medium (ex: cpc, email).
 * @param {string} campagne  utm_campaign (ex: promo_ete).
 * @param {string} [terme]   utm_term (Optionnel).
 * @param {string} [contenu] utm_content (Optionnel).
 * @return {string}          URL complète formatée.
 * @customfunction
 *
 * @example
 *   =CONSTRUCTEUR_UTM("https://faucheux.bzh"; "linkedin"; "social"; "lancement")
 */
function CONSTRUCTEUR_UTM(url, source, support, campagne, terme = "", contenu = "") {
  if (!url || !source || !support || !campagne) return "Erreur: paramètres obligatoires manquants";

  let finalUrl = String(url).trim();
  const params = [];

  params.push(`utm_source=${encodeURIComponent(String(source).trim())}`);
  params.push(`utm_medium=${encodeURIComponent(String(support).trim())}`);
  params.push(`utm_campaign=${encodeURIComponent(String(campagne).trim())}`);

  if (terme) params.push(`utm_term=${encodeURIComponent(String(terme).trim())}`);
  if (contenu) params.push(`utm_content=${encodeURIComponent(String(contenu).trim())}`);

  const separateur = finalUrl.includes("?") ? "&" : "?";
  return finalUrl + separateur + params.join("&");
}
