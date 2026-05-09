/*
 * ════════════════════════════════════════════════════════════════════════════
 *  Générateur de mot de passe — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-07
 *  Licence : MIT
 *
 *  Description :
 *    Génère un mot de passe aléatoire de longueur personnalisable avec
 *    des options pour inclure des majuscules, nombres et caractères spéciaux.
 *
 *  Fonctions exposées :
 *    • GENERER_MOT_DE_PASSE(longueur, majuscules, nombres, speciaux)
 *
 *  Runtime : V8 (ES6+)
 * ════════════════════════════════════════════════════════════════════════════
 * @OnlyCurrentDoc
 */

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
  return BATCH_PROCESS(longueur, (val) => {
    let charSet = "abcdefghijklmnopqrstuvwxyz";
    const numSet = "0123456789";
    const upperSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specSet = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (majuscules) charSet += upperSet;
    if (nombres) charSet += numSet;
    if (speciaux) charSet += specSet;

    let password = "";
    const len = parseInt(val, 10) || 12;
    
    // Garantir au moins un caractère de chaque type demandé
    if (majuscules) password += upperSet[Math.floor(Math.random() * upperSet.length)];
    if (nombres) password += numSet[Math.floor(Math.random() * numSet.length)];
    if (speciaux) password += specSet[Math.floor(Math.random() * specSet.length)];
    
    const resteLong = Math.max(0, len - password.length);
    
    for (let i = 0; i < resteLong; i++) {
      password += charSet[Math.floor(Math.random() * charSet.length)];
    }

    // Mélanger le mot de passe
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  });
}
