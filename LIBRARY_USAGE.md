# 📚 Utilisation en tant que Bibliothèque (Library)

Ce guide explique comment transformer ce dépôt en une bibliothèque Google Apps Script réutilisable dans tous vos classeurs sans copier-coller de code.

---

## 🛠️ 1. Configuration du Projet "Source"
Dans l'éditeur Google Apps Script où se trouve votre code :

1.  **Créer un déploiement** : 
    *   Allez dans **Déployer** > **Nouveau déploiement**.
    *   Cliquez sur l'icône ⚙️ (Type de déploiement) et sélectionnez **Bibliothèque**.
    *   Saisissez une description (ex: "Version Initiale 1.0").
    *   Cliquez sur **Déployer**.
2.  **Récupérer l'ID** :
    *   Allez dans les **Paramètres du projet** (icône roue dentée à gauche).
    *   Copiez l'**ID du script** (une longue suite de caractères).

---

## 🔗 2. Connexion à un nouveau Classeur
Dans le fichier Google Sheets où vous souhaitez utiliser les fonctions :

1.  Ouvrez l'éditeur de script (**Extensions** > **Apps Script**).
2.  À gauche, cliquez sur le **+** à côté de la section **Bibliothèques**.
3.  Collez l'**ID du script** source.
4.  Cliquez sur **Rechercher**, sélectionnez la version la plus récente.
5.  Définissez un **Identifiant** court (ex: `FF`) et cliquez sur **Ajouter**.

---

## 🚀 3. Utilisation des fonctions

### A. Dans le code (.gs)
Vous pouvez appeler n'importe quelle fonction en utilisant l'identifiant choisi :
```javascript
function testerBibliotheque() {
  // Syntaxe : Identifiant.Fonction()
  const resultat = FF.verifSIRET("12345678900012");
  Logger.log(resultat);
}
```

### B. Directement dans les cellules Sheets
Google Sheets ne détecte pas automatiquement les fonctions d'une bibliothèque pour l'autocomplétion. 

**Solution recommandée** : 
Copiez le contenu du fichier **`Exports_Relais.gs`** (présent à la racine de ce dépôt) dans le script de votre classeur client. Ce fichier contient déjà tous les relais nécessaires avec leur documentation JSDoc pour activer l'aide à la saisie native dans les cellules.

Vous pourrez ainsi utiliser n'importe quelle fonction (ex: `=verifSIRET(A2)`) comme s'il s'agissait d'une fonction native de Google Sheets.

---

## 🔄 4. Mise à jour de la bibliothèque
L'avantage majeur est la maintenance centralisée :

1.  Modifiez le code dans votre projet source.
2.  Créez un **nouveau déploiement** (Version 2, 3, etc.).
3.  Dans vos classeurs clients, changez simplement le numéro de version dans la section **Bibliothèques**. Toutes vos feuilles de calcul bénéficieront instantanément de la correction ou de la nouvelle fonctionnalité.

---

## 📂 Note sur la structure en dossiers
L'organisation en dossiers (`Finance/`, `RH/`, etc.) est maintenue localement et dans l'éditeur de script (via les noms de fichiers). Lors de l'appel via la bibliothèque, **toutes les fonctions sont au premier niveau**.
*   Exemple : `FF.amortissementLineaire()` et non `FF.Finance.amortissementLineaire()`.
