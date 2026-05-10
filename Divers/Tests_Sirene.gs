/**
 * Test direct de l'API Sirene (Miroir Etalab V3) pour débogage.
 * Exécutez cette fonction depuis l'éditeur de script.
 */
function TEST_DIRECT_SIRENE() {
  const id = "443061841"; // SIREN Google France
  const isSiret = id.length === 14;
  const endpoint = isSiret ? "siret" : "siren";
  
  // Utilisation de l'URL miroir
  const url = `https://entreprise.data.gouv.fr/api/sirene/v3/${endpoint}/${id}`;
  
  try {
    const response = UrlFetchApp.fetch(url, { 
      muteHttpExceptions: true,
      headers: { "User-Agent": "FF_Library_Test" }
    });
    
    const code = response.getResponseCode();
    const content = response.getContentText();
    
    Logger.log("URL Appelée : " + url);
    Logger.log("Code Réponse : " + code);
    
    if (code === 200) {
      const data = JSON.parse(content);
      const result = isSiret ? data.etablissement : data.unite_legale;
      
      if (result) {
        const nom = result.denomination_unite_legale || result.nom_raison_sociale || "Inconnu";
        Logger.log("SUCCÈS : " + nom);
        console.log("Nom trouvé : " + nom);
      } else {
        console.warn("API VIDE : Données non trouvées dans la réponse.");
      }
    } else {
      console.error("ERREUR API : " + code + " - " + content.substring(0, 200));
    }
  } catch (e) {
    console.error("ERREUR RÉSEAU : " + e.message);
  }
}
