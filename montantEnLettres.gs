/** @OnlyCurrentDoc */

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Montant en lettres — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Convertit un nombre en toutes lettres (en français).
 *    Gère les nombres jusqu'au billion.
 *    Parfait pour l'édition de factures ou de chèques.
 *
 *  Fonctions exposées :
 *    • montantEnLettres(nombre, [devise], [centimes])  → montant en toutes lettres
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 */

const UNITES_ = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const DIZAINES_ = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];
const ECHELLES_ = ["", "mille", "million", "milliard", "billion"];

/**
 * Convertit un nombre en toutes lettres.
 *
 * @param {number|string} nombre   Le nombre à convertir.
 * @param {string} [devise]        La devise principale (ex: "euro", "dollar"). Par défaut "euro".
 * @param {string} [nomCentimes]   Le nom de la sous-devise (ex: "centime", "cent"). Par défaut "centime".
 * @return {string}                Le nombre en lettres.
 * @customfunction
 *
 * @example
 *   =montantEnLettres(1234.56)  → "mille deux cent trente-quatre euros et cinquante-six centimes"
 */
function montantEnLettres(nombre, devise = "euro", nomCentimes = "centime") {
  if (nombre == null || nombre === "") return "";

  const num = parseFloat(String(nombre).replace(",", "."));
  if (isNaN(num)) return "Erreur: n'est pas un nombre";

  if (num === 0) return `zéro ${devise}s`;

  let partieEntiere = Math.floor(Math.abs(num));
  let partieDecimale = Math.round((Math.abs(num) - partieEntiere) * 100);

  let resultat = entierEnLettres_(partieEntiere);

  // Gestion des pluriels pour la devise
  if (partieEntiere === 0) {
    resultat = `zéro ${devise}s`; // convention courante
  } else if (partieEntiere === 1) {
    resultat += ` ${devise}`;
  } else {
    // Cas particulier : si le montant se termine par un million/milliard sans unités, on ajoute "d'" (ex: un million d'euros)
    if (resultat.endsWith("million") || resultat.endsWith("millions") || 
        resultat.endsWith("milliard") || resultat.endsWith("milliards")) {
       resultat += ` d'${devise}s`;
    } else {
       resultat += ` ${devise}s`;
    }
  }

  if (partieDecimale > 0) {
    let decLettres = entierEnLettres_(partieDecimale);
    resultat += ` et ${decLettres} ${nomCentimes}${partieDecimale > 1 ? "s" : ""}`;
  }

  // Gérer le signe négatif
  if (num < 0) {
    resultat = "moins " + resultat;
  }

  return resultat.trim();
}

/**
 * Fonction récursive pour convertir un entier en lettres (0 à 999 999 999 999).
 * @private
 */
function entierEnLettres_(n) {
  if (n === 0) return "zéro";

  let mots = [];
  let echelleIdx = 0;

  while (n > 0) {
    let bloc = n % 1000;
    n = Math.floor(n / 1000);

    if (bloc > 0) {
      let blocMots = blocEnLettres_(bloc);
      
      if (echelleIdx > 0) {
        if (echelleIdx === 1 && bloc === 1) {
          // Cas spécial "mille" (on ne dit pas "un mille")
          blocMots = "mille";
        } else {
          let nomEchelle = ECHELLES_[echelleIdx];
          // Pluriel pour millions/milliards (pas pour mille)
          if (bloc > 1 && echelleIdx > 1) {
            nomEchelle += "s";
          }
          blocMots += " " + nomEchelle;
        }
      }
      
      // On insère au début car on traite de droite à gauche
      if (blocMots !== "") {
          mots.unshift(blocMots);
      }
    }
    echelleIdx++;
  }

  return mots.join(" ").replace(/\s+/g, " ");
}

/**
 * Convertit un bloc de 3 chiffres (0-999) en lettres.
 * @private
 */
function blocEnLettres_(n) {
  let c = Math.floor(n / 100);
  let d = Math.floor((n % 100) / 10);
  let u = n % 10;
  
  let res = "";

  // Centaines
  if (c === 1) {
    res += "cent ";
  } else if (c > 1) {
    res += UNITES_[c] + " cent ";
    // Si la centaine est ronde (ex: 200), on ajoute un "s" à "cents" (sauf si suivi d'autre chose, géré plus bas)
    if (d === 0 && u === 0) {
      res = res.trim() + "s ";
    }
  }

  // Dizaines et Unités
  let reste = d * 10 + u;

  if (reste === 0) {
    return res.trim();
  }

  if (reste < 20) {
    res += UNITES_[reste];
  } else {
    let dizaineMot = DIZAINES_[d];
    
    // Cas spécifiques (70, 90)
    if (d === 7 || d === 9) {
      dizaineMot = DIZAINES_[d - 1];
      u += 10;
    }

    res += dizaineMot;

    // Et un (ex: vingt et un)
    if (u === 1 || u === 11) {
       // Sauf quatre-vingt-un et quatre-vingt-onze
       if (d !== 8 && d !== 9) {
           res += " et ";
           res += UNITES_[u];
       } else {
           res += "-" + UNITES_[u];
       }
    } else if (u > 0) {
      res += "-" + UNITES_[u];
    }
    
    // Pluriel de quatre-vingt
    if (d === 8 && u === 0) {
        res += "s";
    }
  }

  return res.trim();
}
