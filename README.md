# Various-functions

🇫🇷 Diverses fonctions pratiques pour Google Sheets  
🇬🇧 Various handy features for Google Sheets

---

## 📋 Contenu / Contents

| Fichier | Description |
|---------|-------------|
| [`iban.gs`](iban.gs) | Vérification et formatage d'IBAN (ISO 13616) |

---

## 🏦 iban.gs — Vérification & formatage d'IBAN

Fonctions personnalisées pour **Google Sheets** permettant de valider un IBAN selon la norme **ISO 13616** (algorithme Modulo 97 — ISO 7064) et de le formater en groupes de 4 caractères.

### Fonctions disponibles

#### `=verifIBAN(iban)`

Vérifie la validité d'un IBAN en 3 étapes :
1. **Format** — L'IBAN ne contient que des caractères alphanumériques
2. **Longueur** — L'IBAN a la longueur attendue pour son code pays
3. **Clé de contrôle** — Validation par l'algorithme Modulo 97 (ISO 7064)

**Retourne** un message explicite :

| Résultat | Exemple |
|----------|---------|
| `VALIDE` | L'IBAN est correct |
| `INVALIDE — aucun IBAN fourni` | Cellule vide |
| `INVALIDE — format incorrect (…)` | Ne commence pas par 2 lettres + 2 chiffres |
| `INVALIDE — code pays « XX » non reconnu` | Code pays absent de la table |
| `INVALIDE — longueur incorrecte (25 car. au lieu de 27 pour FR)` | Trop court ou trop long |
| `INVALIDE — clé de contrôle incorrecte` | Échec du Modulo 97 |

**Exemples :**

```
=verifIBAN("FR76 3000 6000 0112 3456 7890 189")   → "VALIDE"
=verifIBAN("FR76 3000 6000 0112 3456 7890 188")   → "INVALIDE — clé de contrôle incorrecte"
=verifIBAN("XX12 3456")                            → "INVALIDE — code pays « XX » non reconnu"
```

#### `=formatIBAN(iban)`

Formate un IBAN en groupes de 4 caractères séparés par des espaces.

```
=formatIBAN("FR7630006000011234567890189")
→ "FR76 3000 6000 0112 3456 7890 189"
```

### 🌍 Pays supportés (70+)

AD, AE, AL, AT, AZ, BA, BE, BG, BH, BI, BR, BY, CH, CR, CY, CZ, DE, DJ, DK, DO, EE, EG, ES, FI, FK, FO, FR, GB, GE, GI, GL, GR, GT, HR, HU, IE, IL, IQ, IS, IT, JO, KW, KZ, LB, LC, LI, LT, LU, LV, LY, MC, MD, ME, MK, MN, MR, MT, MU, NI, NL, NO, PK, PL, PS, PT, QA, RO, RS, RU, SA, SC, SD, SE, SI, SK, SM, SO, ST, SV, TL, TN, TR, UA, VA, VG, XK

---

## 🚀 Installation

1. Ouvrir un Google Sheets
2. **Extensions** → **Apps Script**
3. Copier-coller le contenu du fichier `.gs` souhaité
4. **Enregistrer** (💾)
5. Utiliser les fonctions directement dans les cellules

> **Note :** Le runtime V8 (ES6+) doit être activé dans Apps Script (activé par défaut depuis 2020).

---

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

---

*Auteur : [Fabrice Faucheux](https://github.com/FabriceFx)*
