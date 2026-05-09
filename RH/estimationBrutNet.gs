/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Estimation Brut/Net (France) — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Convertit rapidement un salaire Brut en Net (ou Net en Brut) 
 *    en appliquant des taux de charges moyens selon le statut (FR).
 *    /!\ À titre indicatif, ne remplace pas un logiciel de paie.
 *
 *  Fonctions exposées :
 *    • ESTIMATION_BRUT_NET(montant, statut, [sens])
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Estime le salaire Brut/Net.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montant Le salaire ou une plage de cellules.
 * @param {string} statut "Cadre", "Non-Cadre", "Fonctionnaire", "Stage", "Alternance".
 * @param {string} [sens="B2N"] "B2N" (Brut vers Net) ou "N2B" (Net vers Brut).
 * @param {number} [tauxPersonnalise] Taux de charges forcé (ex: 0.22 pour 22%).
 * @return {number|Array<Array<number>>}           Le salaire estimé ou tableau de résultats.
 * @customfunction
 *
 *   =ESTIMATION_BRUT_NET(3000; "Cadre"; "B2N")
 *   =ESTIMATION_BRUT_NET(A2:A50; "Non-Cadre")
 */
function ESTIMATION_BRUT_NET(montant, statut, sens = "B2N", tauxPersonnalise) {
  return BATCH_PROCESS(montant, (val) => {
    const m = parseFloat(String(val).replace(",", "."));
    if (isNaN(m) || m <= 0) return 0;

    let tauxCharges = 0;

    if (tauxPersonnalise != null && !isNaN(parseFloat(tauxPersonnalise))) {
      tauxCharges = parseFloat(tauxPersonnalise);
    } else {
      const cat = String(statut).trim().toLowerCase();
      if (cat.includes("non")) tauxCharges = CONFIG.SALAIRE_TAUX.non_cadre;
      else if (cat.includes("cadre")) tauxCharges = CONFIG.SALAIRE_TAUX.cadre;
      else if (cat.includes("fonction") || cat.includes("public")) tauxCharges = CONFIG.SALAIRE_TAUX.fonctionnaire;
      else if (cat.includes("stage") || cat.includes("stagiaire")) tauxCharges = CONFIG.SALAIRE_TAUX.stage;
      else if (cat.includes("alternan") || cat.includes("apprenti")) tauxCharges = CONFIG.SALAIRE_TAUX.alternance;
      else tauxCharges = CONFIG.SALAIRE_TAUX.defaut;
    }

    const direction = String(sens).toUpperCase();

    if (direction === "B2N" || direction === "BRUT2NET") {
      const net = m * (1 - tauxCharges);
      return Math.round(net * 100) / 100;
    } else if (direction === "N2B" || direction === "NET2BRUT") {
      if (tauxCharges >= 1) return 0;
      const brut = m / (1 - tauxCharges);
      return Math.round(brut * 100) / 100;
    }

    return 0;
  });
}
