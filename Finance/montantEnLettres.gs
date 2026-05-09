/*
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
 * @OnlyCurrentDoc
 */

const LOCALES_CONFIG_ = {
  FR: {
    unites: ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"],
    dizaines: ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"],
    echelles: ["", "mille", "million", "milliard", "billion"],
    zero: "zéro", and: "et", minus: "moins",
    deviseDefault: "euro", centimesDefault: "centime"
  },
  EN: {
    unites: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
    dizaines: ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
    echelles: ["", "thousand", "million", "billion", "trillion"],
    zero: "zero", and: "and", minus: "minus",
    deviseDefault: "dollar", centimesDefault: "cent"
  }
};

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
 *   =montantEnLettres(1234.56; "FR") → "mille deux cent trente-quatre euros et cinquante-six centimes"
 *   =montantEnLettres(1234.56; "EN") → "one thousand two hundred thirty-four dollars and fifty-six cents"
 */
function montantEnLettres(nombre, langue = "FR", devise, nomCentimes) {
  return batchProcess(nombre, (val) => {
    if (val == null || val === "") return "";

    const lang = langue.toUpperCase() === "EN" ? "EN" : "FR";
    const cfg = LOCALES_CONFIG_[lang];
    const dev = devise || cfg.deviseDefault;
    const cent = nomCentimes || cfg.centimesDefault;

    const num = parseFloat(String(val).replace(",", "."));
    if (isNaN(num)) return "Erreur: n'est pas un nombre";

    if (num === 0) return `${cfg.zero} ${dev}s`;

    let partieEntiere = Math.floor(Math.abs(num));
    let partieDecimale = Math.round((Math.abs(num) - partieEntiere) * 100);

    let resultat = (lang === "FR") ? entierEnLettresFR_(partieEntiere) : entierEnLettresEN_(partieEntiere);

    // Gestion des pluriels pour la devise
    if (partieEntiere === 0) {
      resultat = `${cfg.zero} ${dev}s`;
    } else if (partieEntiere === 1) {
      resultat += ` ${dev}`;
    } else {
      if (lang === "FR" && (resultat.endsWith("million") || resultat.endsWith("millions") || resultat.endsWith("milliard") || resultat.endsWith("milliards"))) {
        resultat += ` d'${dev}s`;
      } else {
        resultat += ` ${dev}s`;
      }
    }

    if (partieDecimale > 0) {
      let decLettres = (lang === "FR") ? entierEnLettresFR_(partieDecimale) : entierEnLettresEN_(partieDecimale);
      resultat += ` ${cfg.and} ${decLettres} ${cent}${partieDecimale > 1 ? "s" : ""}`;
    }

    if (num < 0) resultat = cfg.minus + " " + resultat;

    return resultat.trim().replace(/\s+/g, " ");
  });
}

/**
 * Logique française pour conversion d'entier.
 * @private
 */
function entierEnLettresFR_(n) {
  if (n === 0) return "zéro";
  const cfg = LOCALES_CONFIG_.FR;
  let mots = [];
  let echelleIdx = 0;

  while (n > 0) {
    let bloc = n % 1000;
    n = Math.floor(n / 1000);
    if (bloc > 0) {
      let blocMots = blocEnLettresFR_(bloc);
      if (echelleIdx > 0) {
        if (echelleIdx === 1 && bloc === 1) {
          blocMots = "mille";
        } else {
          let nomEchelle = cfg.echelles[echelleIdx];
          if (bloc > 1 && echelleIdx > 1) nomEchelle += "s";
          blocMots += " " + nomEchelle;
        }
      }
      mots.unshift(blocMots);
    }
    echelleIdx++;
  }
  return mots.join(" ");
}

/** @private */
function blocEnLettresFR_(n) {
  const cfg = LOCALES_CONFIG_.FR;
  let c = Math.floor(n / 100), d = Math.floor((n % 100) / 10), u = n % 10;
  let res = "";
  if (c === 1) res += "cent ";
  else if (c > 1) {
    res += cfg.unites[c] + " cent ";
    if (d === 0 && u === 0) res = res.trim() + "s ";
  }
  let reste = d * 10 + u;
  if (reste === 0) return res.trim();
  if (reste < 20) res += cfg.unites[reste];
  else {
    let dizaineMot = cfg.dizaines[d];
    if (d === 7 || d === 9) { dizaineMot = cfg.dizaines[d - 1]; u += 10; }
    res += dizaineMot;
    if (u === 1 || u === 11) {
       if (d !== 8 && d !== 9) res += " et " + cfg.unites[u];
       else res += "-" + cfg.unites[u];
    } else if (u > 0) res += "-" + cfg.unites[u];
    if (d === 8 && u === 0) res += "s";
  }
  return res.trim();
}

/**
 * Logique anglaise pour conversion d'entier.
 * @private
 */
function entierEnLettresEN_(n) {
  if (n === 0) return "zero";
  const cfg = LOCALES_CONFIG_.EN;
  let mots = [];
  let echelleIdx = 0;

  while (n > 0) {
    let bloc = n % 1000;
    n = Math.floor(n / 1000);
    if (bloc > 0) {
      let blocMots = blocEnLettresEN_(bloc);
      if (echelleIdx > 0) blocMots += " " + cfg.echelles[echelleIdx];
      mots.unshift(blocMots);
    }
    echelleIdx++;
  }
  return mots.join(" ");
}

/** @private */
function blocEnLettresEN_(n) {
  const cfg = LOCALES_CONFIG_.EN;
  let c = Math.floor(n / 100), d = Math.floor((n % 100) / 10), u = n % 10;
  let res = "";
  if (c > 0) res += cfg.unites[c] + " hundred ";
  let reste = d * 10 + u;
  if (reste === 0) return res.trim();
  if (c > 0) res += "and ";
  if (reste < 20) res += cfg.unites[reste];
  else {
    res += cfg.dizaines[d];
    if (u > 0) res += "-" + cfg.unites[u];
  }
  return res.trim();
}
