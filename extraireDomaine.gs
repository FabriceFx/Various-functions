/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction de domaine — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Extrait le nom de domaine principal d'une URL complète,
 *    en supprimant le protocole (http/https), les sous-domaines (www)
 *    et le chemin d'accès.
 *
 *  Fonctions exposées :
 *    • extraireDomaine(url)  → Nom de domaine
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Extrait le domaine principal d'une URL.
 *
 * @param {string} url  L'URL complète (ex: "https://www.faucheux.bzh/contact").
 * @return {string}     Le domaine extrait (ex: "faucheux.bzh").
 * @customfunction
 *
 * @example
 *   =extraireDomaine("https://www.google.fr/search?q=test")  → "google.fr"
 */
function extraireDomaine(url) {
  if (url == null || String(url).trim() === "") return "";

  let domaine = String(url).trim();
  
  // Ajouter un protocole temporaire si manquant pour que la regex fonctionne bien
  if (!/^https?:\/\//i.test(domaine)) {
    domaine = "http://" + domaine;
  }

  try {
    // Utilisation d'une regex pour extraire le hostname
    const match = domaine.match(/^https?:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    if (!match || !match[1]) return "";
    
    let hostname = match[1];
    
    // Supprimer le port éventuel
    hostname = hostname.split(':')[0];
    
    // Supprimer "www." ou autres sous-domaines si besoin
    // Attention: cette approche simplifiée enlève juste le premier sous-domaine
    // si l'URL a plus de 2 parties. Ce n'est pas parfait pour les TLD complexes (.co.uk).
    // Une version robuste nécessiterait une librairie de suffixes publics.
    const parts = hostname.split('.');
    
    if (parts[0].toLowerCase() === 'www') {
      parts.shift();
    }
    
    return parts.join('.');
  } catch(e) {
    return "Erreur d'extraction";
  }
}
