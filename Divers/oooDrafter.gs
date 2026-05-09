/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Productivité & Calendrier — Google Apps Script
 * ────────────────────────────────────────────────────────────────────────────
 *  Auteur  : Fabrice Faucheux
 *  Version : 1.0
 *  Date    : 2026-05-09
 *
 *  Description :
 *    Génère des brouillons de réponses automatiques (OOO).
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Analyse le calendrier et suggère un message d'absence (OOO).
 * @return {string} Brouillon de message d'absence.
 * @customfunction
 */
function CALENDAR_OOO_DRAFTER() {
  try {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    
    // On cherche le prochain événement "OOO" ou "Congés"
    const events = CalendarApp.getDefaultCalendar().getEvents(now, endOfYear, {search: 'OOO'});
    if (events.length === 0) return "📅 Aucun événement OOO détecté prochainement.";

    const nextOOO = events[0];
    const debut = nextOOO.getStartTime();
    const fin = nextOOO.getEndTime();
    
    // Calcul du jour de retour (prochain jour ouvré après la fin)
    const retour = new Date(fin);
    retour.setDate(retour.getDate() + 1);
    
    // On boucle jusqu'au prochain jour ouvré (via notre utilitaire joursOuvres s'il était accessible ici, 
    // ou on implémente une version simplifiée)
    while (retour.getDay() === 0 || retour.getDay() === 6 || estJourFerieFR(retour) === true) {
      retour.setDate(retour.getDate() + 1);
    }

    const msg = `Bonjour,\n\nJe suis absent du ${debut.toLocaleDateString()} au ${fin.toLocaleDateString()}.\n` +
                `Je prendrai connaissance de votre message à mon retour le ${retour.toLocaleDateString()}.\n\n` +
                `Cordialement.`;
    
    return msg;
  } catch (e) {
    return "❌ Erreur Calendrier : " + e.message;
  }
}
