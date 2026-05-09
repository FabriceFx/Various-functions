/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Tests Unitaires — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Description :
 *    Valide les fonctions critiques de la bibliothèque avant déploiement.
 *    Peut être exécuté manuellement depuis l'éditeur de script.
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Lance la suite de tests.
 */
function RUN_ALL_TESTS() {
  const tests = new TestSuite();

  // Test _addMonths (Gestion RH cruciale)
  tests.it("doit ajouter des mois correctement (cas fin de mois)", () => {
    const d = new Date(2024, 0, 31); // 31 Janvier
    const res = _addMonths(d, 1);
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
    if (typeof SpreadsheetApp !== 'undefined') {
      SpreadsheetApp.getUi().alert('Tests Terminés', log, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  }
}
