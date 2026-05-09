/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Extraction des Jours Fériés — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-08
 *  Licence : MIT
 *
 *  Description :
 *    Calcule et génère la liste complète des jours fériés français pour une
 *    année donnée, incluant les jours fixes et les jours mobiles (Pâques,
 *    Ascension, Pentecôte) via l'algorithme de Meeus.
 *
 *  Fonctions exposées :
 *    • JOURS_FERIES(annee)            → Liste 2 colonnes (Date, Nom)
 *    • JOURS_FERIES_AVEC_JOUR(annee)  → Liste 3 colonnes (Date, Jour, Nom)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

const cacheFeries = new Map();

/**
 * Calcule le dimanche de Pâques selon l'algorithme de Meeus.
 */
const calculerPaques = (annee) => {
    const a = annee % 19;
    const b = Math.floor(annee / 100);
    const c = annee % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n = h + l - 7 * m + 114;
    const mois = Math.floor(n / 31);
    const jour = (n % 31) + 1;
    return new Date(annee, mois - 1, jour);
};

/**
 * Retourne une Map triée contenant tous les jours fériés pour une année donnée.
 */
const obtenirFeries = (annee) => {
    if (cacheFeries.has(annee)) return cacheFeries.get(annee);

    const f = new Map();
    const tz = Session.getScriptTimeZone();
    const ajouter = (d, l) => f.set(Utilities.formatDate(d, tz, "yyyy-MM-dd"), l);

    // Ajout des jours fixes avec la typographie française standard
    ajouter(new Date(annee, 0, 1), "Jour de l'an");
    ajouter(new Date(annee, 4, 1), "Fête du travail");
    ajouter(new Date(annee, 4, 8), "Victoire 1945");
    ajouter(new Date(annee, 6, 14), "Fête nationale");
    ajouter(new Date(annee, 7, 15), "Assomption");
    ajouter(new Date(annee, 10, 1), "Toussaint");
    ajouter(new Date(annee, 10, 11), "Armistice 1918");
    ajouter(new Date(annee, 11, 25), "Noël");

    // Ajout des jours mobiles
    const p = calculerPaques(annee);
    const msJour = 86400000;
    ajouter(new Date(p.getTime() + msJour), "Lundi de Pâques");
    ajouter(new Date(p.getTime() + 39 * msJour), "Ascension");
    ajouter(new Date(p.getTime() + 50 * msJour), "Lundi de Pentecôte");

    // Tri par date croissante
    const fTrie = new Map([...f.entries()].sort((a, b) => a[0].localeCompare(b[0])));

    cacheFeries.set(annee, fTrie);
    return fTrie;
};

/**
 * Affiche la liste des jours fériés d'une année sur 2 colonnes (Date | Nom).
 *
 * @param {number} annee L'année souhaitée (ex: 2026).
 * @return Un tableau contenant les dates et les noms des jours fériés.
 * @customfunction
 */
function JOURS_FERIES(annee) {
    const anneeCible = annee ? parseInt(annee, 10) : new Date().getFullYear();
    const feriesMap = obtenirFeries(anneeCible);

    return Array.from(feriesMap.entries()).map(([dateStr, nom]) => {
        const [y, m, d] = dateStr.split('-');
        const dateObjet = new Date(y, m - 1, d, 12, 0, 0);
        return [dateObjet, nom];
    });
}

/**
 * Affiche la liste des jours fériés d'une année sur 3 colonnes (Date | Jour | Nom).
 *
 * @param {number} annee L'année souhaitée (ex: 2026).
 * @return Un tableau avec la date, le jour de la semaine et le nom du jour férié.
 * @customfunction
 */
function JOURS_FERIES_AVEC_JOUR(annee) {
    const anneeCible = annee ? parseInt(annee, 10) : new Date().getFullYear();
    const feriesMap = obtenirFeries(anneeCible);

    const options = { weekday: 'long' };
    const formateurJour = new Intl.DateTimeFormat('fr-FR', options);

    return Array.from(feriesMap.entries()).map(([dateStr, nomFerie]) => {
        const [y, m, d] = dateStr.split('-');
        const dateObjet = new Date(y, m - 1, d, 12, 0, 0);

        let nomJour = formateurJour.format(dateObjet);
        nomJour = nomJour.charAt(0).toUpperCase() + nomJour.slice(1);

        return [dateObjet, nomJour, nomFerie];
    });
}