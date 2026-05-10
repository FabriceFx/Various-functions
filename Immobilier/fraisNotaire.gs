/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Calcul des Frais de Notaire — Immobilier (Version Expert)
 * ────────────────────────────────────────────────────────────────────────────
 *  Refonte basée sur les standards notariaux et fiscaux 2025/2026.
 *  Architecture modulaire et maintenance centralisée.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** @private Constantes réglementaires */
const NOTAIRE_DATA = {
  // Barème officiel des émoluments (Arrêté du 28 fév. 2024)
  BRACKETS: [
    { limit: 6500, rate: 0.03870 },
    { limit: 17000, rate: 0.01596 },
    { limit: 60000, rate: 0.01064 },
    { limit: Infinity, rate: 0.00799 }
  ],
  TVA_RATE: 0.20,
  CSI_RATE: 0.001,
  CSI_MIN: 15,
  COMMUNAL_TAX: 0.012,
  STATE_FEE_RATE: 0.0237, // Frais d'assiette (2,37% de la taxe départementale)
  FIXED_DEBOURS: 1200,    // Estimation moyenne augmentée pour plus de réalisme
  
  // Taux DMTO par département (3.8%, 4.5% ou 5.0%)
  // Par défaut 4.5%, on ne liste que les exceptions
  DMTO_EXCEPTIONS: {
    "36": 0.038, // Indre
    "56": 0.038, // Morbihan
    "976": 0.038, // Mayotte
    // Départements passés à 5% (Loi de Finances 2025 - Liste indicative)
    "75": 0.050, "33": 0.050, "13": 0.050, "06": 0.050, "31": 0.050, "44": 0.050
  }
};

/**
 * Calcule les frais de notaire pour une transaction immobilière.
 * Version Expert avec cascade fiscale et émoluments réglementés.
 *
 * @param {number|Array<Array<number>>} prixAchat Le prix de vente net vendeur.
 * @param {string} [typeBien="ANCIEN"] "ANCIEN" ou "NEUF".
 * @param {string|number} [departement="75"] Code du département (ex: "36", "75").
 * @return {number|Array<Array<number>>} Le montant total estimé des frais.
 * @customfunction
 */
function FRAIS_NOTAIRE(prixAchat, typeBien = "ANCIEN", departement = "75") {
  const type = String(typeBien).trim().toUpperCase();
  const depCode = String(departement).trim().padStart(2, '0');

  return BATCH_PROCESS(prixAchat, (prix) => {
    // Validation et Garde-fous
    const p = parseFloat(prix);
    if (isNaN(p) || p <= 0) return 0;

    const dmto = _calcDMTO(p, type, depCode);
    const emols = _calcEmoluments(p);
    const csi = Math.max(NOTAIRE_DATA.CSI_MIN, p * NOTAIRE_DATA.CSI_RATE);
    
    // Somme totale : Taxes + Émoluments TTC + CSI + Débours
    return Math.round(dmto + (emols * (1 + NOTAIRE_DATA.TVA_RATE)) + csi + NOTAIRE_DATA.FIXED_DEBOURS);
  });
}

/**
 * Calcule les Droits de Mutation (DMTO) avec cascade fiscale stricte.
 * @private
 */
function _calcDMTO(prix, type, depCode) {
  if (type === "NEUF") {
    // Taxe de publicité foncière pour le neuf
    return prix * 0.00715;
  }

  // 1. Détermination du taux départemental
  const tauxDep = NOTAIRE_DATA.DMTO_EXCEPTIONS[depCode] || 0.045;
  
  // 2. Cascade fiscale
  const taxeDep = prix * tauxDep;
  const taxeCommune = prix * NOTAIRE_DATA.COMMUNAL_TAX;
  const fraisAssiette = taxeDep * NOTAIRE_DATA.STATE_FEE_RATE; // 2,37% de la taxe dep uniquement

  return taxeDep + taxeCommune + fraisAssiette;
}

/**
 * Calcule les émoluments proportionnels selon le barème dégressif.
 * @private
 */
function _calcEmoluments(prix) {
  let totalHT = 0;
  let floor = 0;

  for (const bracket of NOTAIRE_DATA.BRACKETS) {
    if (prix > floor) {
      const chunk = Math.min(prix, bracket.limit) - floor;
      totalHT += chunk * bracket.rate;
      floor = bracket.limit;
    } else {
      break;
    }
  }

  // Plafonnement réglementaire : Les émoluments ne peuvent excéder 10% de la valeur du bien
  // (Loi Macron, surtout pour les petites transactions / caves / parkings)
  return Math.min(totalHT, prix * 0.10);
}

/**
 * Utilitaire pour obtenir le détail des frais (pour usage interne ou rapports).
 * @param {number} prixAchat
 * @param {string} typeBien
 * @param {string} departement
 * @return {Object} Objet détaillé des frais
 */
function DETAIL_FRAIS_NOTAIRE(prixAchat, typeBien = "ANCIEN", departement = "75") {
  const p = parseFloat(prixAchat);
  if (isNaN(p) || p <= 0) return null;
  
  const dep = String(departement).trim().padStart(2, '0');
  const type = typeBien.toUpperCase();
  
  const taxes = _calcDMTO(p, type, dep);
  const emolsHT = _calcEmoluments(p);
  const csi = Math.max(NOTAIRE_DATA.CSI_MIN, p * NOTAIRE_DATA.CSI_RATE);
  
  return {
    prix_net: p,
    droits_mutation: Math.round(taxes),
    emoluments_ht: Number(emolsHT.toFixed(2)),
    tva: Number((emolsHT * 0.2).toFixed(2)),
    csi: Math.round(csi),
    debours: NOTAIRE_DATA.FIXED_DEBOURS,
    total: Math.round(taxes + (emolsHT * 1.2) + csi + NOTAIRE_DATA.FIXED_DEBOURS)
  };
}
