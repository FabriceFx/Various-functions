/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Pénalités de Retard B2B avec API BCE — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.1 (Ajout récupération auto Taux BCE via API SDMX-JSON)
 *  Date    : 2026-05-10
 *  Licence : MIT
 *
 *  Description :
 *    Calcule les pénalités de retard légales (B2B) en fonction du montant, 
 *    de la date d'échéance et du taux de la BCE (majoré de la marge légale).
 *    Si le taux de la BCE n'est pas fourni dans la formule, le script
 *    interroge automatiquement l'API officielle de la BCE.
 *
 *    Un système de cache (CacheService) est utilisé pour éviter le 
 *    ralentissement de la feuille de calcul et les requêtes abusives.
 *
 *  Fonctions exposées :
 *    • PENALITES_RETARD(montant, dateEcheance, [tauxBCE], [margeLégale])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Récupère le dernier taux de refinancement (MRO) de la BCE via leur API.
 * Utilisable directement dans une cellule Sheets.
 *
 * @return {number} Le taux en pourcentage (ex: 4.5).
 * @customfunction
 */
function TAUX_BCE() {
  const cacheKey = "TAUX_BCE_MRO";
  const cache = CacheService.getScriptCache();
  const cachedRate = cache.get(cacheKey);

  if (cachedRate != null) return parseFloat(cachedRate);

  // API SDMX-JSON de la BCE
  const url = "https://data-api.ecb.europa.eu/service/data/FM/D.U2.EUR.4F.KR.MRR_RT.LEV?lastNObservations=1&detail=dataonly&format=jsondata";

  try {
    const response = UrlFetchApp.fetch(url, { 
      muteHttpExceptions: true,
      headers: { "Accept": "application/json" }
    });

    if (response.getResponseCode() !== 200) throw new Error(`HTTP ${response.getResponseCode()}`);

    const data = JSON.parse(response.getContentText());
    
    // Extraction sécurisée du taux
    const series = data.dataSets[0].series;
    const firstSeriesKey = Object.keys(series)[0];
    const observations = series[firstSeriesKey].observations;
    const firstObsKey = Object.keys(observations)[0];
    const rate = observations[firstObsKey][0];

    const parsedRate = parseFloat(rate);
    if (isNaN(parsedRate)) throw new Error("Format de taux invalide");

    // Utilisation du TTL centralisé
    cache.put(cacheKey, parsedRate.toString(), CONFIG.CACHE_TTL);

    return parsedRate;

  } catch (e) {
    console.error("Erreur API BCE : " + e.message);
    return 4.5; // Fallback sécurisé
  }
}

/**
 * Calcule les intérêts de retard B2B (France).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montant Montant de la facture ou plage.
 * @param {Date|string} dateEcheance Date d'échéance.
 * @param {number} [tauxBCE] (Optionnel) Le taux directeur BCE (%). Si vide, interroge l'API.
 * @param {number} [marge=10] (Optionnel) La marge légale (points). 10 points par défaut.
 * @return {number|Array<Array<number>>} Le montant des pénalités ou tableau de résultats.
 * @customfunction
 *
 *   =PENALITES_RETARD(5000; "2024-01-01")
 *   =PENALITES_RETARD(A2:A100; "2024-01-01"; ; 10)
 */
function PENALITES_RETARD(montant, dateEcheance, tauxBCE, marge = 10) {
  // Résolution du taux BCE (appel API si non fourni)
  const tBCE = (tauxBCE !== undefined && tauxBCE !== "" && tauxBCE !== null) 
    ? parseFloat(tauxBCE) 
    : TAUX_BCE();

  if (isNaN(tBCE)) return "Erreur: Taux BCE invalide";

  return BATCH_PROCESS(montant, (val) => {
    if (val === "" || val == null) return "";
    
    const m = parseFloat(val);
    if (isNaN(m) || m <= 0) return 0;

    const dEcheance = _parseDate(dateEcheance);
    if (!dEcheance) return CONFIG.ERR_DATE;

    const dAujourdhui = new Date();
    const diffTime = dAujourdhui.getTime() - dEcheance.getTime();
    if (diffTime <= 0) return 0;

    const joursRetard = Math.floor(diffTime / (1000 * 3600 * 24));
    const mrg = parseFloat(marge);
    if (isNaN(mrg)) return "Erreur: Marge invalide";

    const tauxTotal = (tBCE + mrg) / 100;
    const penalites = (m * joursRetard * tauxTotal) / 365;

    return Math.round(penalites * 100) / 100;
  });
}