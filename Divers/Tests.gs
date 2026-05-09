/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Tests Unitaires — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Description :
 *    Valide les fonctions critiques de la bibliothèque avant déploiement.
 *    Peut être exécuté manuellement depuis l'éditeur de script.
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Lance la suite de tests.
 */
function RUN_ALL_TESTS() {
  const tests = new TestSuite();

  // Test _addMonths (Gestion RH cruciale)
  tests.it("doit ajouter des mois correctement (cas fin de mois)", () => {
    const d = new Date(2024, 0, 31); // 31 Janvier
    const res = UTIL.addMonths(d, 1);
    return res.getMonth() === 1 && res.getDate() === 29; // 29 Fév (bissextile)
  });

  // Test _parseDate (Gestion Date Sheets)
  tests.it("doit parser correctement un nombre sériel Sheets", () => {
    const res = _parseDate(45292); // 1er Janvier 2024
    return res.getFullYear() === 2024 && res.getMonth() === 0 && res.getDate() === 1;
  });

  // Test MASK_PII
  tests.it("doit masquer correctement un email", () => {
    const res = MASK_PII("fabrice@example.com");
    return res === "f****@example.com";
  });

  // Test SEO_LISIBILITE_FLESCH
  tests.it("doit calculer un score de lisibilité cohérent", () => {
    const res = SEO_LISIBILITE_FLESCH("Le chat mange la souris.");
    return res > 100;
  });

  // Test CO2_FLIGHT_ESTIMATOR (CDG -> JFK ~ 5800km)
  tests.it("doit estimer le CO2 d'un vol long-courrier", () => {
    const res = CO2_FLIGHT_ESTIMATOR("CDG", "JFK");
    return typeof res === "number" && res > 1000; // ~1090 kg
  });

  // Test VERIF_IBAN
  tests.it("doit valider un IBAN français correct", () => {
    const res = VERIF_IBAN("FR76 3000 6000 0112 3456 7890 189");
    return String(res) === "VALIDE";
  });

  // Test VERIF_NIR (NIR fictif valide pour le calcul de clé)
  tests.it("doit valider un NIR (n° sécu) correct", () => {
    const res = VERIF_NIR("1 85 01 78 006 084 27");
    return String(res) === "VALIDE";
  });

  // Test GEO_STRUCTURE_CHECK
  tests.it("doit détecter les balises H1", () => {
    const html = "<html><h1>Titre</h1><p>Texte</p></html>";
    const res = GEO_STRUCTURE_CHECK(html);
    return res.includes("H1: 1");
  });

  // Test UI_PROGRESS_SPARKLINE
  tests.it("doit générer une formule Sparkline correcte", () => {
    const res = UI_PROGRESS_SPARKLINE(50, 100, "#FF0000");
    return res.includes("SPARKLINE") && res.includes("#FF0000");
  });

  // Test PROCHAIN_FERIE avec format français
  tests.it("doit parser correctement une date FR texte pour PROCHAIN_FERIE", () => {
    const res = PROCHAIN_FERIE("06/01/2026");
    return res instanceof Date && res.getFullYear() === 2026 && res.getMonth() === 3 && res.getDate() === 6; // Lundi de Pâques 2026 = 6 avril
  });

  // Résumé
  tests.summary();
}

/**
 * Mini-framework de test interne.
 */
class TestSuite {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.results = [];
  }

  it(description, fn) {
    try {
      const result = fn();
      if (result === true) {
        this.passed++;
        this.results.push(`✅ PASS : ${description}`);
      } else {
        this.failed++;
        this.results.push(`❌ FAIL : ${description} (retourne ${result})`);
      }
    } catch (e) {
      this.failed++;
      this.results.push(`❌ FAIL : ${description} (Erreur: ${e.message})`);
    }
  }

  summary() {
    const log = `--- RÉSULTATS DES TESTS ---\n` +
                this.results.join('\n') +
                `\n---------------------------\n` +
                `TOTAL : ${this.passed + this.failed} | SUCCÈS : ${this.passed} | ÉCHECS : ${this.failed}`;
    Logger.log(log);
    try {
      if (typeof SpreadsheetApp !== 'undefined') {
        SpreadsheetApp.getUi().alert('Tests Terminés', log, SpreadsheetApp.getUi().ButtonSet.OK);
      }
    } catch (e) {
      // Ignoré si lancé depuis l'éditeur sans UI
    }
  }
}
