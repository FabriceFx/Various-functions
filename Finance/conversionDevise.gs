/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Conversion de Devises Dynamique — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-10
 *  Licence : MIT
 *
 *  Description :
 *    Convertit un montant d'une devise à une autre en interrogeant
 *    l'API Frankfurter (données BCE). Supporte les taux historiques.
 *
 *  Fonctions exposées :
 *    • CONVERSION_DEVISE(montant, de, vers, [date])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Récupère le taux de change entre deux devises via API avec cache.
 * @private
 */
function _getExchangeRate(from, to, date) {
  const d = _parseDate(date) || new Date();
  const formattedDate = Utilities.formatDate(d, "GMT", "yyyy-MM-dd");
  const cacheKey = `FX_${from}_${to}_${formattedDate}`.toUpperCase();
  const cache = CacheService.getScriptCache();
  
  const cached = cache.get(cacheKey);
  if (cached) return parseFloat(cached);

  const url = `https://api.frankfurter.app/${formattedDate}?from=${from}&to=${to}`;
  
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() === 200) {
      const json = JSON.parse(response.getContentText());
      const rate = json.rates[to.toUpperCase()];
      if (rate) {
        cache.put(cacheKey, rate.toString(), CONFIG.CACHE_TTL);
        return rate;
      }
    }
  } catch (e) {
    console.error("Erreur API Change: " + e.message);
  }
  return null;
}

/**
 * Convertit un montant entre deux devises.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montant Le montant à convertir ou plage.
 * @param {string} de Code devise de départ (ex: "USD").
 * @param {string} vers Code devise d'arrivée (ex: "EUR").
 * @param {Date|string} [date] Date du taux (optionnel, utilise aujourd'hui par défaut).
 * @return {number|Array<Array<any>>} Le montant converti ou tableau de résultats.
 * @customfunction
 *
 *   =CONVERSION_DEVISE(100; "USD"; "EUR")
 *   =CONVERSION_DEVISE(A2:A100; "GBP"; "EUR"; "2024-01-01")
 */
function CONVERSION_DEVISE(montant, de, vers, date = null) {
  const from = String(de).trim().toUpperCase();
  const to = String(vers).trim().toUpperCase();
  
  if (from === to) return BATCH_PROCESS(montant, (val) => val);

  // Pré-chargement du taux pour optimisation si pas en batch
  const rate = _getExchangeRate(from, to, date);
  if (rate === null) return "Erreur: Taux indisponible";

  return BATCH_PROCESS(montant, (val) => {
    const m = parseFloat(val);
    if (isNaN(m)) return "";
    
    const result = m * rate;
    
    // Arrondi selon la devise (souvent 2 décimales)
    return Math.round(result * 100) / 100;
  });
}
