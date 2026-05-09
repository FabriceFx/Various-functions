# Various-functions (Google Sheets Library)

🇫🇷 **Boîte à outils de 78 fonctions personnalisées ("Custom Functions") pour Google Sheets.** Conçue pour répondre aux douleurs administratives des entreprises (Finance, RH, Logistique, Data, Marketing). Plus besoin d'ERP complexes pour vos tâches quotidiennes !

🇬🇧 **A toolkit of 78 custom functions for Google Sheets.** Designed to solve daily corporate administrative pains (Finance, HR, Logistics, Data, Marketing). No need for complex ERPs for your daily tasks!

---

## 📋 Contenu / Contents

| Fichier / File | Catégorie / Category | Description (FR) | Description (EN) |
|----------------|----------------------|------------------|------------------|
| [`ageExact.gs`](RH/ageExact.gs) | Dates / Dates | Calcule l'âge exact (années, mois, jours) | Calculates exact age (years, months, days) |
| [`alerteStock.gs`](Logistique/alerteStock.gs) | Logistique / Logistics | Retourne un statut de réapprovisionnement | Returns a restock status |
| [`amortissementLineaire.gs`](Finance/amortissementLineaire.gs) | Finance / Finance | Calcule l'annuité d'amortissement prorata temporis | Calculates linear depreciation prorata temporis |
| [`analyseSEO.gs`](Marketing_Vente/analyseSEO.gs) | Marketing / Marketing | Densité, lisibilité Flesch et structure GEO | Density, Flesch index and GEO structure |
| [`analyseSentiment.gs`](Marketing_Vente/analyseSentiment.gs) | IA / AI | Évalue la tonalité (Positif/Négatif) d'un texte | Evaluates text sentiment (Positive/Negative) |
| [`anciennetePro.gs`](RH/anciennetePro.gs) | RH / HR | Retourne l'ancienneté sous forme textuelle | Returns professional tenure as text |
| [`arrondiComptable.gs`](Finance/arrondiComptable.gs) | Finance / Finance | Arrondi bancaire (au pair le plus proche) | Banker's rounding (round half to even) |
| [`auditWorkspace.gs`](Data_IT/auditWorkspace.gs) | IT Admin / Sec | Audit permissions Drive et santé utilisateur | Drive permissions and user health audit |
| [`calculAgios.gs`](Finance/calculAgios.gs) | Finance / Finance | Calcule le coût d'un découvert ou retard de paiement | Calculates overdraft or late payment costs |
| [`calculVolumetrie.gs`](Logistique/calculVolumetrie.gs) | Logistique / Logistics | Calcule le volume ou poids volumétrique | Calculates volume or volumetric weight |
| [`capitaliser.gs`](Divers/capitaliser.gs) | Texte / Text | Capitalise les mots en gérant les particules (de, du, le...) | Capitalizes words handling French particles |
| [`censureMots.gs`](Divers/censureMots.gs) | IA / AI | Censure les mots indésirables ou vulgaires par des *** | Censors unwanted or vulgar words with *** |
| [`cleanHTML.gs`](Data_IT/cleanHTML.gs) | Web / Web | Nettoie les balises HTML d'un bloc de texte | Cleans HTML tags from a text block |
| [`cleanLinkedinURL.gs`](Marketing_Vente/cleanLinkedinURL.gs) | Marketing / Marketing | Nettoie les URLs LinkedIn du tracking | Cleans tracking from LinkedIn URLs |
| [`cleEAN13.gs`](Logistique/cleEAN13.gs) | Retail / Retail | Calcule la clé de contrôle d'un code-barres | Calculates the check digit of a barcode |
| [`co2Transport.gs`](Logistique/co2Transport.gs) | RSE / CSR | CO2 trajet (km) et vol (codes IATA) | Trip CO2 (km) and flight (IATA codes) |
| [`constructeurUTM.gs`](Marketing_Vente/constructeurUTM.gs) | Marketing / Marketing | Génère proprement une URL taguée UTM | Generates a clean UTM tagged URL |
| [`couleurCellule.gs`](Divers/couleurCellule.gs) | Utilitaires / Utilities | Retourne le code HEX de la couleur de fond d'une cellule | Returns the HEX background color of a cell |
| [`coutEmployeur.gs`](RH/coutEmployeur.gs) | RH / HR | Estime le coût total employeur (Super Brut) à partir du salaire brut | Estimates total employer cost from gross salary |
| [`deadlineStatus.gs`](Divers/deadlineStatus.gs) | Projet / Project | Statut d'échéance basé sur les jours ouvrés restants | Deadline status based on remaining business days |
| [`debutFinMois.gs`](Divers/debutFinMois.gs) | Dates / Dates | Premier et dernier jour du mois d'une date | First and last day of the month for a date |
| [`decodeSafeUrl.gs`](Data_IT/decodeSafeUrl.gs) | IT/Sec / IT/Sec | Nettoie les liens de sécurité (SafeLinks, Proofpoint) | Cleans security links (SafeLinks, Proofpoint) |
| [`detectOutlier.gs`](Data_IT/detectOutlier.gs) | Stats / Stats | Détecte les anomalies (Z-Score) dans une plage de valeurs | Detects outliers (Z-Score) in a range of values |
| [`detectPII.gs`](Data_IT/detectPII.gs) | Data Sec / Data Sec | Détecte la présence de données personnelles sensibles | Detects the presence of sensitive personal data (PII) |
| [`entropyScore.gs`](Data_IT/entropyScore.gs) | Data Sec / Data Sec | Calcule le score d'entropie (complexité) d'un mot de passe | Calculates the entropy score (complexity) of a password |
| [`estimationBrutNet.gs`](RH/estimationBrutNet.gs) | RH / HR | Convertisseur indicatif Brut/Net selon le statut (FR) | Indicative Gross/Net salary converter (FR) |
| [`estimerLecture.gs`](Marketing_Vente/estimerLecture.gs) | Marketing / Marketing | Calcule le temps de lecture estimé d'un texte | Calculates estimated reading time of a text |
| [`estimerLivraison.gs`](Logistique/estimerLivraison.gs) | Logistique / Logistics | Estime la date de livraison selon le code postal | Estimates delivery date based on postal code |
| [`extractTitleTag.gs`](Marketing_Vente/extractTitleTag.gs) | Web / Web | Extrait le <title> d'une URL (SEO Bot + Bypass Cache) | Extracts <title> from URL (SEO Bot + Bypass Cache) |
| [`extraireDomaine.gs`](Divers/extraireDomaine.gs) | Utilitaires / Utilities | Extrait le domaine principal d'une URL | Extracts the main domain from a URL |
| [`extraireJoursFeries.gs`](Divers/extraireJoursFeries.gs) | Dates / Dates | Liste les jours fériés français (fixes et mobiles) | Lists French public holidays (fixed and mobile) |
| [`extraireInitiales.gs`](Divers/extraireInitiales.gs) | Texte / Text | Extrait les initiales d'un nom ("Jean-Pierre" → "JP") | Extracts initials from a name |
| [`extraireJSON.gs`](Data_IT/extraireJSON.gs) | Data / Data | Extrait une valeur d'un JSON via notation pointée | Extracts a value from JSON via dot notation |
| [`extraireTel.gs`](Marketing_Vente/extraireTel.gs) | Vente / Sales | Isole et normalise un numéro de tel français | Isolates and normalizes a French phone number |
| [`finPeriodeEssai.gs`](RH/finPeriodeEssai.gs) | Compliance / Compliance | Calcule la date exacte de fin de période d'essai (FR) | Calculates exact end date of probation period (FR) |
| [`formuleWilson.gs`](Logistique/formuleWilson.gs) | Logistique / Logistics | Calcule la quantité économique de commande (EOQ) | Calculates Economic Order Quantity (EOQ / Wilson) |
| [`frequenceMots.gs`](Data_IT/frequenceMots.gs) | Data / Data | Top des mots les plus fréquents d'une plage | Top most frequent words in a range |
| [`genererMotDePasse.gs`](Data_IT/genererMotDePasse.gs) | Utilitaires / Utilities | Génère un mot de passe aléatoire sécurisé | Generates a secure random password |
| [`htToTTC.gs`](Finance/htToTTC.gs) | Finance / Finance | Conversion HT ↔ TTC avec taux de TVA paramétrable | Pre-tax ↔ Post-tax conversion with custom VAT |
| [`iban.gs`](Finance/iban.gs) | Finance / Finance | Vérification et formatage d'IBAN (ISO 13616) | IBAN verification and formatting (ISO 13616) |
| [`isBusinessHour.gs`](RH/isBusinessHour.gs) | RH / HR | Vérifie si une date correspond aux horaires de bureau | Checks if a date falls within business hours |
| [`joursOuvres.gs`](Divers/joursOuvres.gs) | Dates / Dates | Jours ouvrés entre 2 dates (hors week-ends et fériés FR) | Business days between 2 dates (excl. FR holidays) |
| [`maskPII.gs`](Data_IT/maskPII.gs) | Compliance / Compliance | Anonymise les données sensibles (RGPD) | Anonymizes sensitive data (GDPR) |
| [`montantEnLettres.gs`](Finance/montantEnLettres.gs) | Finance / Finance | Convertit un nombre en toutes lettres ("mille euros") | Converts a number to words (French) |
| [`nomFichierPropre.gs`](Divers/nomFichierPropre.gs) | Utilitaires / Utilities | Nettoie une chaîne pour en faire un nom de fichier valide | Cleans a string to make it a valid filename |
| [`normaliser.gs`](Divers/normaliser.gs) | Texte / Text | Supprime accents, espaces multiples, met en majuscules | Removes accents, extra spaces, converts to uppercase |
| [`oooDrafter.gs`](Divers/oooDrafter.gs) | Productivité | Génère un message d'absence via calendrier | Calendar-based OOO message generator |
| [`parserAdresseFR.gs`](Data_IT/parserAdresseFR.gs) | Data / Data | Découpe une adresse (Num, Voie, CP, Ville) en colonnes | Splits an address into columns (Num, Street, Zip, City) |
| [`penalitesRetard.gs`](Finance/penalitesRetard.gs) | Finance / Finance | Calcule les pénalités de retard légales (B2B) selon le taux BCE | Calculates legal late payment penalties (B2B) |
| [`previsionLissage.gs`](Divers/previsionLissage.gs) | Stats / Stats | Prévoit la prochaine valeur via lissage exponentiel | Forecasts the next value via exponential smoothing |
| [`prixPsychologique.gs`](Divers/prixPsychologique.gs) | Retail / Retail | Arrondit vers le prix psychologique (ex: .99, .90) | Rounds to psychological pricing (e.g. .99, .90) |
| [`prochainFerie.gs`](Divers/prochainFerie.gs) | Dates / Dates | Retourne le prochain jour férié français | Returns the next French public holiday |
| [`projectSPI.gs`](Divers/projectSPI.gs) | Projet / Project | Calcule le Schedule Performance Index d'un projet | Calculates the Schedule Performance Index (SPI) |
| [`purgeGDPR.gs`](Data_IT/purgeGDPR.gs) | Compliance | Automatise le nettoyage des données obsolètes | Automates purging of obsolete data |
| [`qrCodeURL.gs`](Marketing_Vente/qrCodeURL.gs) | Utilitaires / Utilities | Génère l'URL d'un QR code affichable via `=IMAGE(...)` | Generates a QR code URL for `=IMAGE(...)` |
| [`qrCodeWifi.gs`](Divers/qrCodeWifi.gs) | Utilitaires / Utilities | Génère l'URL d'un QR code pour se connecter au Wi-Fi | Generates a Wi-Fi QR code URL |
| [`rechercheVFloue.gs`](Data_IT/rechercheVFloue.gs) | Data / Data | Recherche V avec tolérance aux fautes (Levenshtein) | Fuzzy VLOOKUP (Levenshtein distance) |
| [`rechercheVMulti.gs`](Data_IT/rechercheVMulti.gs) | Data / Data | Retourne toutes les correspondances d'une recherche, séparées par un caractère | Returns all VLOOKUP matches, separated by a char |
| [`regexExtraireTout.gs`](Data_IT/regexExtraireTout.gs) | Data / Data | Extrait toutes les correspondances d'une Regex | Extracts all Regex matches |
| [`scoreLead.gs`](Marketing_Vente/scoreLead.gs) | Vente / Sales | Attribue un score et une qualification à un prospect | Assigns a score and qualification to a lead |
| [`seuilRentabilite.gs`](Finance/seuilRentabilite.gs) | Finance / Finance | Calcule le point mort (Break-even point) | Calculates the Break-even point |
| [`slaStatus.gs`](Marketing_Vente/slaStatus.gs) | Vente / Sales | Statut visuel SLA selon un délai de réponse | Visual SLA status based on response time |
| [`slugify.gs`](Divers/slugify.gs) | Texte / Text | Génère un slug d'URL depuis un texte ("Café" → "cafe") | Generates a URL slug from text |
| [`soldeConges.gs`](RH/soldeConges.gs) | RH / HR | Calcule le solde de congés payés au prorata | Calculates prorated paid leave balance |
| [`textSimilarity.gs`](Divers/textSimilarity.gs) | Stats / Stats | Taux de similarité entre deux textes (%) | Similarity rate between two texts (%) |
| [`ui.gs`](Divers/ui.gs) | UX / UI | Menu, Sidebar Material 3 et Sparklines MD3 | Custom menu, MD3 Sidebar and Sparklines |
| [`ventilationTVA.gs`](Finance/ventilationTVA.gs) | Finance / Finance | Ventile TVA et HT depuis un TTC et une catégorie | Ventilates VAT and Pre-tax from Post-tax |
| [`verifCB.gs`](Data_IT/verifCB.gs) | Validation / Validation | Valide un n° de carte bancaire et détecte le réseau | Validates a credit card number and detects network |
| [`verifEmail.gs`](Data_IT/verifEmail.gs) | Validation / Validation | Vérifie le format d'une adresse email (regex robuste) | Verifies email address format (robust regex) |
| [`verifGdprRetention.gs`](Data_IT/verifGdprRetention.gs) | Compliance / Compliance | Vérifie la durée de conservation RGPD d'une donnée | Checks GDPR data retention period |
| [`verifNIR.gs`](Data_IT/verifNIR.gs) | Validation / Validation | Valide un n° de Sécurité Sociale français (clé modulo 97) | Validates a French Social Security number (NIR) |
| [`verifSIRET.gs`](Data_IT/verifSIRET.gs) | Validation / Validation | Valide un n° SIRET/SIREN français (algorithme de Luhn) | Validates a French SIRET/SIREN (Luhn algorithm) |
| [`verifTVA.gs`](Finance/verifTVA.gs) | Validation / Validation | Valide un n° de TVA intracommunautaire | Validates a European VAT number |

---

---

## 🚀 Installation (FR)

1. Ouvrez un fichier Google Sheets
2. Allez dans **Extensions** → **Apps Script**
3. Copiez-collez le contenu du fichier `.gs` souhaité
4. Cliquez sur **Enregistrer** (💾)
5. Utilisez les fonctions directement dans les cellules, ex: `=verifSIRET("12345678900000")`

> **Note :** Le runtime V8 (ES6+) doit être activé dans Apps Script (activé par défaut depuis 2020).

## 🚀 Installation (EN)

1. Open a Google Sheets file
2. Go to **Extensions** → **Apps Script**
3. Copy and paste the content of the desired `.gs` file
4. Click **Save** (💾)
5. Use the functions directly in cells, e.g.: `=verifSIRET("12345678900000")`

> **Note:** The V8 runtime (ES6+) must be enabled in Apps Script (enabled by default since 2020).

---

## 🏦 Documentation détaillée / Detailed Documentation

🇫🇷 Chaque fichier contient des commentaires JSDoc détaillés avec des exemples d'utilisation et des descriptions de paramètres. La plupart des fonctions renvoient un message d'erreur clair et explicite en cas de problème (ex: `"INVALIDE — aucun numéro fourni"`).

🇬🇧 Each file contains detailed JSDoc comments with usage examples and parameter descriptions. Most functions return a clear and explicit error message in case of an issue (e.g.: `"ERROR — missing value"`).

---

## 📄 Licence / License

Ce projet est sous licence / This project is licensed under [MIT](LICENSE).

---

*Auteur / Author : [Fabrice Faucheux](https://github.com/FabriceFx)*