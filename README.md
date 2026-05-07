# Various-functions

🇫🇷 Diverses fonctions pratiques pour Google Sheets  
🇬🇧 Various handy features for Google Sheets

---

## 📋 Contenu / Contents

| Fichier | Catégorie | Description |
|---------|-----------|-------------|
| [`iban.gs`](iban.gs) | Finance | Vérification et formatage d'IBAN (ISO 13616) |
| [`verifSIRET.gs`](verifSIRET.gs) | Validation | Valide un n° SIRET/SIREN français (algorithme de Luhn) |
| [`verifEmail.gs`](verifEmail.gs) | Validation | Vérifie le format d'une adresse email (regex robuste) |
| [`verifNIR.gs`](verifNIR.gs) | Validation | Valide un n° de Sécurité Sociale français (clé modulo 97) |
| [`verifCB.gs`](verifCB.gs) | Validation | Valide un n° de carte bancaire et détecte le réseau |
| [`verifTVA.gs`](verifTVA.gs) | Validation | Valide un n° de TVA intracommunautaire |
| [`normaliser.gs`](normaliser.gs) | Texte | Supprime accents, espaces multiples, met en majuscules |
| [`extraireInitiales.gs`](extraireInitiales.gs) | Texte | Extrait les initiales d'un nom ("Jean-Pierre" → "JP") |
| [`slugify.gs`](slugify.gs) | Texte | Génère un slug d'URL depuis un texte ("Café" → "cafe") |
| [`capitaliser.gs`](capitaliser.gs) | Texte | Capitalise les mots en gérant les particules (de, du, le...) |
| [`joursOuvres.gs`](joursOuvres.gs) | Dates | Jours ouvrés entre 2 dates (hors week-ends et fériés FR) |
| [`prochainFerie.gs`](prochainFerie.gs) | Dates | Retourne le prochain jour férié français |
| [`ageExact.gs`](ageExact.gs) | Dates | Calcule l'âge exact (années, mois, jours) |
| [`debutFinMois.gs`](debutFinMois.gs) | Dates | Premier et dernier jour du mois d'une date |
| [`montantEnLettres.gs`](montantEnLettres.gs) | Finance | Convertit un nombre en toutes lettres ("mille euros") |
| [`htToTTC.gs`](htToTTC.gs) | Finance | Conversion HT ↔ TTC avec taux de TVA paramétrable |
| [`arrondiComptable.gs`](arrondiComptable.gs) | Finance | Arrondi bancaire (au pair le plus proche) |
| [`genererMotDePasse.gs`](genererMotDePasse.gs) | Utilitaires | Génère un mot de passe aléatoire sécurisé |
| [`extraireDomaine.gs`](extraireDomaine.gs) | Utilitaires | Extrait le domaine principal d'une URL |
| [`couleurCellule.gs`](couleurCellule.gs) | Utilitaires | Retourne le code HEX de la couleur de fond d'une cellule |
| [`qrCodeURL.gs`](qrCodeURL.gs) | Utilitaires | Génère l'URL d'un QR code affichable via `=IMAGE(...)` |
| [`rechercheVFloue.gs`](rechercheVFloue.gs) | Data | Recherche V avec tolérance aux fautes (Levenshtein) |
| [`extraireJSON.gs`](extraireJSON.gs) | Data | Extrait une valeur d'un JSON via notation pointée |
| [`regexExtraireTout.gs`](regexExtraireTout.gs) | Data | Extrait toutes les correspondances d'une Regex |
| [`parserAdresseFR.gs`](parserAdresseFR.gs) | Data | Découpe une adresse (Num, Voie, CP, Ville) en colonnes |
| [`frequenceMots.gs`](frequenceMots.gs) | Data | Top des mots les plus fréquents d'une plage |
| [`soldeConges.gs`](soldeConges.gs) | RH | Calcule le solde de congés payés au prorata |
| [`anciennetePro.gs`](anciennetePro.gs) | RH | Retourne l'ancienneté sous forme textuelle |
| [`isBusinessHour.gs`](isBusinessHour.gs) | RH | Vérifie si une date correspond aux horaires de bureau |
| [`constructeurUTM.gs`](constructeurUTM.gs) | Marketing | Génère proprement une URL taguée UTM |
| [`cleanLinkedinURL.gs`](cleanLinkedinURL.gs) | Marketing | Nettoie les URLs LinkedIn du tracking |
| [`estimerLecture.gs`](estimerLecture.gs) | Marketing | Calcule le temps de lecture estimé d'un texte |
| [`scoreLead.gs`](scoreLead.gs) | Vente | Attribue un score et une qualification à un prospect |
| [`extraireTel.gs`](extraireTel.gs) | Vente | Isole et normalise un numéro de tel français |
| [`slaStatus.gs`](slaStatus.gs) | Vente | Statut visuel SLA selon un délai de réponse |
| [`calculVolumetrie.gs`](calculVolumetrie.gs) | Logistique | Calcule le volume ou poids volumétrique |
| [`estimerLivraison.gs`](estimerLivraison.gs) | Logistique | Estime la date de livraison selon le code postal |
| [`alerteStock.gs`](alerteStock.gs) | Logistique | Retourne un statut de réapprovisionnement |
| [`ventilationTVA.gs`](ventilationTVA.gs) | Finance | Ventile TVA et HT depuis un TTC et une catégorie |
| [`amortissementLineaire.gs`](amortissementLineaire.gs) | Finance | Calcule l'annuité d'amortissement prorata temporis |
| [`co2Transport.gs`](co2Transport.gs) | RSE | Calcule l'empreinte carbone d'un trajet (kgCO2e) |
| [`projectSPI.gs`](projectSPI.gs) | Projet | Calcule le Schedule Performance Index d'un projet |
| [`deadlineStatus.gs`](deadlineStatus.gs) | Projet | Statut d'échéance basé sur les jours ouvrés restants |
| [`verifGdprRetention.gs`](verifGdprRetention.gs) | Compliance | Vérifie la durée de conservation RGPD d'une donnée |
| [`finPeriodeEssai.gs`](finPeriodeEssai.gs) | Compliance | Calcule la date exacte de fin de période d'essai (FR) |
| [`detectPII.gs`](detectPII.gs) | Data Sec | Détecte la présence de données personnelles sensibles |
| [`entropyScore.gs`](entropyScore.gs) | Data Sec | Calcule le score d'entropie (complexité) d'un mot de passe |
| [`calculAgios.gs`](calculAgios.gs) | Finance | Calcule le coût d'un découvert ou retard de paiement |
| [`seuilRentabilite.gs`](seuilRentabilite.gs) | Finance | Calcule le point mort (Break-even point) |
| [`analyseSentiment.gs`](analyseSentiment.gs) | IA | Évalue la tonalité (Positif/Négatif) d'un texte |
| [`censureMots.gs`](censureMots.gs) | IA | Censure les mots indésirables ou vulgaires par des *** |
| [`detectOutlier.gs`](detectOutlier.gs) | Stats | Détecte les anomalies (Z-Score) dans une plage de valeurs |
| [`previsionLissage.gs`](previsionLissage.gs) | Stats | Prévoit la prochaine valeur via lissage exponentiel |
| [`prixPsychologique.gs`](prixPsychologique.gs) | Retail | Arrondit vers le prix psychologique (ex: .99, .90) |
| [`cleEAN13.gs`](cleEAN13.gs) | Retail | Calcule la clé de contrôle d'un code-barres |
| [`extractTitleTag.gs`](extractTitleTag.gs) | Web | Extrait le <title> d'une URL (Scraping SEO) |
| [`cleanHTML.gs`](cleanHTML.gs) | Web | Nettoie les balises HTML d'un bloc de texte |
| [`estimationBrutNet.gs`](estimationBrutNet.gs) | RH | Convertisseur indicatif Brut/Net selon le statut (FR) |

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
