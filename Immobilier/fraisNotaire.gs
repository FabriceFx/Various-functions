/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Calcul des Frais de Notaire — Immobilier
 * ────────────────────────────────────────────────────────────────────────────
 *  Calcul détaillé des frais d'acquisition immobilière (DMTO, Émoluments, Taxes).
 *  Supporte les taux départementaux mis à jour (2025/2026).
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Calcule les frais de notaire pour une transaction immobilière.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} prixAchat Le prix de vente net vendeur.
 * @param {string} [typeBien="ANCIEN"] "ANCIEN" ou "NEUF".
 * @param {string|number} [departement="75"] Code du département (ex: "36", "75", 56).
 * @return {number|Array<Array<number>>} Le montant total estimé des frais.
 * @customfunction
 *
 *   =FRAIS_NOTAIRE(250000; "ANCIEN"; "75")
 *   =FRAIS_NOTAIRE(300000; "NEUF")
 */
function FRAIS_NOTAIRE(prixAchat, typeBien = "ANCIEN", departement = "75") {
  const type = String(typeBien).trim().toUpperCase();
  const dep = String(departement).trim().padStart(2, '0');

  return BATCH_PROCESS(prixAchat, (prix) => {
    if (prix <= 0) return 0;

    // 1. Détermination du taux départemental (DMTO)
    // Taux 2025/2026 : Standard 4.5% ou 5.0% (Majorité), Réduit 3.8%
    let tauxDep = 0.045; // Taux par défaut
    
    const DEPS_3_8 = ["36", "56"]; // Indre, Morbihan
    const DEPS_5_0 = ["75", "33", "13", "06", "31", "44", "67", "59"]; // Principaux départements passés à 5%
    
    if (DEPS_3_8.includes(dep)) tauxDep = 0.038;
    if (DEPS_5_0.includes(dep)) tauxDep = 0.050;

    // 2. Calcul des taxes (Droits de mutation)
    let taxes = 0;
    if (type === "NEUF") {
      // Pour le neuf, on ne paie que la taxe de publicité foncière (~0.715%)
      taxes = prix * 0.00715;
    } else {
      const communal = 0.012; // 1.20%
      const fraisAssiette = tauxDep * 0.0237; // 2.37% du droit départemental
      taxes = prix * (tauxDep + communal + fraisAssiette);
    }

    // 3. Calcul des émoluments (Barème dégressif HT)
    let emolumentsHT = 0;
    const tranches = [
      { max: 6500, taux: 0.03870 },
      { max: 17000, taux: 0.01596 },
      { max: 60000, taux: 0.01064 },
      { max: Infinity, taux: 0.00799 }
    ];

    let reste = prix;
    let seuilPrecedent = 0;
    for (const t of tranches) {
      if (prix > seuilPrecedent) {
        const montantTranche = Math.min(prix, t.max) - seuilPrecedent;
        emolumentsHT += montantTranche * t.taux;
        seuilPrecedent = t.max;
      }
    }
    
    const emolumentsTTC = emolumentsHT * 1.20; // + TVA 20%

    // 4. Contribution de Sécurité Immobilière (CSI)
    const csi = Math.max(15, prix * 0.001); // 0.10% (min 15€)

    // 5. Frais divers et débours (Estimation forfaitaire moyenne)
    const debours = 1000;

    return Math.round(taxes + emolumentsTTC + csi + debours);
  });
}
