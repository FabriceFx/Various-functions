/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Estimateur de Livraison — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Estime une date de livraison selon une zone géographique. 
 *    Dans cet exemple : J+1 pour Ile-de-France (75, 77, 78, 91, 92, 93, 94, 95),
 *    J+2 pour la province, J+5 pour la Corse/DOM-TOM.
 *
 *  Fonctions exposées :
 *    • ESTIMER_LIVRAISON(dateDepart, codePostal)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Estime la date de livraison selon le code postal de destination.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDepart Date d'expédition ou plage.
 * @param {string|number} codePostal Code postal du destinataire.
 * @return {Date|string|Array<Array<Date|string>>}    Date estimée ou tableau de résultats.
 * @customfunction
 *
 *   =ESTIMER_LIVRAISON(AUJOURDHUI(); "75001")
 *   =ESTIMER_LIVRAISON(A2:A100; "75001")
 */
function ESTIMER_LIVRAISON(dateDepart, codePostal) {
  return BATCH_PROCESS(dateDepart, (val) => {
    if (!val || !codePostal) return "Erreur: paramètres manquants";

    const depart = _parseDate(val);
    if (!depart) return "Erreur: date invalide";

    const cp = String(codePostal).trim();
    const dep = cp.substring(0, 2);
    
    let delaiJours = 2; // Défaut: province

    const idf = ["75", "77", "78", "91", "92", "93", "94", "95"];
    
    if (idf.includes(dep)) {
      delaiJours = 1;
    } else if (dep === "20" || cp.startsWith("2A") || cp.startsWith("2B") || dep === "97" || dep === "98") {
      delaiJours = 5;
    }

    let dateLivraison = new Date(depart);
    let joursAjoutes = 0;

    while (joursAjoutes < delaiJours) {
      dateLivraison.setDate(dateLivraison.getDate() + 1);
      const jour = dateLivraison.getDay();
      if (jour !== 0 && jour !== 6) { // Pas dimanche ni samedi
        joursAjoutes++;
      }
    }

    return dateLivraison;
  });
}
