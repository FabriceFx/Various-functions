/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Compteur de Fréquence de Mots — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Analyse une plage de texte et génère un tableau récapitulatif
 *    des mots les plus fréquents, en ignorant les mots de liaison (stop words).
 *
 *  Fonctions exposées :
 *    • frequenceMots(plage, exclureLiaison, topN)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Extrait les mots les plus utilisés d'une plage de texte.
 * Renvoie un tableau à deux colonnes : [Mot, Occurrences].
 *
 * @param {Array<Array<string>>|string} plage  Plage de cellules ou texte.
 * @param {boolean} [exclureLiaison=true]      Ignorer les "stop words" français (le, la, et...).
 * @param {number} [topN=10]                   Nombre de mots à retourner (Top 10 par défaut).
 * @return {Array<Array<any>>}                 Tableau [Mot, Nombre].
 * @customfunction
 *
 * @example
 *   =frequenceMots(A2:A100; VRAI; 20)
 */
function frequenceMots(plage, exclureLiaison = true, topN = 10) {
  if (!plage) return [["Erreur", "Aucune donnée"]];

  const limite = parseInt(topN, 10) || 10;
  let texteComplet = "";

  // Aplatir la plage si c'est un tableau 2D
  if (Array.isArray(plage)) {
    for (let r = 0; r < plage.length; r++) {
      for (let c = 0; c < plage[r].length; c++) {
        if (plage[r][c]) {
          texteComplet += " " + String(plage[r][c]);
        }
      }
    }
  } else {
    texteComplet = String(plage);
  }

  // Nettoyer et tokeniser
  const mots = texteComplet
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlever accents pour compter
    .replace(/[^\w\s]/g, " ")                         // Remplacer ponctuation par espace
    .split(/\s+/)                                     // Séparer par espaces
    .filter(mot => mot.length > 1);                   // Ignorer les lettres seules

  if (mots.length === 0) return [["Aucun mot trouvé", 0]];

  // Compter les occurrences
  const compte = {};
  for (const mot of mots) {
    if (exclureLiaison && CONFIG.STOP_WORDS_FR.has(mot)) continue;
    
    // Ignorer les nombres
    if (/^\d+$/.test(mot)) continue;

    compte[mot] = (compte[mot] || 0) + 1;
  }

  // Convertir en tableau pour le tri
  const tableauTri = Object.entries(compte).sort((a, b) => b[1] - a[1]);

  // Préparer le format de retour (avec entête)
  const resultats = [["Mot", "Occurrences"]];
  
  for (let i = 0; i < Math.min(limite, tableauTri.length); i++) {
    resultats.push(tableauTri[i]);
  }

  if (resultats.length === 1) return [["Aucun mot pertinent", 0]];

  return resultats;
}
