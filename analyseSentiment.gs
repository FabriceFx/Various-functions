/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Analyse de Sentiment Lexicale — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Évalue la tonalité d'un texte (avis client, commentaire) et retourne 
 *    un score global (Positif, Négatif, Neutre) basé sur un dictionnaire interne.
 *
 *  Fonctions exposées :
 *    • ANALYSE_SENTIMENT(texte)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Analyse la tonalité d'un texte français.
 *
 * @param {string} texte  Le texte à analyser.
 * @return {string}       Statut (ex: "🟢 Positif (Score: 2)").
 * @customfunction
 *
 * @example
 *   =ANALYSE_SENTIMENT("C'est un produit fantastique, mais la livraison a été lente.")
 */
function ANALYSE_SENTIMENT(texte) {
  if (!texte || String(texte).trim() === "") return "⚪ Neutre";

  const chaine = String(texte).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Enlever les accents

  // Dictionnaire simplifié de mots pondérés
  const motsPositifs = ["super", "genial", "fantastique", "parfait", "excellent", "bon", "bonne", "bien", "merci", "bravo", "recommande", "top", "satisfait", "adore", "agreable"];
  const motsNegatifs = ["nul", "mauvais", "pire", "horrible", "decu", "deception", "catastrophe", "lent", "lente", "retard", "casse", "probleme", "fuit", "arnaque", "honte"];
  const motsInversifs = ["pas", "jamais", "aucun", "sans"];

  const mots = chaine.replace(/[^\w\s]/g, " ").split(/\s+/);

  let score = 0;

  for (let i = 0; i < mots.length; i++) {
    const mot = mots[i];
    
    // Vérifier si le mot précédent est une inversion (ex: "pas bon")
    let multiplicateur = 1;
    if (i > 0 && motsInversifs.includes(mots[i - 1])) {
      multiplicateur = -1;
    }

    if (motsPositifs.includes(mot)) score += (1 * multiplicateur);
    if (motsNegatifs.includes(mot)) score -= (1 * multiplicateur);
  }

  if (score > 0) return `🟢 Positif (Score: ${score})`;
  if (score < 0) return `🔴 Négatif (Score: ${score})`;
  return "⚪ Neutre (Score: 0)";
}
