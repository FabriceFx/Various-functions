# Various-functions

🇫🇷 Diverses fonctions pratiques pour Google Sheets  
🇬🇧 Various handy features for Google Sheets

---

## 📋 Contenu / Contents

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| [`ageExact.gs`](ageExact.gs) | Dates | Calcule l'âge exact (années, mois, jours) |
| [`alerteStock.gs`](alerteStock.gs) | Logistique | Retourne un statut de réapprovisionnement |
| [`amortissementLineaire.gs`](amortissementLineaire.gs) | Finance | Calcule l'annuité d'amortissement prorata temporis |
| [`analyseSentiment.gs`](analyseSentiment.gs) | IA | Évalue la tonalité (Positif/Négatif) d'un texte |
| [`anciennetePro.gs`](anciennetePro.gs) | RH | Retourne l'ancienneté sous forme textuelle |
| [`arrondiComptable.gs`](arrondiComptable.gs) | Finance | Arrondi bancaire (au pair le plus proche) |
| [`calculAgios.gs`](calculAgios.gs) | Finance | Calcule le coût d'un découvert ou retard de paiement |
| [`calculVolumetrie.gs`](calculVolumetrie.gs) | Logistique | Calcule le volume ou poids volumétrique |
| [`capitaliser.gs`](capitaliser.gs) | Texte | Capitalise les mots en gérant les particules (de, du, le...) |
| [`censureMots.gs`](censureMots.gs) | IA | Censure les mots indésirables ou vulgaires par des *** |
| [`cleanHTML.gs`](cleanHTML.gs) | Web | Nettoie les balises HTML d'un bloc de texte |
| [`cleanLinkedinURL.gs`](cleanLinkedinURL.gs) | Marketing | Nettoie les URLs LinkedIn du tracking |
| [`cleEAN13.gs`](cleEAN13.gs) | Retail | Calcule la clé de contrôle d'un code-barres |
| [`co2Transport.gs`](co2Transport.gs) | RSE | Calcule l'empreinte carbone d'un trajet (kgCO2e) |
| [`constructeurUTM.gs`](constructeurUTM.gs) | Marketing | Génère proprement une URL taguée UTM |
| [`couleurCellule.gs`](couleurCellule.gs) | Utilitaires | Retourne le code HEX de la couleur de fond d'une cellule |
| [`coutEmployeur.gs`](coutEmployeur.gs) | RH | Estime le coût total employeur (Super Brut) à partir du salaire brut |
| [`deadlineStatus.gs`](deadlineStatus.gs) | Projet | Statut d'échéance basé sur les jours ouvrés restants |
| [`debutFinMois.gs`](debutFinMois.gs) | Dates | Premier et dernier jour du mois d'une date |
| [`decodeSafeUrl.gs`](decodeSafeUrl.gs) | IT/Sec | Nettoie les liens de sécurité (SafeLinks, Proofpoint) |
| [`detectOutlier.gs`](detectOutlier.gs) | Stats | Détecte les anomalies (Z-Score) dans une plage de valeurs |
| [`detectPII.gs`](detectPII.gs) | Data Sec | Détecte la présence de données personnelles sensibles |
| [`entropyScore.gs`](entropyScore.gs) | Data Sec | Calcule le score d'entropie (complexité) d'un mot de passe |
| [`estimationBrutNet.gs`](estimationBrutNet.gs) | RH | Convertisseur indicatif Brut/Net selon le statut (FR) |
| [`estimerLecture.gs`](estimerLecture.gs) | Marketing | Calcule le temps de lecture estimé d'un texte |
| [`estimerLivraison.gs`](estimerLivraison.gs) | Logistique | Estime la date de livraison selon le code postal |
| [`extractTitleTag.gs`](extractTitleTag.gs) | Web | Extrait le <title> d'une URL (Scraping SEO) |
| [`extraireDomaine.gs`](extraireDomaine.gs) | Utilitaires | Extrait le domaine principal d'une URL |
| [`extraireInitiales.gs`](extraireInitiales.gs) | Texte | Extrait les initiales d'un nom ("Jean-Pierre" → "JP") |
| [`extraireJSON.gs`](extraireJSON.gs) | Data | Extrait une valeur d'un JSON via notation pointée |
| [`extraireTel.gs`](extraireTel.gs) | Vente | Isole et normalise un numéro de tel français |
| [`finPeriodeEssai.gs`](finPeriodeEssai.gs) | Compliance | Calcule la date exacte de fin de période d'essai (FR) |
| [`formuleWilson.gs`](formuleWilson.gs) | Logistique | Calcule la quantité économique de commande (EOQ) |
| [`frequenceMots.gs`](frequenceMots.gs) | Data | Top des mots les plus fréquents d'une plage |
| [`genererMotDePasse.gs`](genererMotDePasse.gs) | Utilitaires | Génère un mot de passe aléatoire sécurisé |
| [`htToTTC.gs`](htToTTC.gs) | Finance | Conversion HT ↔ TTC avec taux de TVA paramétrable |
| [`iban.gs`](iban.gs) | Finance | Vérification et formatage d'IBAN (ISO 13616) |
| [`isBusinessHour.gs`](isBusinessHour.gs) | RH | Vérifie si une date correspond aux horaires de bureau |
| [`joursOuvres.gs`](joursOuvres.gs) | Dates | Jours ouvrés entre 2 dates (hors week-ends et fériés FR) |
| [`montantEnLettres.gs`](montantEnLettres.gs) | Finance | Convertit un nombre en toutes lettres ("mille euros") |
| [`nomFichierPropre.gs`](nomFichierPropre.gs) | Utilitaires | Nettoie une chaîne pour en faire un nom de fichier valide |
| [`normaliser.gs`](normaliser.gs) | Texte | Supprime accents, espaces multiples, met en majuscules |
| [`parserAdresseFR.gs`](parserAdresseFR.gs) | Data | Découpe une adresse (Num, Voie, CP, Ville) en colonnes |
| [`penalitesRetard.gs`](penalitesRetard.gs) | Finance | Calcule les pénalités de retard légales (B2B) selon le taux BCE |
| [`previsionLissage.gs`](previsionLissage.gs) | Stats | Prévoit la prochaine valeur via lissage exponentiel |
| [`prixPsychologique.gs`](prixPsychologique.gs) | Retail | Arrondit vers le prix psychologique (ex: .99, .90) |
| [`prochainFerie.gs`](prochainFerie.gs) | Dates | Retourne le prochain jour férié français |
| [`projectSPI.gs`](projectSPI.gs) | Projet | Calcule le Schedule Performance Index d'un projet |
| [`qrCodeURL.gs`](qrCodeURL.gs) | Utilitaires | Génère l'URL d'un QR code affichable via `=IMAGE(...)` |
| [`qrCodeWifi.gs`](qrCodeWifi.gs) | Utilitaires | Génère l'URL d'un QR code pour se connecter au Wi-Fi |
| [`rechercheVFloue.gs`](rechercheVFloue.gs) | Data | Recherche V avec tolérance aux fautes (Levenshtein) |
| [`rechercheVMulti.gs`](rechercheVMulti.gs) | Data | Retourne toutes les correspondances d'une recherche, séparées par un caractère |
| [`regexExtraireTout.gs`](regexExtraireTout.gs) | Data | Extrait toutes les correspondances d'une Regex |
| [`scoreLead.gs`](scoreLead.gs) | Vente | Attribue un score et une qualification à un prospect |
| [`seuilRentabilite.gs`](seuilRentabilite.gs) | Finance | Calcule le point mort (Break-even point) |
| [`slaStatus.gs`](slaStatus.gs) | Vente | Statut visuel SLA selon un délai de réponse |
| [`slugify.gs`](slugify.gs) | Texte | Génère un slug d'URL depuis un texte ("Café" → "cafe") |
| [`soldeConges.gs`](soldeConges.gs) | RH | Calcule le solde de congés payés au prorata |
| [`ventilationTVA.gs`](ventilationTVA.gs) | Finance | Ventile TVA et HT depuis un TTC et une catégorie |
| [`verifCB.gs`](verifCB.gs) | Validation | Valide un n° de carte bancaire et détecte le réseau |
| [`verifEmail.gs`](verifEmail.gs) | Validation | Vérifie le format d'une adresse email (regex robuste) |
| [`verifGdprRetention.gs`](verifGdprRetention.gs) | Compliance | Vérifie la durée de conservation RGPD d'une donnée |
| [`verifNIR.gs`](verifNIR.gs) | Validation | Valide un n° de Sécurité Sociale français (clé modulo 97) |
| [`verifSIRET.gs`](verifSIRET.gs) | Validation | Valide un n° SIRET/SIREN français (algorithme de Luhn) |
| [`verifTVA.gs`](verifTVA.gs) | Validation | Valide un n° de TVA intracommunautaire |

---

## 🚀 Installation

1. Ouvrez un fichier Google Sheets
2. Allez dans **Extensions** → **Apps Script**
3. Copiez-collez le contenu du fichier `.gs` souhaité
4. Cliquez sur **Enregistrer** (💾)
5. Utilisez les fonctions directement dans les cellules, ex: `=verifSIRET("12345678900000")`

> **Note :** Le runtime V8 (ES6+) doit être activé dans Apps Script (activé par défaut depuis 2020).

---

## 🏦 Documentation détaillée

Chaque fichier contient des commentaires JSDoc détaillés avec des exemples d'utilisation et des descriptions de paramètres. 
La plupart des fonctions renvoient un message d'erreur clair et explicite en cas de problème (ex: `"INVALIDE — aucun numéro fourni"`).

---

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

---

*Auteur : [Fabrice Faucheux](https://github.com/FabriceFx)*
