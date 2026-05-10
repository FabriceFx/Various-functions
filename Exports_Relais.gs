/**
 * ════════════════════════════════════════════════════════════════════════════
 *  FONCTIONS RELAIS (EXPORTS) — FF Library
 * ────────────────────────────────────────────────────────────────────────────
 *  Description :
 *    Copiez ce fichier dans votre script de classeur pour exposer les
 *    fonctions de la bibliothèque FF directement dans Google Sheets.
 *    Identifiant de bibliothèque requis : FF_LIB
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Convertit une chaîne de caractères en slug (format URL).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou plage à convertir.
 * @return {string|Array<Array<string>>}       Le slug généré ou tableau de résultats.
 * @customfunction
 *
 *   =SLUGIFY("Café Crème à l'Hôtel !")  → "cafe-creme-a-l-hotel"
 *   =SLUGIFY(A2:A100)
 */
function SLUGIFY(texte) {
  try {
    return FF_LIB.SLUGIFY(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SLUGIFY', 'ERROR');
    throw e;
  }
}

/**
 * Retourne le code couleur hexadécimal de l'arrière-plan d'une cellule.
 * Supporte le traitement par lot (plages de références).
 *
 * @param {string|Array<Array<string>>} referenceCellule La référence A1 ou plage.
 * @return {string|Array<Array<string>>}                  Le code hexadécimal ou tableau.
 * @customfunction
 *
 *   =COULEUR_CELLULE("A1")
 *   =COULEUR_CELLULE(B2:B10)
 */
function COULEUR_CELLULE(referenceCellule) {
  try {
    return FF_LIB.COULEUR_CELLULE(referenceCellule);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: COULEUR_CELLULE', 'ERROR');
    throw e;
  }
}

/**
 * Met en majuscule la première lettre de chaque mot, en ignorant
 * certaines particules sauf en début de phrase.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou une plage de cellules.
 * @return {string|Array<Array<string>>}       Le texte capitalisé ou tableau de résultats.
 * @customfunction
 *
 *   =CAPITALISER("jean-pierre de la fontaine")  → "Jean-Pierre de la Fontaine"
 *   =CAPITALISER(A2:A100)                       → [Tableau de résultats]
 */
function CAPITALISER(texte) {
  try {
    return FF_LIB.CAPITALISER(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CAPITALISER', 'ERROR');
    throw e;
  }
}

/**
 * Convertit un prix brut en prix psychologique.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} prixCalcule Le prix ou plage.
 * @param {number} [terminaison=99] La terminaison souhaitée en centimes.
 * @return {number|Array<Array<number>>}            Le prix formaté ou tableau de résultats.
 * @customfunction
 *
 *   =PRIX_PSYCHOLOGIQUE(14.12; 99) → 14.99
 *   =PRIX_PSYCHOLOGIQUE(A2:A100; 95)
 */
function PRIX_PSYCHOLOGIQUE(prixCalcule, terminaison = 99) {
  try {
    return FF_LIB.PRIX_PSYCHOLOGIQUE(prixCalcule, terminaison);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: PRIX_PSYCHOLOGIQUE', 'ERROR');
    throw e;
  }
}

/**
 * Retourne le premier jour du mois correspondant à la date fournie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} date Date de référence ou plage.
 * @return {Date|string|Array<Array<Date|string>>}      Date du 1er jour ou tableau de résultats.
 * @customfunction
 *
 *   =DEBUT_MOIS("2026-05-15")  → 01/05/2026
 *   =DEBUT_MOIS(A2:A100)
 */
function DEBUT_MOIS(date) {
  try {
    return FF_LIB.DEBUT_MOIS(date);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DEBUT_MOIS', 'ERROR');
    throw e;
  }
}

/**
 * Retourne le dernier jour du mois correspondant à la date fournie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} date Date de référence ou plage.
 * @return {Date|string|Array<Array<Date|string>>}      Date du dernier jour ou tableau de résultats.
 * @customfunction
 *
 *   =FIN_MOIS("2026-02-10")  → 28/02/2026
 *   =FIN_MOIS(A2:A100)
 */
function FIN_MOIS(date) {
  try {
    return FF_LIB.FIN_MOIS(date);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: FIN_MOIS', 'ERROR');
    throw e;
  }
}

/**
 * Retourne le nombre de jours dans le mois de la date fournie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} date Date de référence ou plage.
 * @return {number|string|Array<Array<number|string>>}   Nombre de jours ou tableau de résultats.
 * @customfunction
 *
 *   =NB_JOURS_MOIS("2026-02-01")  → 28
 *   =NB_JOURS_MOIS(A2:A100)
 */
function NB_JOURS_MOIS(date) {
  try {
    return FF_LIB.NB_JOURS_MOIS(date);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: NB_JOURS_MOIS', 'ERROR');
    throw e;
  }
}

/**
 * Retourne le nom du mois en français pour la date fournie.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} date Date de référence ou plage.
 * @return {string|Array<Array<string>>}                Nom du mois ou tableau de résultats.
 * @customfunction
 *
 *   =NOM_MOIS("2026-05-08")  → "Mai"
 *   =NOM_MOIS(A2:A100)
 */
function NOM_MOIS(date) {
  try {
    return FF_LIB.NOM_MOIS(date);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: NOM_MOIS', 'ERROR');
    throw e;
  }
}

/**
 * Extrait le domaine principal d'une URL.
 * Gère les sous-domaines (www) et les TLDs complexes (ex: .co.uk).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} url L'URL ou une plage d'URLs.
 * @return {string|Array<Array<string>>}     Le domaine extrait ou tableau de résultats.
 * @customfunction
 *
 *   =EXTRAIRE_DOMAINE("https://www.google.co.uk/search") → "google.co.uk"
 *   =EXTRAIRE_DOMAINE(A2:A50)                           → [Tableau de résultats]
 */
function EXTRAIRE_DOMAINE(url) {
  try {
    return FF_LIB.EXTRAIRE_DOMAINE(url);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: EXTRAIRE_DOMAINE', 'ERROR');
    throw e;
  }
}

/**
 * Calcule l'indice de performance calendaire (SPI).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDebut Date début ou plage.
 * @param {Date|string} dateFin Date livraison.
 * @param {number} progressionReelle Avancement (ex: 0.45).
 * @param {Date|string} [dateActuelle] Date évaluation.
 * @return {number|Array<Array<number>>}               Le SPI ou tableau de résultats.
 * @customfunction
 *
 *   =PROJECT_SPI("2025-01-01"; "2025-12-31"; 0.5)
 *   =PROJECT_SPI(A2:A100; "2025-12-31"; 0.8)
 */
function PROJECT_SPI(dateDebut, dateFin, progressionReelle, dateActuelle) {
  try {
    return FF_LIB.PROJECT_SPI(dateDebut, dateFin, progressionReelle, dateActuelle);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: PROJECT_SPI', 'ERROR');
    throw e;
  }
}

/**
 * Analyse le calendrier et suggère un message d'absence (OOO).
 * @return {string} Brouillon de message d'absence.
 * @customfunction
 */
function CALENDAR_OOO_DRAFTER() {
  try {
    return FF_LIB.CALENDAR_OOO_DRAFTER();
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CALENDAR_OOO_DRAFTER', 'ERROR');
    throw e;
  }
}

/**
 * Normalise un texte : supprime les accents, les espaces multiples,
 * et convertit en majuscules. Idéal pour dédoublonner.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou plage à NORMALISER.
 * @return {string|Array<Array<string>>}       Le texte normalisé ou tableau de résultats.
 * @customfunction
 *
 *   =NORMALISER("  Café   Crème  à  l'Hôtel ")  → "CAFE CREME A L'HOTEL"
 *   =NORMALISER(A2:A100)
 */
function NORMALISER(texte) {
  try {
    return FF_LIB.NORMALISER(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: NORMALISER', 'ERROR');
    throw e;
  }
}

/**
 * Supprime les accents et diacritiques d'un texte sans changer la casse.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou plage à traiter.
 * @return {string|Array<Array<string>>}       Le texte sans accents ou tableau de résultats.
 * @customfunction
 *
 *   =SUPPRIMER_ACCENTS("Crème brûlée")  → "Creme brulee"
 *   =SUPPRIMER_ACCENTS(A2:A100)
 */
function SUPPRIMER_ACCENTS(texte) {
  try {
    return FF_LIB.SUPPRIMER_ACCENTS(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SUPPRIMER_ACCENTS', 'ERROR');
    throw e;
  }
}

/**
 * Supprime les espaces multiples et trim le texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou plage à nettoyer.
 * @return {string|Array<Array<string>>}       Le texte nettoyé ou tableau de résultats.
 * @customfunction
 *
 *   =SUPPRIMER_ESPACES("  Hello    World  ")  → "Hello World"
 *   =SUPPRIMER_ESPACES(A2:A100)
 */
function SUPPRIMER_ESPACES(texte) {
  try {
    return FF_LIB.SUPPRIMER_ESPACES(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SUPPRIMER_ESPACES', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le pourcentage de similarité entre deux textes (0% à 100%).
 * Basé sur la distance de Levenshtein.
 *
 * @param {string} texte1 Première chaîne.
 * @param {string} texte2 Seconde chaîne.
 * @return {number}                 Taux de similarité (entre 0 et 1).
 * @customfunction
 *
 *   =TEXT_SIMILARITY("Google Sheets"; "Google Shet") → 0.92
 */
function TEXT_SIMILARITY(texte1, texte2) {
  try {
    return FF_LIB.TEXT_SIMILARITY(texte1, texte2);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: TEXT_SIMILARITY', 'ERROR');
    throw e;
  }
}

/**
 * Affiche la liste des jours fériés d'une année sur 2 colonnes (Date | Nom).
 *
 * @param {number} annee L'année souhaitée (ex: 2026).
 * @return Un tableau contenant les dates et les noms des jours fériés.
 * @customfunction
 */
function JOURS_FERIES(annee) {
  try {
    return FF_LIB.JOURS_FERIES(annee);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: JOURS_FERIES', 'ERROR');
    throw e;
  }
}

/**
 * Affiche la liste des jours fériés d'une année sur 3 colonnes (Date | Jour | Nom).
 *
 * @param {number} annee L'année souhaitée (ex: 2026).
 * @return Un tableau avec la date, le jour de la semaine et le nom du jour férié.
 * @customfunction
 */
function JOURS_FERIES_AVEC_JOUR(annee) {
  try {
    return FF_LIB.JOURS_FERIES_AVEC_JOUR(annee);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: JOURS_FERIES_AVEC_JOUR', 'ERROR');
    throw e;
  }
}

/**
 * Prédit la prochaine valeur basée sur un historique chronologique.
 *
 * @param {Array<Array<number>>} plageHistorique Les valeurs précédentes (chronologiques).
 * @param {number} [alpha=0.5] Le coefficient de lissage (entre 0 et 1). 
 *                             Proche de 1: réactif. Proche de 0: lisse fortement.
 * @return {number}            La prévision pour la période N+1.
 * @customfunction
 *
 *   =PREVISION_LISSAGE(B2:B12; 0.6)
 */
function PREVISION_LISSAGE(plageHistorique, alpha = 0.5) {
  try {
    return FF_LIB.PREVISION_LISSAGE(plageHistorique, alpha);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: PREVISION_LISSAGE', 'ERROR');
    throw e;
  }
}

/**
 * Extrait les initiales d'un nom ou d'une phrase.
 * Gère les noms composés (tirets) et ignore les particules françaises.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou une plage de cellules.
 * @param {boolean} [avecParticules=false] Si true, inclut les particules.
 * @return {string|Array<Array<string>>}                Les initiales en majuscules ou tableau de résultats.
 * @customfunction
 *
 *   =EXTRAIRE_INITIALES("Jean-Pierre Dupont")                → "JPD"
 *   =EXTRAIRE_INITIALES(A2:A50; FAUX)                        → [Tableau de résultats]
 */
function EXTRAIRE_INITIALES(texte, avecParticules = false) {
  try {
    return FF_LIB.EXTRAIRE_INITIALES(texte, avecParticules);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: EXTRAIRE_INITIALES', 'ERROR');
    throw e;
  }
}

/**
 * Génère un QR Code de connexion Wi-Fi (via api.qrserver.com).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} ssid Nom du réseau (SSID) ou plage.
 * @param {string} motDePasse Mot de passe du Wi-Fi.
 * @param {string} [securite="WPA"] Sécurité ("WPA", "WEP", "nopass").
 * @return {string|Array<Array<string>>}        URL du QR Code ou tableau.
 * @customfunction
 *
 *   =IMAGE(QR_CODE_WIFI("Livebox-1234"; "MonMotDePasse"))
 *   =IMAGE(QR_CODE_WIFI(A2:A100; "MotDePasseUnique"))
 */
function QR_CODE_WIFI(ssid, motDePasse, securite = "WPA") {
  try {
    return FF_LIB.QR_CODE_WIFI(ssid, motDePasse, securite);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: QR_CODE_WIFI', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le nombre de jours ouvrés entre deux dates (incluses).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDebut Date de début ou plage.
 * @param {Date|string} dateFin Date de fin.
 * @return {number|Array<Array<number>>}             Nombre de jours ouvrés ou tableau.
 * @customfunction
 *
 *   =JOURS_OUVRES("2026-05-01"; "2026-05-31")
 *   =JOURS_OUVRES(A2:A100; "2026-12-31")
 */
function JOURS_OUVRES(dateDebut, dateFin) {
  try {
    return FF_LIB.JOURS_OUVRES(dateDebut, dateFin);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: JOURS_OUVRES', 'ERROR');
    throw e;
  }
}

/**
 * Indique si une date est un jour férié en France.
 *
 * @param {Date|string} date Date à vérifier.
 * @return {boolean|string}   VRAI si c'est un jour férié, ou message d'erreur.
 * @customfunction
 */
function EST_JOUR_FERIE_FR(date) {
  try {
    return FF_LIB.EST_JOUR_FERIE_FR(date);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: EST_JOUR_FERIE_FR', 'ERROR');
    throw e;
  }
}

/**
 * Évalue l'urgence d'une échéance en jours ouvrés.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateEcheance Date limite ou plage.
 * @param {Date|string} [dateRef] Date de référence.
 * @return {string|Array<Array<string>>}                Statut ou tableau de résultats.
 * @customfunction
 *
 *   =DEADLINE_STATUS(A2)
 *   =DEADLINE_STATUS(A2:A100)
 */
function DEADLINE_STATUS(dateEcheance, dateRef) {
  try {
    return FF_LIB.DEADLINE_STATUS(dateEcheance, dateRef);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DEADLINE_STATUS', 'ERROR');
    throw e;
  }
}

/**
 * Retourne la version actuelle de la bibliothèque.
 * @return {string} Version (ex: "2.1.0").
 * @customfunction
 */
function FF_VERSION() {
  try {
    return FF_LIB.FF_VERSION();
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: FF_VERSION', 'ERROR');
    throw e;
  }
}

/**
 * Censure les mots indésirables dans un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte source ou plage.
 * @param {string} [motsSupplementaires=""] Mots à ajouter à la liste noire (séparés par des virgules).
 * @return {string|Array<Array<string>>}       Le texte censuré ou tableau de résultats.
 * @customfunction
 *
 *   =CENSURE_MOTS("C'est vraiment un gros connard."; "gros,moche")
 *   =CENSURE_MOTS(A2:A100; "urgent")
 */
function CENSURE_MOTS(texte, motsSupplementaires = "") {
  try {
    return FF_LIB.CENSURE_MOTS(texte, motsSupplementaires);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CENSURE_MOTS', 'ERROR');
    throw e;
  }
}

/**
 * Sécurise un texte pour en faire un nom de fichier valide.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte brut ou plage.
 * @param {string} [remplacement="-"] Le caractère de remplacement.
 * @return {string|Array<Array<string>>}        Le nom de fichier propre ou tableau de résultats.
 * @customfunction
 *
 *   =NOM_FICHIER_PROPRE("Facture_N°123/2026") → "Facture_N-123-2026"
 *   =NOM_FICHIER_PROPRE(A2:A100)
 */
function NOM_FICHIER_PROPRE(texte, remplacement = "-") {
  try {
    return FF_LIB.NOM_FICHIER_PROPRE(texte, remplacement);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: NOM_FICHIER_PROPRE', 'ERROR');
    throw e;
  }
}

/**
 * Retourne la date du prochain jour férié en France à partir d'une date donnée.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateRef Date de référence ou plage.
 * @return {Date|Array<Array<Date>>}                La date du prochain jour férié.
 * @customfunction
 *
 *   =PROCHAIN_FERIE(AUJOURDHUI())
 *   =PROCHAIN_FERIE(A2:A100)
 */
function PROCHAIN_FERIE(dateRef) {
  try {
    return FF_LIB.PROCHAIN_FERIE(dateRef);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: PROCHAIN_FERIE', 'ERROR');
    throw e;
  }
}

/**
 * Extrait les mots les plus utilisés d'une plage de texte.
 * Renvoie un tableau à deux colonnes : [Mot, Occurrences].
 *
 * @param {Array<Array<string>>|string} plage Plage de cellules ou texte.
 * @param {boolean} [exclureLiaison=true] Ignorer les "stop words" français (le, la, et...).
 * @param {number} [topN=10] Nombre de mots à retourner (Top 10 par défaut).
 * @return {Array<Array<any>>}                 Tableau [Mot, Nombre].
 * @customfunction
 *
 *   =FREQUENCE_MOTS(A2:A100; VRAI; 20)
 */
function FREQUENCE_MOTS(plage, exclureLiaison = true, topN = 10) {
  try {
    return FF_LIB.FREQUENCE_MOTS(plage, exclureLiaison, topN);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: FREQUENCE_MOTS', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie le format d'une adresse email.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} email L'adresse email ou une plage de cellules.
 * @return {string|Array<Array<string>>}       "VALIDE", message d'erreur ou tableau de résultats.
 * @customfunction
 *
 *   =VERIF_EMAIL("fabrice@faucheux.bzh")       → "VALIDE"
 *   =VERIF_EMAIL(A2:A100)                      → [Tableau de résultats]
 */
function VERIF_EMAIL(email) {
  try {
    return FF_LIB.VERIF_EMAIL(email);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VERIF_EMAIL', 'ERROR');
    throw e;
  }
}

/**
 * Extrait la première adresse email trouvée dans un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou une plage de cellules.
 * @return {string|Array<Array<string>>}       L'adresse email trouvée ou tableau de résultats.
 * @customfunction
 *
 *   =EXTRAIRE_EMAIL(B2:B50)                              → [Tableau de résultats]
 */
function EXTRAIRE_EMAIL(texte) {
  try {
    return FF_LIB.EXTRAIRE_EMAIL(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: EXTRAIRE_EMAIL', 'ERROR');
    throw e;
  }
}

/**
 * Extrait une valeur d'une chaîne JSON formatée en utilisant un chemin.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} chaineJSON Le texte JSON ou plage.
 * @param {string} chemin Le chemin de la valeur (ex: "user.nom").
 * @return {any|Array<Array<any>>}                  La valeur extraite ou tableau de résultats.
 * @customfunction
 *
 *   =EXTRAIRE_JSON(A2; "client.adresse.ville")
 *   =EXTRAIRE_JSON(A2:A100; "status")
 */
function EXTRAIRE_JSON(chaineJSON, chemin) {
  try {
    return FF_LIB.EXTRAIRE_JSON(chaineJSON, chemin);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: EXTRAIRE_JSON', 'ERROR');
    throw e;
  }
}

/**
 * Indique si une donnée doit être purgée selon le RGPD.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDonnee Date ou plage.
 * @param {number} dureeMois Durée de rétention max en mois.
 * @return {string|Array<Array<string>>}              Statut ou tableau de résultats.
 * @customfunction
 *
 *   =VERIF_GDPR_RETENTION("2021-01-15"; 36)
 *   =VERIF_GDPR_RETENTION(A2:A100; 12)
 */
function VERIF_GDPR_RETENTION(dateDonnee, dureeMois) {
  try {
    return FF_LIB.VERIF_GDPR_RETENTION(dateDonnee, dureeMois);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VERIF_GDPR_RETENTION', 'ERROR');
    throw e;
  }
}

/**
 * Masque les données sensibles détectées dans un texte ou une plage.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<any>>} input Le texte à anonymiser ou une plage.
 * @return {string|Array<Array<string>>}     Le texte masqué ou tableau de résultats.
 * @customfunction
 *
 */
function MASK_PII(input) {
  try {
    return FF_LIB.MASK_PII(input);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: MASK_PII', 'ERROR');
    throw e;
  }
}

/**
 * Génère un mot de passe aléatoire.
 *
 * @param {number} [longueur=12] La longueur du mot de passe.
 * @param {boolean} [majuscules=true] Inclure des majuscules.
 * @param {boolean} [nombres=true] Inclure des chiffres.
 * @param {boolean} [speciaux=true] Inclure des caractères spéciaux.
 * @return {string}                 Le mot de passe généré.
 * @customfunction
 *
 *   =GENERER_MOT_DE_PASSE(16; VRAI; VRAI; FAUX)
 */
function GENERER_MOT_DE_PASSE(longueur = 12, majuscules = true, nombres = true, speciaux = true) {
  try {
    return FF_LIB.GENERER_MOT_DE_PASSE(longueur, majuscules, nombres, speciaux);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: GENERER_MOT_DE_PASSE', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie la validité d'un NIR (n° de Sécurité Sociale français).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} nir Le NIR ou plage.
 * @return {string|Array<Array<string>>}        "VALIDE" ou message d'erreur.
 * @customfunction
 *
 *   =VERIF_NIR("2 85 01 78 006 084 19")  → "VALIDE"
 *   =VERIF_NIR(A2:A100)
 */
function VERIF_NIR(nir) {
  try {
    return FF_LIB.VERIF_NIR(nir);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VERIF_NIR', 'ERROR');
    throw e;
  }
}

/**
 * Recherche toutes les occurrences et concatène les résultats.
 * Supporte le traitement par lot (plages de valeurs recherchées).
 *
 * @param {any|Array<Array<any>>} valeurRecherchee La valeur ou plage à chercher.
 * @param {Array<Array<any>>} plage La plage de recherche (ex: A2:D100).
 * @param {number} indexColonne Index colonne à renvoyer (1-indexé).
 * @param {string} [separateur=", "]               Le séparateur.
 * @return {string|Array<Array<any>>}               Résultats concaténés ou tableau.
 * @customfunction
 *
 *   =RECHERCHEV_MULTI("123"; A2:B100; 2)
 *   =RECHERCHEV_MULTI(F2:F10; A2:B100; 2)
 */
function RECHERCHEV_MULTI(valeurRecherchee, plage, indexColonne, separateur = ", ") {
  try {
    return FF_LIB.RECHERCHEV_MULTI(valeurRecherchee, plage, indexColonne, separateur);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: RECHERCHEV_MULTI', 'ERROR');
    throw e;
  }
}

/**
 * Supprime les balises HTML d'un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte HTML ou plage.
 * @return {string|Array<Array<string>>}       Le texte brut nettoyé ou tableau de résultats.
 * @customfunction
 *
 *   =CLEAN_HTML("<p>Bonjour <strong>le monde</strong> !</p>")
 *   → "Bonjour le monde !"
 *   =CLEAN_HTML(A2:A100)
 */
function CLEAN_HTML(texte) {
  try {
    return FF_LIB.CLEAN_HTML(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CLEAN_HTML', 'ERROR');
    throw e;
  }
}

/**
 * Extrait toutes les correspondances d'une expression régulière dans un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte source ou plage.
 * @param {string} expressionReguliere L'expression régulière.
 * @param {string} [separateur=", "]            Le séparateur.
 * @return {string|Array<Array<any>>}            Les éléments trouvés ou tableau.
 * @customfunction
 *
 *   =REGEX_EXTRAIRE_TOUT(A2; "\d+ €")
 *   =REGEX_EXTRAIRE_TOUT(A2:A100; "#[a-zA-Z0-9]+")
 */
function REGEX_EXTRAIRE_TOUT(texte, expressionReguliere, separateur = ", ") {
  try {
    return FF_LIB.REGEX_EXTRAIRE_TOUT(texte, expressionReguliere, separateur);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: REGEX_EXTRAIRE_TOUT', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie la validité d'un numéro SIRET (14 chiffres) via l'algorithme de Luhn.
 * Gère le cas particulier de La Poste (SIREN 356000000).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} numero Le SIRET ou plage.
 * @return {string|Array<Array<string>>}           "VALIDE" ou message d'erreur.
 * @customfunction
 *
 *   =VERIF_SIRET("732 829 320 00074")  → "VALIDE"
 *   =VERIF_SIRET(A2:A100)
 */
function VERIF_SIRET(numero) {
  try {
    return FF_LIB.VERIF_SIRET(numero);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VERIF_SIRET', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie la validité d'un numéro SIREN (9 chiffres) via l'algorithme de Luhn.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} numero Le SIREN ou plage.
 * @return {string|Array<Array<string>>}           "VALIDE" ou message d'erreur.
 * @customfunction
 *
 *   =VERIF_SIREN("732 829 320")  → "VALIDE"
 *   =VERIF_SIREN(A2:A100)
 */
function VERIF_SIREN(numero) {
  try {
    return FF_LIB.VERIF_SIREN(numero);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VERIF_SIREN', 'ERROR');
    throw e;
  }
}

/**
 * Découpe une adresse française en Numéro, Voie, Code Postal et Ville.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} adresse L'adresse ou plage.
 * @return {Array<Array<string>>}                Tableau [Numéro, Voie, Code Postal, Ville].
 * @customfunction
 *
 *   =PARSER_ADRESSE_FR("8 rue de la paix 75002 Paris")
 *   =PARSER_ADRESSE_FR(A2:A100)
 */
function PARSER_ADRESSE_FR(adresse) {
  try {
    return FF_LIB.PARSER_ADRESSE_FR(adresse);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: PARSER_ADRESSE_FR', 'ERROR');
    throw e;
  }
}

/**
 * Normalise une adresse française via l'API officielle (adresse.data.gouv.fr).
 *
 * @param {string|Array<Array<string>>} adresse L'adresse ou une plage de cellules.
 * @return {Array<Array<string>>}                Tableau de [Adresse complète, Score de confiance].
 * @customfunction
 *
 *   =NORMALISER_ADRESSE_FR("8 r de la paix pari") → "8 Rue de la Paix, 75002 Paris"
 */
function NORMALISER_ADRESSE_FR(adresse) {
  try {
    return FF_LIB.NORMALISER_ADRESSE_FR(adresse);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: NORMALISER_ADRESSE_FR', 'ERROR');
    throw e;
  }
}

/**
 * Analyse le niveau de partage d'un fichier Drive.
 *
 * @param {string|Array<Array<string>>} fileId ID du fichier ou URL.
 * @return {string|Array<Array<string>>} Résumé des permissions.
 * @customfunction
 */
function DRIVE_PERMISSION_AUDITOR(fileId) {
  try {
    return FF_LIB.DRIVE_PERMISSION_AUDITOR(fileId);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DRIVE_PERMISSION_AUDITOR', 'ERROR');
    throw e;
  }
}

/**
 * Retourne le statut de santé d'un compte utilisateur.
 * Note: Nécessite l'activation du service avancé "Admin SDK API".
 * @param {string} email Adresse email de l'utilisateur.
 * @return {string} Résumé du compte (Connexion, Quota).
 * @customfunction
 */
function WORKSPACE_USER_HEALTH(email) {
  try {
    return FF_LIB.WORKSPACE_USER_HEALTH(email);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: WORKSPACE_USER_HEALTH', 'ERROR');
    throw e;
  }
}

/**
 * Recherche une valeur de façon approchée et renvoie la valeur d'une autre colonne.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} valeurRecherchee La valeur ou plage à chercher.
 * @param {Array<Array<any>>} plage La plage de référence (ex: A2:C100).
 * @param {number} [indexColonne=2] Colonne à renvoyer (1-indexé).
 * @param {number} [seuil=0.7] Similarité (0 à 1).
 * @return {any|Array<Array<any>>}                       La valeur trouvée ou tableau de résultats.
 * @customfunction
 *
 *   =RECHERCHE_V_FLOUE("Societe Generale"; A2:C100; 3)
 *   =RECHERCHE_V_FLOUE(D2:D100; A2:C100; 2)
 */
function RECHERCHE_V_FLOUE(valeurRecherchee, plage, indexColonne = 2, seuil = 0.7) {
  try {
    return FF_LIB.RECHERCHE_V_FLOUE(valeurRecherchee, plage, indexColonne, seuil);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: RECHERCHE_V_FLOUE', 'ERROR');
    throw e;
  }
}

/**
 * Extrait l'URL réelle cachée derrière un lien de sécurité d'entreprise.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} url L'URL réécrite ou plage.
 * @return {string|Array<Array<string>>}    L'URL propre ou tableau de résultats.
 * @customfunction
 *
 *   =DECODE_SAFE_URL(A2)
 *   =DECODE_SAFE_URL(A2:A100)
 */
function DECODE_SAFE_URL(url) {
  try {
    return FF_LIB.DECODE_SAFE_URL(url);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DECODE_SAFE_URL', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie la validité d'un numéro de carte bancaire (algorithme de Luhn).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} numero Numéro ou plage.
 * @return {string|Array<Array<string>>}           "VALIDE (réseau)" ou message d'erreur.
 * @customfunction
 *
 *   =VERIF_CB("4539 1488 0343 6467")  → "VALIDE (Visa)"
 *   =VERIF_CB(A2:A100)
 */
function VERIF_CB(numero) {
  try {
    return FF_LIB.VERIF_CB(numero);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VERIF_CB', 'ERROR');
    throw e;
  }
}

/**
 * Détecte le réseau d'une carte bancaire à partir de son numéro.
 *
 * @param {string} numero Numéro de CB (chiffres uniquement).
 * @return {string}        Nom du réseau ou "Inconnu".
 * @customfunction
 */
function DETECT_RESEAU(numero) {
  try {
    return FF_LIB.DETECT_RESEAU(numero);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DETECT_RESEAU', 'ERROR');
    throw e;
  }
}

/**
 * Détecte la présence de données sensibles (PII) dans un texte ou une plage.
 *
 * @param {string|Array<Array<any>>} input Le texte à analyser, ou une plage.
 * @return {string|Array<Array<string>>} "🟢 Clean" ou "🔴 PII Détectée : <types>".
 * @customfunction
 */
function DETECT_PII(input) {
  try {
    return FF_LIB.DETECT_PII(input);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DETECT_PII', 'ERROR');
    throw e;
  }
}

/**
 * Calcule l'entropie de Shannon d'une chaîne de caractères (en bits).
 * Plus le score est élevé, plus la chaîne est complexe/aléatoire.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte La chaîne ou plage à analyser.
 * @return {number|Array<Array<number>>}       Le score d'entropie ou tableau de résultats.
 * @customfunction
 *
 *   =ENTROPY_SCORE("P@ssw0rd123!")
 *   =ENTROPY_SCORE(A2:A100)
 */
function ENTROPY_SCORE(texte) {
  try {
    return FF_LIB.ENTROPY_SCORE(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ENTROPY_SCORE', 'ERROR');
    throw e;
  }
}

/**
 * Détecte si une valeur est un outlier mathématique.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} valeur La valeur ou plage à tester.
 * @param {Array<Array<number>>} plageDonnees L'historique des valeurs (ex: B2:B100).
 * @param {number} [seuilZ=2.5] Le seuil du Z-score.
 * @return {string|Array<Array<string>>}               "Anomalie" ou "Normal" (ou tableau de résultats).
 * @customfunction
 *
 *   =DETECT_OUTLIER(C2; C$2:C$100)
 *   =DETECT_OUTLIER(C2:C10; C$2:C$100)
 */
function DETECT_OUTLIER(valeur, plageDonnees, seuilZ = 2.5) {
  try {
    return FF_LIB.DETECT_OUTLIER(valeur, plageDonnees, seuilZ);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DETECT_OUTLIER', 'ERROR');
    throw e;
  }
}

/**
 * Calcule la durée du préavis de fin de contrat CDI (France).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} dateDebut   Date d'entrée.
 * @param {Date|number|string}                   [dateRupture] Date de notification (aujourd'hui par défaut).
 * @param {string}                               [statut="Cadre"] "Cadre" ou "Ouvrier"/"Employé".
 * @param {string}                               [type="Démission"] "Démission" ou "Licenciement".
 * @return {string|Array<Array<string>>}          Durée estimée (ex: "3 mois").
 * @customfunction
 *
 *   =PREAVIS_CONTRAT("2020-01-01"; "2026-05-09"; "Cadre"; "Démission") → "3 mois"
 *   =PREAVIS_CONTRAT(A2:A100; ; "Employé"; "Licenciement")
 */
function PREAVIS_CONTRAT(dateDebut, dateRupture, statut = "Cadre", type = "Démission") {
  try {
    return FF_LIB.PREAVIS_CONTRAT(dateDebut, dateRupture, statut, type);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: PREAVIS_CONTRAT', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le nombre de jours de congés acquis au prorata.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateEntree Date de début ou plage.
 * @param {Date|string} [dateFin] Date de fin.
 * @param {number} [joursParMois=2.08] Jours acquis par mois.
 * @return {number|string|Array<Array<number|string>>} Nombre de jours ou tableau de résultats.
 * @customfunction
 *
 *   =SOLDE_CONGES("2025-01-01"; "2025-06-30"; 2.5)
 *   =SOLDE_CONGES(A2:A100)
 */
function SOLDE_CONGES(dateEntree, dateFin, joursParMois = 2.08) {
  try {
    return FF_LIB.SOLDE_CONGES(dateEntree, dateFin, joursParMois);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SOLDE_CONGES', 'ERROR');
    throw e;
  }
}

/**
 * Calcule la date de fin de période d'essai CDI (droit du travail français).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} dateEmbauche Date de début ou plage.
 * @param {string}             statut "Ouvrier", "Maitrise", "Cadre".
 * @param {boolean}            [renouvellement=false] Si renouvelée.
 * @return {Date|string|Array<Array<any>>}    Date de fin ou tableau.
 * @customfunction
 *
 *   =FIN_PERIODE_ESSAI("2026-01-01"; "Cadre")
 *   =FIN_PERIODE_ESSAI(A2:A100; "Ouvrier")
 */
function FIN_PERIODE_ESSAI(dateEmbauche, statut, renouvellement = false) {
  try {
    return FF_LIB.FIN_PERIODE_ESSAI(dateEmbauche, statut, renouvellement);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: FIN_PERIODE_ESSAI', 'ERROR');
    throw e;
  }
}

/**
 * Retourne la durée de la période d'essai en mois pour un statut donné.
 * Utile pour afficher la durée dans une cellule adjacente.
 *
 * @param {string}  statut "Ouvrier"/"Employé", "Maitrise"/"Technicien", "Cadre".
 * @param {boolean} [renouvellement=false] VRAI si la PE est renouvelée.
 * @return {string}  Durée formatée (ex : "4 mois" ou "8 mois (renouvelée)").
 * @customfunction
 *
 *   =DUREE_PERIODE_ESSAI("Cadre"; FAUX)  → "4 mois"
 *   =DUREE_PERIODE_ESSAI("Cadre"; VRAI)  → "8 mois (renouvelée)"
 *   =DUREE_PERIODE_ESSAI("Ouvrier")      → "2 mois"
 */
function DUREE_PERIODE_ESSAI(statut, renouvellement = false) {
  try {
    return FF_LIB.DUREE_PERIODE_ESSAI(statut, renouvellement);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DUREE_PERIODE_ESSAI', 'ERROR');
    throw e;
  }
}

/**
 * Estime le salaire Brut/Net.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montant Le salaire ou une plage de cellules.
 * @param {string} statut "Cadre", "Non-Cadre", "Fonctionnaire", "Stage", "Alternance".
 * @param {string} [sens="B2N"] "B2N" (Brut vers Net) ou "N2B" (Net vers Brut).
 * @param {number} [tauxPersonnalise] Taux de charges forcé (ex: 0.22 pour 22%).
 * @return {number|Array<Array<number>>}           Le salaire estimé ou tableau de résultats.
 * @customfunction
 *
 *   =ESTIMATION_BRUT_NET(3000; "Cadre"; "B2N")
 *   =ESTIMATION_BRUT_NET(A2:A50; "Non-Cadre")
 */
function ESTIMATION_BRUT_NET(montant, statut, sens = "B2N", tauxPersonnalise) {
  try {
    return FF_LIB.ESTIMATION_BRUT_NET(montant, statut, sens, tauxPersonnalise);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ESTIMATION_BRUT_NET', 'ERROR');
    throw e;
  }
}

/**
 * Estime le coût total pour l'entreprise d'un salaire (Charges patronales).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} salaireBrut Le salaire Brut ou plage.
 * @param {string} [statut] "Cadre", "Non-Cadre" (Défaut).
 * @return {number|Array<Array<number>>}            Le coût employeur ou tableau de résultats.
 * @customfunction
 *
 *   =COUT_EMPLOYEUR(3000; "Cadre")
 *   =COUT_EMPLOYEUR(A2:A100)
 */
function COUT_EMPLOYEUR(salaireBrut, statut = "Non-Cadre") {
  try {
    return FF_LIB.COUT_EMPLOYEUR(salaireBrut, statut);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: COUT_EMPLOYEUR', 'ERROR');
    throw e;
  }
}

/**
 * Calcule l'âge exact en années, mois et jours.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateNaissance Date de naissance ou plage.
 * @param {Date|string} [dateRef] Date de référence (Aujourd'hui si omis).
 * @return {string|Array<Array<string>>} Âge formaté ou tableau de résultats.
 * @customfunction
 */
function AGE_EXACT(dateNaissance, dateRef) {
  try {
    return FF_LIB.AGE_EXACT(dateNaissance, dateRef);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: AGE_EXACT', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie si un timestamp tombe sur un horaire ouvré (LUN-VEN, hors jours fériés).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateTime Heure à vérifier ou plage.
 * @param {number} [heureDebut=9] Heure de début (0-23).
 * @param {number} [heureFin=18] Heure de fin (0-23).
 * @return {boolean|Array<Array<boolean>>} VRAI si c'est pendant les heures d'ouverture.
 * @customfunction
 *
 *   =IS_BUSINESS_HOUR(A2; 9; 18)
 *   =IS_BUSINESS_HOUR(A2:A50)
 */
function IS_BUSINESS_HOUR(dateTime, heureDebut = 9, heureFin = 18) {
  try {
    return FF_LIB.IS_BUSINESS_HOUR(dateTime, heureDebut, heureFin);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: IS_BUSINESS_HOUR', 'ERROR');
    throw e;
  }
}

/**
 * Retourne l'ancienneté sous forme textuelle ("X ans et Y mois").
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDebut Date d'embauche ou plage.
 * @param {Date|string} [dateFin] Date de fin.
 * @return {string|Array<Array<string>>}             L'ancienneté ou tableau de résultats.
 * @customfunction
 *
 *   =ANCIENNETE_PRO("2015-09-01")
 *   =ANCIENNETE_PRO(A2:A100)
 */
function ANCIENNETE_PRO(dateDebut, dateFin) {
  try {
    return FF_LIB.ANCIENNETE_PRO(dateDebut, dateFin);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ANCIENNETE_PRO', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le prorata de salaire mensuel selon les jours ouvrés réels.
 * Formule : Salaire * (Jours ouvrés travaillés / Jours ouvrés totaux du mois)
 *
 * @param {number|Array<Array<number>>} salaireMensuel Salaire brut mensuel.
 * @param {Date|string}                dateDebut      Date de début de présence dans le mois.
 * @param {Date|string}                dateFin        Date de fin de présence dans le mois.
 * @return {number|Array<Array<number>>}               Salaire proratisé.
 * @customfunction
 *
 *   =PRORATA_SALAIRE(3000; "2026-05-12"; "2026-05-31")
 */
function PRORATA_SALAIRE(salaireMensuel, dateDebut, dateFin) {
  try {
    return FF_LIB.PRORATA_SALAIRE(salaireMensuel, dateDebut, dateFin);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: PRORATA_SALAIRE', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le délai de prévenance légal pour une rupture de période d'essai.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|number|string|Array<Array<any>>} dateDebut   Date d'entrée.
 * @param {Date|number|string}                   [dateRupture] Date de notification (aujourd'hui par défaut).
 * @param {boolean}                              [coteEmployeur=true] VRAI si rupture par l'employeur.
 * @return {string|Array<Array<string>>}          Le délai (ex: "48 heures", "2 semaines").
 * @customfunction
 *
 *   =DELAI_PREVENANCE("2026-01-01"; "2026-02-15")  → "2 semaines"
 *   =DELAI_PREVENANCE(A2:A100)
 */
function DELAI_PREVENANCE(dateDebut, dateRupture, coteEmployeur = true) {
  try {
    return FF_LIB.DELAI_PREVENANCE(dateDebut, dateRupture, coteEmployeur);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: DELAI_PREVENANCE', 'ERROR');
    throw e;
  }
}

/**
 * Enregistre une erreur dans la feuille de logs et notifie l'admin si critique.
 *
 * @param {string} message   Message de l'erreur.
 * @param {string} [contexte] Où l'erreur s'est produite (ex: "Calcul Paie").
 * @param {string} [gravite="ERROR"] Niveau : "INFO", "WARN", "ERROR", "CRITICAL".
 * @return {string}           Statut de l'enregistrement.
 * @customfunction
 */
function LOG_ERREUR(message, contexte = "Général", gravite = "ERROR") {
  return FF_LIB.LOG_ERREUR(message, contexte, gravite);
}

/**
 * Fonction de test pour forcer un bug et vérifier le système d'alerte.
 * @customfunction
 */
function FORCE_BUG() {
  try {
    return FF_LIB.FORCE_BUG();
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: FORCE_BUG', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le montant TTC à partir d'un montant HT et d'un taux de TVA.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montantHT Le montant Hors Taxes ou plage.
 * @param {number} tauxTVA Le taux de TVA (ex: 20 pour 20%, ou 0.2).
 * @return {number|Array<Array<number>>}           Le montant TTC ou tableau de résultats.
 * @customfunction
 *
 *   =HT_TO_TTC(100; 20)  → 120
 *   =HT_TO_TTC(A2:A100; 20)
 */
function HT_TO_TTC(montantHT, tauxTVA) {
  try {
    return FF_LIB.HT_TO_TTC(montantHT, tauxTVA);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: HT_TO_TTC', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le montant HT à partir d'un montant TTC et d'un taux de TVA.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montantTTC Le montant TTC ou plage.
 * @param {number} tauxTVA Le taux de TVA (ex: 20 pour 20%, ou 0.2).
 * @return {number|Array<Array<number>>}           Le montant HT ou tableau de résultats.
 * @customfunction
 *
 *   =TTC_TO_HT(120; 20)  → 100
 *   =TTC_TO_HT(A2:A100; 20)
 */
function TTC_TO_HT(montantTTC, tauxTVA) {
  try {
    return FF_LIB.TTC_TO_HT(montantTTC, tauxTVA);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: TTC_TO_HT', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie la validité d'un numéro de TVA intracommunautaire.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} numero Le numéro ou plage.
 * @return {string|Array<Array<string>>}        "VALIDE" ou message d'erreur.
 * @customfunction
 *
 *   =VERIF_TVA("FR 40 303656847")  → "VALIDE"
 *   =VERIF_TVA(A2:A100)
 */
function VERIF_TVA(numero) {
  try {
    return FF_LIB.VERIF_TVA(numero);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VERIF_TVA', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le point mort (seuil de rentabilité).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} chargesFixes Le total des charges fixes ou plage.
 * @param {number} prixVenteUnit Le prix de vente d'une unité.
 * @param {number} chargesVarUnit Le coût variable d'une unité.
 * @param {string} [typeRetour="UNITE"] "UNITE" ou "CA".
 * @return {number|Array<Array<number>>}                Le seuil de rentabilité ou tableau de résultats.
 * @customfunction
 *
 *   =SEUIL_RENTABILITE(10000; 50; 20)
 *   =SEUIL_RENTABILITE(A2:A100; 50; 20)
 */
function SEUIL_RENTABILITE(chargesFixes, prixVenteUnit, chargesVarUnit, typeRetour = "UNITE") {
  try {
    return FF_LIB.SEUIL_RENTABILITE(chargesFixes, prixVenteUnit, chargesVarUnit, typeRetour);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SEUIL_RENTABILITE', 'ERROR');
    throw e;
  }
}

/**
 * Calcule la dotation aux amortissements d'une immobilisation pour une année donnée.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} valeur Valeur d'achat ou plage.
 * @param {number} dureeAnnees Durée en années.
 * @param {Date|string} dateAchat Date de mise en service.
 * @param {number} anneeExercice Année de calcul.
 * @return {number|Array<Array<number>>}        Dotation ou tableau de résultats.
 * @customfunction
 *
 *   =AMORTISSEMENT_LINEAIRE(10000; 5; "2024-07-01"; 2024)
 *   =AMORTISSEMENT_LINEAIRE(A2:A100; 5; "2024-01-01"; 2025)
 */
function AMORTISSEMENT_LINEAIRE(valeur, dureeAnnees, dateAchat, anneeExercice) {
  try {
    return FF_LIB.AMORTISSEMENT_LINEAIRE(valeur, dureeAnnees, dateAchat, anneeExercice);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: AMORTISSEMENT_LINEAIRE', 'ERROR');
    throw e;
  }
}

/**
 * Convertit un nombre en toutes lettres (FR/EN).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|string|Array<Array<any>>} nombre Le nombre ou une plage de cellules.
 * @param {string} [langue='FR'] Langue : 'FR' ou 'EN'.
 * @param {string} [devise] Devise (ex: "euro", "dollar").
 * @param {string} [nomCentimes] Sous-devise (ex: "centime", "cent").
 * @return {string|Array<Array<string>>}             Le montant en toutes lettres ou tableau de résultats.
 * @customfunction
 *
 *   =MONTANT_EN_LETTRES(1234.56; "FR") → "mille deux cent trente-quatre euros et cinquante-six centimes"
 *   =MONTANT_EN_LETTRES(1234.56; "EN") → "one thousand two hundred thirty-four dollars and fifty-six cents"
 */
function MONTANT_EN_LETTRES(nombre, langue = "FR", devise, nomCentimes) {
  try {
    return FF_LIB.MONTANT_EN_LETTRES(nombre, langue, devise, nomCentimes);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: MONTANT_EN_LETTRES', 'ERROR');
    throw e;
  }
}

/**
 * Ventile un montant TTC selon une catégorie et une date (optionnelle).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montantTTC Le montant TTC ou plage.
 * @param {string} categorie Catégorie (STANDARD, REDUIT, INTERMEDIAIRE, RESTAURATION, PARTICULIER, PRESSE, EXONERE) ou taux numérique (ex: 0.20).
 * @param {string} [retour="TVA"] Type de résultat souhaité : "TVA" (montant de la taxe), "HT" (montant hors taxe) ou "TOUT" (affiche HT et TVA sur deux colonnes).
 * @param {Date|string} [dateFacture] Date pour recherche historique du taux (optionnel, utilise la date du jour par défaut).
 * @return {number|Array<Array<any>>} Le montant calculé ou tableau de résultats.
 * @customfunction
 *
 *   =VENTILATION_TVA(120; "STANDARD")
 *   =VENTILATION_TVA(110; "RESTAURATION"; "HT"; "2023-01-01")
 */
function VENTILATION_TVA(montantTTC, categorie, retour = "TVA", dateFacture = null) {
  try {
    return FF_LIB.VENTILATION_TVA(montantTTC, categorie, retour, dateFacture);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VENTILATION_TVA', 'ERROR');
    throw e;
  }
}

/**
 * Arrondit un nombre selon la méthode comptable (arrondi au pair).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} nombre Le nombre à arrondir ou plage.
 * @param {number} [decimales] Le nombre de décimales (2 par défaut).
 * @return {number|Array<Array<number>>}           Le nombre arrondi ou tableau de résultats.
 * @customfunction
 *
 *   =ARRONDI_COMPTABLE(2.5; 0)  → 2
 *   =ARRONDI_COMPTABLE(A2:A100; 2)
 */
function ARRONDI_COMPTABLE(nombre, decimales = 2) {
  try {
    return FF_LIB.ARRONDI_COMPTABLE(nombre, decimales);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ARRONDI_COMPTABLE', 'ERROR');
    throw e;
  }
}

/**
 * Récupère le dernier taux de refinancement (MRO) de la BCE via leur API.
 * Utilisable directement dans une cellule Sheets.
 *
 * @return {number} Le taux en pourcentage (ex: 4.5).
 * @customfunction
 */
function TAUX_BCE() {
  try {
    return FF_LIB.TAUX_BCE();
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: TAUX_BCE', 'ERROR');
    throw e;
  }
}

/**
 * Calcule les intérêts de retard B2B (France).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montant Montant de la facture ou plage.
 * @param {Date|string} dateEcheance Date d'échéance.
 * @param {number} [tauxBCE] (Optionnel) Le taux directeur BCE (%). Si vide, interroge l'API.
 * @param {number} [marge=10] (Optionnel) La marge légale (points). 10 points par défaut.
 * @return {number|Array<Array<number>>} Le montant des pénalités ou tableau de résultats.
 * @customfunction
 *
 *   =PENALITES_RETARD(5000; "2024-01-01")
 *   =PENALITES_RETARD(A2:A100; "2024-01-01"; ; 10)
 */
function PENALITES_RETARD(montant, dateEcheance, tauxBCE, marge = 10) {
  try {
    return FF_LIB.PENALITES_RETARD(montant, dateEcheance, tauxBCE, marge);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: PENALITES_RETARD', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le montant des intérêts/agios.
 * Formule : (Montant * Jours * Taux Annuel) / (365 * 100)
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} montant Montant ou plage.
 * @param {number} tauxAnnuel Taux d'intérêt annuel en % (ex: 8 pour 8%).
 * @param {number} nbJours Nombre de jours de retard/découvert.
 * @return {number|Array<Array<number>>}            Montant des agios ou tableau de résultats.
 * @customfunction
 *
 *   =CALCUL_AGIOS(5000; 12; 15)
 *   =CALCUL_AGIOS(A2:A100; 12; 15)
 */
function CALCUL_AGIOS(montant, tauxAnnuel, nbJours) {
  try {
    return FF_LIB.CALCUL_AGIOS(montant, tauxAnnuel, nbJours);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CALCUL_AGIOS', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie la validité d'un IBAN (International Bank Account Number).
 *
 * @param {string|Array<Array<string>>} iban L'IBAN ou une plage de cellules.
 * @return {string|Array<Array<string>>} "VALIDE", message d'erreur ou tableau de résultats.
 * @customfunction
 */
function VERIF_IBAN(iban) {
  try {
    return FF_LIB.VERIF_IBAN(iban);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: VERIF_IBAN', 'ERROR');
    throw e;
  }
}

/**
 * Formate un IBAN en groupes de 4 caractères séparés par des espaces.
 *
 * @param {string|Array<Array<string>>} iban L'IBAN ou une plage de cellules.
 * @return {string|Array<Array<string>>} L'IBAN formaté ou tableau de résultats.
 * @customfunction
 */
function FORMAT_IBAN(iban) {
  try {
    return FF_LIB.FORMAT_IBAN(iban);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: FORMAT_IBAN', 'ERROR');
    throw e;
  }
}

/**
 * Estime la date de livraison selon le code postal de destination.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateDepart Date d'expédition ou plage.
 * @param {string|number} codePostal Code postal du destinataire.
 * @return {Date|string|Array<Array<Date|string>>}    Date estimée ou tableau de résultats.
 * @customfunction
 *
 *   =ESTIMER_LIVRAISON(AUJOURDHUI(); "75001")
 *   =ESTIMER_LIVRAISON(A2:A100; "75001")
 */
function ESTIMER_LIVRAISON(dateDepart, codePostal) {
  try {
    return FF_LIB.ESTIMER_LIVRAISON(dateDepart, codePostal);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ESTIMER_LIVRAISON', 'ERROR');
    throw e;
  }
}

/**
 * Calcule et ajoute la clé de contrôle EAN13.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|number|Array<Array<any>>} code12Chiffres Les 12 premiers chiffres ou plage.
 * @return {string|Array<Array<string>>}                 Le code-barres complet ou tableau de résultats.
 * @customfunction
 *
 *   =CLE_EAN13("304692002260") → "3046920022605"
 *   =CLE_EAN13(A2:A100)
 */
function CLE_EAN13(code12Chiffres) {
  try {
    return FF_LIB.CLE_EAN13(code12Chiffres);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CLE_EAN13', 'ERROR');
    throw e;
  }
}

/**
 * Calcule l'empreinte carbone d'un trajet en kgCO2e.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} km La distance ou plage.
 * @param {string} modeTransport Le mode ("voiture", "avion", "tgv", "bus", "velo").
 * @return {number|Array<Array<number>>}     Le poids en kg de CO2 équivalent ou tableau de résultats.
 * @customfunction
 *
 *   =CO2_TRANSPORT(500; "avion")
 *   =CO2_TRANSPORT(A2:A100; "voiture")
 */
function CO2_TRANSPORT(km, modeTransport) {
  try {
    return FF_LIB.CO2_TRANSPORT(km, modeTransport);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CO2_TRANSPORT', 'ERROR');
    throw e;
  }
}

/**
 * Estime le CO2 pour un vol entre deux aéroports (codes IATA).
 * @param {string} codeDep Code IATA de départ (ex: "CDG").
 * @param {string} codeArr Code IATA d'arrivée (ex: "JFK").
 * @return {number} Estimation en kgCO2e.
 * @customfunction
 */
function CO2_FLIGHT_ESTIMATOR(codeDep, codeArr) {
  try {
    return FF_LIB.CO2_FLIGHT_ESTIMATOR(codeDep, codeArr);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CO2_FLIGHT_ESTIMATOR', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le volume (en m3) ou le poids volumétrique.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} longueur Longueur ou plage.
 * @param {number} largeur Largeur.
 * @param {number} hauteur Hauteur.
 * @param {string} [unite="cm"] Unité de mesure ("cm" ou "m"). Par défaut "cm".
 * @param {boolean} [calculPoidsVol=false] Si VRAI, renvoie le poids volumétrique (base 5000).
 * @return {number|Array<Array<number>>}           Le résultat arrondi ou tableau de résultats.
 * @customfunction
 *
 *   =CALCUL_VOLUMETRIE(50; 40; 30; "cm"; FAUX)  → 0.06 (m3)
 *   =CALCUL_VOLUMETRIE(A2:A100; 40; 30)
 */
function CALCUL_VOLUMETRIE(longueur, largeur, hauteur, unite = "cm", calculPoidsVol = false) {
  try {
    return FF_LIB.CALCUL_VOLUMETRIE(longueur, largeur, hauteur, unite, calculPoidsVol);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CALCUL_VOLUMETRIE', 'ERROR');
    throw e;
  }
}

/**
 * Détermine le statut d'alerte du stock.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} stockActuel La quantité en stock ou plage.
 * @param {number} seuilMini Le seuil sous lequel il faut commander.
 * @param {number} [ventesParJour=0] Ventes moyennes par jour pour estimer la rupture.
 * @return {string|Array<Array<string>>}               Statut ou tableau de résultats.
 * @customfunction
 *
 *   =ALERTE_STOCK(15; 20; 2)
 *   =ALERTE_STOCK(A2:A100; 10)
 */
function ALERTE_STOCK(stockActuel, seuilMini, ventesParJour = 0) {
  try {
    return FF_LIB.ALERTE_STOCK(stockActuel, seuilMini, ventesParJour);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ALERTE_STOCK', 'ERROR');
    throw e;
  }
}

/**
 * Calcule la quantité économique de commande (Formule de Wilson).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} demandeAnnuelle Volume de ventes ou plage.
 * @param {number} coutCommande Coût passation commande.
 * @param {number} coutStockageUnitaire Coût possession unitaire.
 * @return {number|Array<Array<number>>}                La quantité optimale ou tableau.
 * @customfunction
 *
 *   =QUANTITE_OPTIMALE(10000; 50; 2)
 *   =QUANTITE_OPTIMALE(A2:A100; 50; 2)
 */
function QUANTITE_OPTIMALE(demandeAnnuelle, coutCommande, coutStockageUnitaire) {
  try {
    return FF_LIB.QUANTITE_OPTIMALE(demandeAnnuelle, coutCommande, coutStockageUnitaire);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: QUANTITE_OPTIMALE', 'ERROR');
    throw e;
  }
}

/**
 * Analyse la tonalité d'un texte français.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou plage.
 * @return {string|Array<Array<string>>}       Statut ou tableau de résultats.
 * @customfunction
 *
 *   =ANALYSE_SENTIMENT("C'est super !")
 *   =ANALYSE_SENTIMENT(A2:A100)
 */
function ANALYSE_SENTIMENT(texte) {
  try {
    return FF_LIB.ANALYSE_SENTIMENT(texte);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ANALYSE_SENTIMENT', 'ERROR');
    throw e;
  }
}

/**
 * Extrait et normalise un numéro de téléphone.
 * Supporte les formats français par défaut et internationaux (E.164).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou une plage de cellules.
 * @param {string} [pays='FR'] Code pays pour le formatage (ex: 'FR', 'US').
 * @return {string|Array<Array<string>>}       Le numéro formaté ou tableau de résultats.
 * @customfunction
 *
 *   =EXTRAIRE_TEL("Call +33612345678"; "FR") → "06 12 34 56 78"
 *   =EXTRAIRE_TEL(A2:A50)                    → [Tableau de résultats]
 */
function EXTRAIRE_TEL(texte, pays = 'FR') {
  try {
    return FF_LIB.EXTRAIRE_TEL(texte, pays);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: EXTRAIRE_TEL', 'ERROR');
    throw e;
  }
}

/**
 * Estime le temps de lecture d'un texte.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le contenu ou plage.
 * @param {number} [motsParMinute=250] Vitesse de lecture (250 mpm en moyenne).
 * @return {string|Array<Array<string>>}       Temps estimé ou tableau de résultats.
 * @customfunction
 *
 *   =ESTIMER_LECTURE(A2)
 *   =ESTIMER_LECTURE(A2:A100)
 */
function ESTIMER_LECTURE(texte, motsParMinute = 250) {
  try {
    return FF_LIB.ESTIMER_LECTURE(texte, motsParMinute);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ESTIMER_LECTURE', 'ERROR');
    throw e;
  }
}

/**
 * Génère l'URL d'un QR code pour un texte donné (via api.qrserver.com).
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} texte Le texte ou plage.
 * @param {number} [taille=200] Taille en pixels.
 * @return {string|Array<Array<string>>}        L'URL de l'image ou tableau.
 * @customfunction
 *
 *   =IMAGE(QR_CODE_URL("https://faucheux.bzh"))
 *   =IMAGE(QR_CODE_URL(A2:A100))
 */
function QR_CODE_URL(texte, taille = 200) {
  try {
    return FF_LIB.QR_CODE_URL(texte, taille);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: QR_CODE_URL', 'ERROR');
    throw e;
  }
}

/**
 * Enlève les paramètres de tracking superflus d'une URL LinkedIn.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} url L'URL LinkedIn brute ou plage.
 * @return {string|Array<Array<string>>}     L'URL propre ou tableau de résultats.
 * @customfunction
 *
 *   =CLEAN_LINKEDIN_URL("https://www.linkedin.com/in/jean-dupont-1234/?miniProfileUrn=urn:li:fs_miniProfile:123&trk=public_profile")
 *   → "https://www.linkedin.com/in/jean-dupont-1234"
 *   =CLEAN_LINKEDIN_URL(A2:A100)
 */
function CLEAN_LINKEDIN_URL(url) {
  try {
    return FF_LIB.CLEAN_LINKEDIN_URL(url);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CLEAN_LINKEDIN_URL', 'ERROR');
    throw e;
  }
}

/**
 * Calcule l'indice de lisibilité de Flesch (adapté au français).
 * Plus le score est élevé (proche de 100), plus le texte est facile à lire.
 *
 * @param {string|Array<Array<any>>} input Le texte à analyser ou une plage.
 * @return {number|Array<Array<number>>} Score de lisibilité (0 à 100+).
 * @customfunction
 */
function SEO_LISIBILITE_FLESCH(input) {
  try {
    return FF_LIB.SEO_LISIBILITE_FLESCH(input);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SEO_LISIBILITE_FLESCH', 'ERROR');
    throw e;
  }
}

/**
 * Calcule la densité d'un mot-clé dans un texte.
 *
 * @param {string|Array<Array<any>>} input Le texte à analyser ou une plage.
 * @param {string} motCle Le mot ou expression à chercher.
 * @return {number|Array<Array<number>>} Densité en pourcentage (ex: 0.02 pour 2%).
 * @customfunction
 */
function SEO_MOTS_CLES_DENSITE(input, motCle) {
  try {
    return FF_LIB.SEO_MOTS_CLES_DENSITE(input, motCle);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SEO_MOTS_CLES_DENSITE', 'ERROR');
    throw e;
  }
}

/**
 * Vérifie la structure sémantique d'une page (H1-H3, listes) pour le GEO.
 *
 * @param {string} urlOrHtml URL ou contenu HTML brut.
 * @return {string} Résumé de l'analyse structurelle.
 * @customfunction
 */
function GEO_STRUCTURE_CHECK(urlOrHtml) {
  try {
    return FF_LIB.GEO_STRUCTURE_CHECK(urlOrHtml);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: GEO_STRUCTURE_CHECK', 'ERROR');
    throw e;
  }
}

/**
 * Détecte la présence de schémas JSON-LD (Schema.org) dans une page.
 *
 * @param {string} url URL de la page à analyser.
 * @return {string} Liste des types de schémas détectés.
 * @customfunction
 */
function GEO_SCHEMA_DETECTOR(url) {
  try {
    return FF_LIB.GEO_SCHEMA_DETECTOR(url);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: GEO_SCHEMA_DETECTOR', 'ERROR');
    throw e;
  }
}

/**
 * Génère une URL avec des paramètres UTM d'Analytics.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {string|Array<Array<string>>} url URL de destination ou plage.
 * @param {string} source utm_source (ex: google, newsletter).
 * @param {string} support utm_medium (ex: cpc, email).
 * @param {string} campagne utm_campaign (ex: promo_ete).
 * @param {string} [terme] utm_term (Optionnel).
 * @param {string} [contenu] utm_content (Optionnel).
 * @return {string|Array<Array<string>>}     URL complète ou tableau de résultats.
 * @customfunction
 *
 *   =CONSTRUCTEUR_UTM("https://faucheux.bzh"; "linkedin"; "social"; "lancement")
 *   =CONSTRUCTEUR_UTM(A2:A100; "google"; "cpc"; "soldes")
 */
function CONSTRUCTEUR_UTM(url, source, support, campagne, terme = "", contenu = "") {
  try {
    return FF_LIB.CONSTRUCTEUR_UTM(url, source, support, campagne, terme, contenu);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: CONSTRUCTEUR_UTM', 'ERROR');
    throw e;
  }
}

/**
 * Retourne le statut du SLA par rapport à l'heure actuelle.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {Date|string|Array<Array<any>>} dateReception Date et heure ou plage.
 * @param {number} delaiMaxHeures Délai maximum en heures.
 * @return {string|Array<Array<string>>}                Statut ou tableau de résultats.
 * @customfunction
 *
 *   =SLA_STATUS(A2; 48)
 *   =SLA_STATUS(A2:A100; 24)
 */
function SLA_STATUS(dateReception, delaiMaxHeures) {
  try {
    return FF_LIB.SLA_STATUS(dateReception, delaiMaxHeures);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SLA_STATUS', 'ERROR');
    throw e;
  }
}

/**
 * Calcule le score d'un lead (sur 100) selon 3 critères.
 * Supporte le traitement par lot (plages de cellules).
 *
 * @param {number|Array<Array<number>>} budget Le budget ou plage.
 * @param {string} secteur Le secteur d'activité.
 * @param {string} source La source d'acquisition.
 * @return {string|Array<Array<string>>}         Score et qualification ou tableau de résultats.
 * @customfunction
 *
 *   =SCORE_LEAD(15000; "IT"; "Inbound")
 *   =SCORE_LEAD(A2:A100; "IT"; "Direct")
 */
function SCORE_LEAD(budget, secteur, source) {
  try {
    return FF_LIB.SCORE_LEAD(budget, secteur, source);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: SCORE_LEAD', 'ERROR');
    throw e;
  }
}

/**
 * Récupère le titre SEO d'une URL.
 * Supporte le traitement par lot, le cache et l'Exponential Backoff.
 *
 * @param {string|Array<Array<string>>} url L'URL ou une plage d'URLs.
 * @param {boolean} [bypassCache=false] Si vrai, ignore le cache et force un nouvel appel.
 * @return {string|Array<Array<string>>}       Le contenu de la balise <title> ou tableau de résultats.
 * @customfunction
 *
 *   =EXTRACT_TITLE_TAG("https://faucheux.bzh")
 *   =EXTRACT_TITLE_TAG(A2:A50; VRAI) // Force le rafraîchissement
 */
function EXTRACT_TITLE_TAG(url, bypassCache = false) {
  try {
    return FF_LIB.EXTRACT_TITLE_TAG(url, bypassCache);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: EXTRACT_TITLE_TAG', 'ERROR');
    throw e;
  }
}

/**
 * Envoie un email stylisé Material Design 3.
 *
 * @param {string} to          Destinataire(s) (séparés par des virgules).
 * @param {string} subject     Objet de l'email.
 * @param {string} body        Corps du message (supporte le HTML simple).
 * @param {Object} [options]   Options d'envoi.
 * @param {string} [options.cc]        Destinataires en copie.
 * @param {string} [options.bcc]       Destinataires en copie cachée.
 * @param {boolean} [options.noReply]  Si VRAI, utilise une adresse no-reply (si dispo).
 * @param {string} [options.type="INFO"] Type d'email : "INFO", "VIGILANCE", "ALERTE".
 * @param {string} [options.footer]    Texte personnalisé pour le pied de page.
 * @param {Object} [options.button]    { text: string, url: string } - Bouton d'action.
 * @param {string} [options.logoUrl]   URL de l'image du logo (Header).
 * @param {Blob[]} [options.attachments] Liste des pièces jointes.
 * @return {string}                    Message de confirmation ou d'erreur.
 * @customfunction
 */
function ENVOYER_EMAIL(to, subject, body, options = {}) {
  try {
    return FF_LIB.ENVOYER_EMAIL(to, subject, body, options);
  } catch (e) {
    FF_LIB.LOG_ERREUR(e.message, 'Relais: ENVOYER_EMAIL', 'ERROR');
    throw e;
  }
}
