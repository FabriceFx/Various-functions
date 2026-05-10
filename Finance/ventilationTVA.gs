/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Ventilation de TVA Dynamique — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.1 (Ajout récupération auto via API vatlookup.eu)
 *  Date    : 2026-05-10
 *  Licence : MIT
 *
 *  Description :
 *    Déduit automatiquement le montant de la TVA et le montant HT
 *    à partir d'un TTC et d'un code de catégorie. Interroge une API
 *    pour obtenir les taux historiques si une date est fournie.
 *
 *  Fonctions exposées :
 *    • VENTILATION_TVA(montantTTC, categorie, [retour], [dateFacture])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Recherche le taux de TVA via API avec mise en cache et fallback local.
 * @private
 */
function _getVatRate(categorie, dateRecherche) {
  const d = _parseDate(dateRecherche) || new Date();
  const formattedDate = Utilities.formatDate(d, "GMT", "yyyy-MM-dd");
  const cacheKey = "TVA_FR_" + formattedDate;
  const cache = CacheService.getScriptCache();
  
  // 1. Vérifier le cache
  let cachedData = cache.get(cacheKey);
  let rates = null;

  if (cachedData) {
    rates = JSON.parse(cachedData);
  } else {
    // 2. Appel à l'API (vatlookup.eu)
    try {
      const url = `https://api.vatlookup.eu/rates/fr/${formattedDate}`;
      const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      if (response.getResponseCode() === 200) {
        const json = JSON.parse(response.getContentText());
        if (json && json.rates) {
          rates = json.rates;
          cache.put(cacheKey, JSON.stringify(rates), CONFIG.CACHE_TTL);
        }
      }
    } catch (e) {
      console.error("Erreur API TVA: " + e.message);
    }
  }

  // 3. Extraction du taux ou Fallback local
  if (rates) {
    const mapping = {
      "STANDARD": "Standard",
      "REDUIT": "Reduced",
      "INTERMEDIAIRE": "Reduced",
      "RESTAURATION": "Reduced",
      "PARTICULIER": "Super Reduced",
      "PRESSE": "Super Reduced"
    };
    const targetName = mapping[categorie] || "Standard";
    const match = rates.find(r => r.name === targetName);
    
    // Si on trouve un match dans l'API, on l'utilise (en prenant le premier taux du tableau)
    if (match && match.rates && match.rates.length > 0) {
      // Cas particulier : si catégorie INTERMEDIAIRE ou RESTAURATION, on cherche souvent le taux de 10%
      // L'API peut renvoyer [5.5, 10] dans 'Reduced'. On cherche le plus proche de la logique FR.
      if ((categorie === "INTERMEDIAIRE" || categorie === "RESTAURATION") && match.rates.includes(10)) {
        return 0.10;
      }
      return match.rates[0] / 100;
    }
  }

  // Fallback sur le référentiel local si l'API échoue ou ne trouve rien de probant
  const cat = categorie.toUpperCase();
  switch (cat) {
    case "STANDARD": return 0.20;
    case "INTERMEDIAIRE": 
    case "RESTAURATION": return 0.10;
    case "REDUIT": 
    case "LIVRE": return 0.055;
    case "PARTICULIER": 
    case "PRESSE": return 0.021;
    default: return 0.20;
  }
}

/**
 * Ventile un montant TTC selon une catégorie et une date (optionnelle).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montantTTC Le montant TTC ou plage.
 * @param {string} categorie Catégorie (STANDARD, REDUIT, INTERMEDIAIRE, RESTAURATION, PARTICULIER, PRESSE, EXONERE) ou taux numérique (ex: 0.20).
 * @param {string} [retour="TVA"] Type de résultat souhaité : "TVA" (montant de la taxe), "HT" (montant hors taxe) ou "TOUT" (affiche HT et TVA sur deux colonnes).
 * @param {Date|string} [dateFacture] Date pour recherche historique du taux (optionnel, utilise la date du jour par défaut).
 * @return {number|Array<Array<any>>} Le montant calculé ou tableau de résultats.
 * @customfunction
 *
 *   =VENTILATION_TVA(120; "STANDARD")
 *   =VENTILATION_TVA(110; "RESTAURATION"; "HT"; "2023-01-01")
 */
function VENTILATION_TVA(montantTTC, categorie, retour = "TVA", dateFacture = null) {
  const cat = String(categorie).trim().toUpperCase();
  const typeRetour = String(retour).trim().toUpperCase();
  
  // Si catégorie numérique directe (ex: "0.20")
  let tauxFixe = parseFloat(categorie);
  const useDynamic = isNaN(tauxFixe);

  // Pré-calcul du taux si pas en batch pour optimisation
  const tauxDynamique = useDynamic ? _getVatRate(cat, dateFacture) : tauxFixe;

  return BATCH_PROCESS(montantTTC, (val) => {
    const ttc = parseFloat(val);
    if (isNaN(ttc)) return "";

    if (cat === "EXONERE") {
      if (typeRetour === "HT" || typeRetour === "TOUT") return ttc;
      return 0;
    }

    const taux = tauxDynamique;
    const ht = ttc / (1 + taux);
    const tva = ttc - ht;

    if (typeRetour === "HT") return Math.round(ht * 100) / 100;
    if (typeRetour === "TOUT") return [[Math.round(ht * 100) / 100, Math.round(tva * 100) / 100]];
    
    return Math.round(tva * 100) / 100;
  });
}
