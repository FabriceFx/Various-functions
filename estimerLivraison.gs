/** @OnlyCurrentDoc */

/**
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
 */

/**
 * Estime la date de livraison selon le code postal de destination.
 * Ignore les week-ends (ajoute les jours de façon simple).
 *
 * @param {Date|string} dateDepart Date d'expédition.
 * @param {string|number} codePostal Code postal du destinataire.
 * @return {Date} Date estimée de livraison.
 * @customfunction
 *
 * @example
 *   =ESTIMER_LIVRAISON(AUJOURDHUI(); "75001")
 */
function ESTIMER_LIVRAISON(dateDepart, codePostal) {
  if (!dateDepart || !codePostal) return "Erreur: paramètres manquants";

  const depart = new Date(dateDepart);
  if (isNaN(depart.getTime())) return "Erreur: date invalide";

  const cp = String(codePostal).trim();
  const dep = cp.substring(0, 2);
  
  let delaiJours = 2; // Défaut: province

  const idf = ["75", "77", "78", "91", "92", "93", "94", "95"];
  
  if (idf.includes(dep)) {
    delaiJours = 1;
  } else if (dep === "20" || cp.startsWith("2A") || cp.startsWith("2B") || dep === "97" || dep === "98") {
    delaiJours = 5;
  }

  // On ajoute les jours, en sautant les week-ends (simplifié)
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
}
