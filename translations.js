// translations.js

export const translations = {
    fr: {
        viewPdf: "Voir PDF",
        downloadPdf: "Télécharger PDF",
        viewTutorial: "Voir le tutoriel",
        playAudio: "Jouer l'audio",
        stopAudio: "Arrêter l'audio",
        searchPlaceholder: "Rechercher une chanson ou un artiste",
        searchButton: "Rechercher",
        noResults: "Aucun résultat trouvé",
        errorLoading: "Erreur lors du chargement des chansons",
        retry: "Réessayer",
        loading: "Chargement...",
        prevPage: "Page précédente",
        nextPage: "Page suivante",
        closePdf: "Fermer le PDF"
    },
    en: {
        viewPdf: "View PDF",
        downloadPdf: "Download PDF",
        viewTutorial: "View Tutorial",
        playAudio: "Play Audio",
        stopAudio: "Stop Audio",
        searchPlaceholder: "Search for a song or artist",
        searchButton: "Search",
        noResults: "No results found",
        errorLoading: "Error loading songs",
        retry: "Retry",
        loading: "Loading...",
        prevPage: "Previous Page",
        nextPage: "Next Page",
        closePdf: "Close PDF"
    }
};

let currentLanguage = 'fr';

export function setLanguage(lang) {
    currentLanguage = lang;
}

export function translate(key, lang = currentLanguage) {
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    console.warn(`Translation not found for key "${key}" in language "${lang}"`);
    return key;
}
