/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Extracteur JSON — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Permet d'extraire n'importe quelle valeur d'une chaîne JSON complexe
 *    en utilisant la notation par point (dot notation).
 *    Idéal pour traiter des webhooks ou des payloads API dans Sheets.
 *
 *  Fonctions exposées :
 *    • extraireJSON(json, chemin)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Extrait une valeur d'une chaîne JSON formatée en utilisant un chemin.
 *
 * @param {string} chaineJSON  Le texte au format JSON (ex: '{"user": {"nom": "Paul"}}').
 * @param {string} chemin      Le chemin de la valeur (ex: "user.nom" ou "items[0].prix").
 * @return {any}               La valeur extraite ou une erreur.
 * @customfunction
 *
 * @example
 *   =extraireJSON(A2; "client.adresse.ville")
 *   =extraireJSON(A2; "produits[0].nom")
 */
function extraireJSON(chaineJSON, chemin) {
  if (!chaineJSON || !chemin) return "Erreur: paramètres manquants";

  let objet;
  try {
    objet = JSON.parse(chaineJSON);
  } catch (e) {
    return "Erreur: JSON invalide";
  }

  // Nettoyage et transformation du chemin (gère les crochets [0] -> .0)
  const pathParts = String(chemin)
    .replace(/\[(\w+)\]/g, '.$1') // Transforme array[0] en array.0
    .replace(/^\./, '')           // Enlève le point initial s'il y en a un
    .split('.');

  let valeurActuelle = objet;

  for (let i = 0; i < pathParts.length; i++) {
    const cle = pathParts[i];
    
    if (valeurActuelle === null || valeurActuelle === undefined || typeof valeurActuelle !== 'object') {
      return "Chemin introuvable";
    }

    valeurActuelle = valeurActuelle[cle];
  }

  if (valeurActuelle === undefined) return "Chemin introuvable";
  
  // Renvoyer les objets ou tableaux sous forme de JSON stringifié
  if (typeof valeurActuelle === 'object' && valeurActuelle !== null) {
    return JSON.stringify(valeurActuelle);
  }

  return valeurActuelle;
}
