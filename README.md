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
