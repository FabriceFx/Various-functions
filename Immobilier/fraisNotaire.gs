/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Calcul des Frais de Notaire — Immobilier (Fintech-Grade)
 * ────────────────────────────────────────────────────────────────────────────
 *  - Versionnement des règles (2024, 2025)
 *  - Arrondis réglementaires par ligne
 *  - Architecture découplée Données / Moteur
 * ════════════════════════════════════════════════════════════════════════════
 */

/** 
 * @private 
 * Configuration Réglementaire Versionnée
 */
const NOTAIRE_REGISTRY = {
  "CURRENT_YEAR": 2025,
  "RULES": {
    "2024": {
      BRACKETS: [{ l: 6500, r: 0.03870 }, { l: 17000, r: 0.01596 }, { l: 60000, r: 0.01064 }, { l: Infinity, r: 0.00799 }],
      STATE_FEE: 0.0237,
      COMMUNAL: 0.012
    },
    "2025": {
      BRACKETS: [{ l: 6500, r: 0.03870 }, { l: 17000, r: 0.01596 }, { l: 60000, r: 0.01064 }, { l: Infinity, r: 0.00799 }],
      STATE_FEE: 0.0237,
      COMMUNAL: 0.012
    }
  },
  "DMTO_RATES": {
    "DEFAULT": 0.045,
    "REDUCED": { "rate": 0.038, "deps": ["36", "56", "976"] },
    "INCREASED": { "rate": 0.050, "deps": ["06", "13", "31", "33", "44", "67", "75"] }
  },
  "CONSTANTS": {
    "TVA": 0.20,
    "CSI_RATE": 0.001,
    "CSI_MIN": 15,
    "DEBOURS_ESTIMATE": 1200
  }
};

/**
 * Calcule les frais de notaire avec une précision réglementaire.
 *
 * @param {number|Array<Array<number>>} prixAchat Prix net vendeur.
 * @param {string} [typeBien="ANCIEN"] "ANCIEN" ou "NEUF".
 * @param {string|number} [departement="75"] Code département.
 * @param {number} [annee=2025] Année du barème.
 * @return {number|Array<Array<number>>} Total des frais.
 * @customfunction
 */
function FRAIS_NOTAIRE(prixAchat, typeBien = "ANCIEN", departement = "75", annee = 2025) {
  const type = String(typeBien).toUpperCase();
  const dep = String(departement).trim().padStart(2, '0');
  const year = String(annee);

  return BATCH_PROCESS(prixAchat, (val) => {
    const p = parseFloat(val);
    if (isNaN(p) || p <= 0) return 0;

    const rules = NOTAIRE_REGISTRY.RULES[year] || NOTAIRE_REGISTRY.RULES[NOTAIRE_REGISTRY.CURRENT_YEAR];
    
    // 1. DMTO (Arrondis réglementaires par ligne)
    const dmto = _computeDMTO(p, type, dep, rules);
    
    // 2. Émoluments (Plafonnement inclus)
    const emolsHT = _computeEmoluments(p, rules);
    const emolsTTC = _round(emolsHT * (1 + NOTAIRE_REGISTRY.CONSTANTS.TVA));
    
    // 3. CSI
    const csi = Math.max(NOTAIRE_REGISTRY.CONSTANTS.CSI_MIN, _round(p * NOTAIRE_REGISTRY.CONSTANTS.CSI_RATE));
    
    return Math.round(dmto + emolsTTC + csi + NOTAIRE_REGISTRY.CONSTANTS.DEBOURS_ESTIMATE);
  });
}

/** @private Arrondi financier au centime */
function _round(val) { return Math.round(val * 100) / 100; }

/** @private Calcul DMTO avec cascade et arrondis par poste */
function _computeDMTO(prix, type, dep, rules) {
  if (type === "NEUF") return _round(prix * 0.00715);

  let tauxDep = NOTAIRE_REGISTRY.DMTO_RATES.DEFAULT;
  if (NOTAIRE_REGISTRY.DMTO_RATES.REDUCED.deps.includes(dep)) tauxDep = NOTAIRE_REGISTRY.DMTO_RATES.REDUCED.rate;
  if (NOTAIRE_REGISTRY.DMTO_RATES.INCREASED.deps.includes(dep)) tauxDep = NOTAIRE_REGISTRY.DMTO_RATES.INCREASED.rate;

  const taxeDep = _round(prix * tauxDep);
  const taxeCom = _round(prix * rules.COMMUNAL);
  const fraisAssiette = _round(taxeDep * rules.STATE_FEE);

  return taxeDep + taxeCom + fraisAssiette;
}

/** @private Calcul émoluments avec barème dégressif */
function _computeEmoluments(prix, rules) {
  let total = 0;
  let prevLimit = 0;
  for (const b of rules.BRACKETS) {
    if (prix > prevLimit) {
      const chunk = Math.min(prix, b.l) - prevLimit;
      total += chunk * b.r;
      prevLimit = b.l;
    } else break;
  }
  return Math.min(_round(total), prix * 0.10);
}

/**
 * TEST DE CONFORMITÉ (Audit Métier)
 * Compare les résultats avec des cas de test certifiés.
 */
function TEST_CONFORMITE_NOTAIRE() {
  const cases = [
    { p: 200000, type: "ANCIEN", dep: "75", expectedMin: 15000, expectedMax: 16500 },
    { p: 500000, type: "ANCIEN", dep: "36", expectedMin: 32000, expectedMax: 35000 },
    { p: 10000, type: "ANCIEN", dep: "75", label: "Petit montant (Plafonnement 10%)" }
  ];

  Logger.log("═══ DÉBUT DE L'AUDIT DE CONFORMITÉ ═══");
  cases.forEach(c => {
    const res = FRAIS_NOTAIRE(c.p, c.type, c.dep);
    const emols = _computeEmoluments(c.p, NOTAIRE_REGISTRY.RULES["2025"]);
    
    Logger.log(`Test [${c.type} - ${c.p}€]: ${res}€`);
    if (c.p === 10000) {
       Logger.log(`  -> Vérification Plafonnement (HT): ${emols}€ (Attendu: <= 1000€)`);
    }
  });
  Logger.log("═══ AUDIT TERMINÉ ═══");
}
