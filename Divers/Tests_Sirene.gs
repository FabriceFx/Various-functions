/**
 * Test direct de l'API Sirene pour débogage.
 * Exécutez cette fonction depuis l'éditeur de script.
 */
function TEST_DIRECT_SIRENE() {
  const siren = "443061841"; // Google France
  const url = `https://recherche-entreprises.api.gouv.fr/search?q=${siren}`;
  
  try {
    const response = UrlFetchApp.fetch(url, { 
      muteHttpExceptions: true,
      headers: { "User-Agent": "FF_Library_Test" }
    });
    
    const code = response.getResponseCode();
    const content = response.getContentText();
    
    Logger.log("Code Réponse : " + code);
    Logger.log("Contenu (tronqué) : " + content.substring(0, 500));
    
    if (code === 200) {
      const data = JSON.parse(content);
      if (data.results && data.results.length > 0) {
        console.log("SUCCÈS : " + data.results[0].nom_complet);
      } else {
        console.warn("API VIDE : Aucun résultat trouvé pour ce SIREN.");
      }
    } else {
      console.error("ERREUR API : " + code);
    }
  } catch (e) {
    console.error("ERREUR RÉSEAU : " + e.message);
  }
}
