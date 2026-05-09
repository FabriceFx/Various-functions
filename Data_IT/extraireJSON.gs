/*
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
 * @OnlyCurrentDoc
 */

/**
 * Extrait une valeur d'une chaîne JSON formatée en utilisant un chemin.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} chaineJSON Le texte JSON ou plage.
 * @param {string} chemin Le chemin de la valeur (ex: "user.nom").
 * @return {any|Array<Array<any>>}                  La valeur extraite ou tableau de résultats.
 * @customfunction
 *
 *   =extraireJSON(A2; "client.adresse.ville")
 *   =extraireJSON(A2:A100; "status")
 */
function extraireJSON(chaineJSON, chemin) {
  return batchProcess(chaineJSON, (val) => {
    if (!val || !chemin) return "Erreur: paramètres manquants";

    let objet;
    try {
      objet = JSON.parse(val);
    } catch (e) {
      return "Erreur: JSON invalide";
    }

    const pathParts = String(chemin)
      .replace(/\[(\w+)\]/g, '.$1')
      .replace(/^\./, '')
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
    
    if (typeof valeurActuelle === 'object' && valeurActuelle !== null) {
      return JSON.stringify(valeurActuelle);
    }

    return valeurActuelle;
  });
}
