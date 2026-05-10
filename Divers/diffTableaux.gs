/*
 * ════════════════════════════════════════════════════════════════════════════
 * Diff Tableaux — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 * Auteur  : Fabrice Faucheux
 * Version : 1.0
 * Date    : 2026-05-10
 * Licence : MIT
 *
 * Description :
 * Compare deux plages de données et retourne les lignes qui ont été
 * ajoutées, supprimées ou modifiées entre la version A (référence) et
 * la version B (courante). Idéal pour auditer des exports, comparer
 * deux snapshots d'un CRM, d'un stock ou d'une liste RH.
 *
 * La comparaison s'appuie sur une colonne-clé (ex : ID, email, SIRET)
 * qui identifie chaque ligne de façon unique.
 *
 * Fonctions exposées :
 *   • DIFF_TABLEAUX(plageA, plageB, colonnesCles, afficherInchangees)
 *
 * Résultat retourné (tableau) :
 *   [Statut | Clé | Col1_A | Col1_B | Col2_A | Col2_B | ...]
 *   Statut ∈ { "➕ AJOUTÉ", "🗑️ SUPPRIMÉ", "✏️ MODIFIÉ", "✅ IDENTIQUE" }
 *
 * Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

/**
 * Compare deux plages et retourne les lignes ajoutées, supprimées ou modifiées.
 *
 * La première ligne de chaque plage doit contenir les en-têtes de colonnes.
 * Les deux plages doivent avoir le même nombre de colonnes.
 *
 * @param {Array<Array<any>>} plageA       Plage de référence (ancienne version), en-têtes inclus.
 * @param {Array<Array<any>>} plageB       Plage courante (nouvelle version), en-têtes inclus.
 * @param {number}            [colonnesCles=1]  Index (1-indexé) de la/des colonne(s) servant de clé unique.
 *                                              Pour plusieurs clés, séparer par ";" (ex: "1;3").
 * @param {boolean}           [afficherInchangees=false] Si VRAI, inclut aussi les lignes identiques.
 * @return {Array<Array<any>>} Tableau différentiel avec en-tête et statut par ligne.
 * @customfunction
 *
 * @example
 * // Comparer deux versions d'un export clients (clé = colonne 1 = ID)
 * =DIFF_TABLEAUX(Feuille1!A1:D100; Feuille2!A1:D200; 1; FAUX)
 *
 * @example
 * // Clé composite : ID + Email (colonnes 1 et 2)
 * =DIFF_TABLEAUX(A1:E50; G1:K80; "1;2"; FAUX)
 *
 * @example
 * // Inclure les lignes inchangées pour un rapport complet
 * =DIFF_TABLEAUX(A1:D100; F1:I150; 1; VRAI)
 */
function DIFF_TABLEAUX(plageA, plageB, colonnesCles = 1, afficherInchangees = false) {

    // ── Validation des entrées ──────────────────────────────────────────────
    if (!plageA || !Array.isArray(plageA) || plageA.length < 2) {
        return [["ERREUR — plageA vide ou manquante (minimum 1 en-tête + 1 ligne de données)"]];
    }
    if (!plageB || !Array.isArray(plageB) || plageB.length < 2) {
        return [["ERREUR — plageB vide ou manquante (minimum 1 en-tête + 1 ligne de données)"]];
    }

    const nbColA = plageA[0].length;
    const nbColB = plageB[0].length;

    if (nbColA !== nbColB) {
        return [[
            `ERREUR — Les deux plages n'ont pas le même nombre de colonnes (A: ${nbColA}, B: ${nbColB})`
        ]];
    }

    // ── Parsing de la/des colonne(s) clé(s) (1-indexé → 0-indexé) ─────────
    const indexesCles = parseCles_(colonnesCles, nbColA);
    if (typeof indexesCles === "string") return [[indexesCles]]; // message d'erreur

    // ── Extraction des en-têtes et des données ──────────────────────────────
    const enTetesA = plageA[0].map(h => String(h).trim());
    const donneesA = plageA.slice(1);
    const donneesB = plageB.slice(1);

    // ── Construction des Maps indexées par clé composite ───────────────────
    const mapA = construireMap_(donneesA, indexesCles);
    const mapB = construireMap_(donneesB, indexesCles);

    // ── Construction de l'en-tête du résultat ──────────────────────────────
    // Format : Statut | Clé | Col1_A | Col1_B | Col2_A | Col2_B | ...
    // Les colonnes-clés ne sont affichées qu'une fois (colonne "Clé")
    const colonnesData = enTetesA.filter((_, i) => !indexesCles.includes(i));
    const enTeteResultat = ["Statut", "Clé (identifiant)"];
    colonnesData.forEach(col => {
        enTeteResultat.push(`${col} [Réf A]`);
        enTeteResultat.push(`${col} [Actuel B]`);
    });

    // ── Comparaison ─────────────────────────────────────────────────────────
    const resultats = [enTeteResultat];
    const clesTreatees = new Set();

    // Parcourir toutes les clés de A
    for (const [cle, ligneA] of mapA.entries()) {
        clesTreatees.add(cle);

        if (!mapB.has(cle)) {
            // Ligne présente dans A mais absente de B → SUPPRIMÉE
            resultats.push(
                construireLigneResultat_("🗑️ SUPPRIMÉ", cle, ligneA, null, indexesCles, nbColA)
            );
            continue;
        }

        const ligneB = mapB.get(cle);
        const estIdentique = lignesIdentiques_(ligneA, ligneB);

        if (estIdentique) {
            if (afficherInchangees) {
                resultats.push(
                    construireLigneResultat_("✅ IDENTIQUE", cle, ligneA, ligneB, indexesCles, nbColA)
                );
            }
        } else {
            // Ligne présente dans A et B mais différente → MODIFIÉE
            resultats.push(
                construireLigneResultat_("✏️ MODIFIÉ", cle, ligneA, ligneB, indexesCles, nbColA)
            );
        }
    }

    // Parcourir les clés de B absentes de A → AJOUTÉES
    for (const [cle, ligneB] of mapB.entries()) {
        if (!clesTreatees.has(cle)) {
            resultats.push(
                construireLigneResultat_("➕ AJOUTÉ", cle, null, ligneB, indexesCles, nbColA)
            );
        }
    }

    // ── Tri du résultat : SUPPRIMÉ → MODIFIÉ → AJOUTÉ → IDENTIQUE ──────────
    const ordre = { "🗑️ SUPPRIMÉ": 0, "✏️ MODIFIÉ": 1, "➕ AJOUTÉ": 2, "✅ IDENTIQUE": 3 };
    const enTeteLigne = resultats.shift(); // retirer l'en-tête avant le tri
    resultats.sort((a, b) => (ordre[a[0]] ?? 9) - (ordre[b[0]] ?? 9));
    resultats.unshift(enTeteLigne); // remettre l'en-tête en premier

    // ── Résumé statistique ajouté en bas ────────────────────────────────────
    const stats = calculerStats_(resultats.slice(1)); // slice(1) pour ignorer l'en-tête
    const ligneVide = new Array(enTeteResultat.length).fill("");
    resultats.push(ligneVide);
    resultats.push([
        `📊 Résumé : ${stats.ajoutes} ajouté(s) · ${stats.supprimes} supprimé(s) · ` +
        `${stats.modifies} modifié(s) · ${stats.identiques} identique(s) · ` +
        `${stats.total} ligne(s) comparée(s)`,
        ...new Array(enTeteResultat.length - 1).fill("")
    ]);

    return resultats;
}

// ════════════════════════════════════════════════════════════════════════════
// Fonctions privées (helpers)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Parse le paramètre colonnesCles (nombre ou chaîne "1;3") en tableau d'index 0-indexés.
 * @private
 * @param {number|string} colonnesCles
 * @param {number} nbCols
 * @returns {number[]|string} tableau d'index ou message d'erreur
 */
function parseCles_(colonnesCles, nbCols) {
    let indices;

    if (typeof colonnesCles === "number") {
        indices = [Math.round(colonnesCles) - 1];
    } else {
        const parties = String(colonnesCles).split(";").map(s => parseInt(s.trim(), 10) - 1);
        if (parties.some(isNaN)) {
            return `ERREUR — colonnesCles invalide : "${colonnesCles}". Exemples valides : 1  ou  "1;3"`;
        }
        indices = parties;
    }

    for (const idx of indices) {
        if (idx < 0 || idx >= nbCols) {
            return `ERREUR — colonnesCles hors bornes : index ${idx + 1} (plage a ${nbCols} colonnes)`;
        }
    }

    return indices;
}

/**
 * Construit une Map { cléComposite → ligneArray } à partir d'un tableau de données.
 * @private
 */
function construireMap_(donnees, indexesCles) {
    const map = new Map();
    for (const ligne of donnees) {
        // Ignorer les lignes complètement vides
        if (ligne.every(c => c === "" || c === null || c === undefined)) continue;
        const cle = indexesCles.map(i => String(ligne[i] ?? "").trim()).join(" | ");
        if (cle.replace(/\|/g, "").trim() === "") continue; // clé vide = ligne ignorée
        map.set(cle, ligne);
    }
    return map;
}

/**
 * Vérifie si deux lignes sont identiques cellule par cellule.
 * @private
 */
function lignesIdentiques_(ligneA, ligneB) {
    if (!ligneA || !ligneB) return false;
    if (ligneA.length !== ligneB.length) return false;
    return ligneA.every((val, i) => normaliserValeur_(val) === normaliserValeur_(ligneB[i]));
}

/**
 * Normalise une valeur pour la comparaison (dates, nombres, textes).
 * @private
 */
function normaliserValeur_(val) {
    if (val instanceof Date) return val.getTime();
    if (typeof val === "number") return val;
    return String(val ?? "").trim().toLowerCase();
}

/**
 * Construit une ligne du tableau résultat.
 * @private
 * @param {string} statut       Emoji + libellé du statut
 * @param {string} cle          Clé composite affichée
 * @param {Array}  ligneA       Ligne de la plage A (null si AJOUTÉ)
 * @param {Array}  ligneB       Ligne de la plage B (null si SUPPRIMÉ)
 * @param {number[]} indexesCles Index (0-indexés) des colonnes-clés
 * @param {number} nbCols        Nombre total de colonnes
 */
function construireLigneResultat_(statut, cle, ligneA, ligneB, indexesCles, nbCols) {
    const ligne = [statut, cle];

    for (let i = 0; i < nbCols; i++) {
        if (indexesCles.includes(i)) continue; // les colonnes-clés sont déjà dans "Clé"

        let valA = ligneA ? (ligneA[i] ?? "") : "—";
        let valB = ligneB ? (ligneB[i] ?? "") : "—";

        // Marquage visuel des changements si la ligne est modifiée
        if (statut.includes("MODIFIÉ") && ligneA && ligneB) {
            if (normaliserValeur_(valA) !== normaliserValeur_(valB)) {
                valB = `⚠️ ${valB}`;
            }
        }

        ligne.push(valA);
        ligne.push(valB);
    }

    return ligne;
}

/**
 * Calcule les statistiques de synthèse à partir des lignes de résultat.
 * @private
 */
function calculerStats_(lignes) {
    const stats = { ajoutes: 0, supprimes: 0, modifies: 0, identiques: 0, total: 0 };
    for (const ligne of lignes) {
        if (!ligne || !ligne[0]) continue;
        const statut = String(ligne[0]);
        if (statut.includes("AJOUTÉ")) stats.ajoutes++;
        if (statut.includes("SUPPRIMÉ")) stats.supprimes++;
        if (statut.includes("MODIFIÉ")) stats.modifies++;
        if (statut.includes("IDENTIQUE")) stats.identiques++;
    }
    stats.total = stats.ajoutes + stats.supprimes + stats.modifies + stats.identiques;
    return stats;
}