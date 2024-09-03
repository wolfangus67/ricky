export const translations = {
    'fr': {
        'title': 'Tablatures Ukulélé',
        'viewPdf': 'Voir la tablature PDF',
        'viewTutorial': 'Voir le tuto',
        'playAudio': 'Lecture',
        'stopAudio': 'Stop',
        'searchPlaceholder': 'Rechercher une chanson ou un artiste',
        'searchButton': 'Rechercher',
        'prevPage': 'Page précédente',
        'nextPage': 'Page suivante',
        'close': 'Fermer',
        'pageOf': 'Page {current} sur {total}'
    },
    'en': {
        'title': 'Ukulele Tabs',
        'viewPdf': 'View PDF Tab',
        'viewTutorial': 'View Tutorial',
        'playAudio': 'Play',
        'stopAudio': 'Stop',
        'searchPlaceholder': 'Search for a song or artist',
        'searchButton': 'Search',
        'prevPage': 'Previous Page',
        'nextPage': 'Next Page',
        'close': 'Close',
        'pageOf': 'Page {current} of {total}'
    },
    'es': {
        'title': 'Tablaturas de Ukulele',
        'viewPdf': 'Ver tablatura PDF',
        'viewTutorial': 'Ver tutorial',
        'playAudio': 'Reproducir',
        'stopAudio': 'Detener',
        'searchPlaceholder': 'Buscar una canción o artista',
        'searchButton': 'Buscar',
        'prevPage': 'Página anterior',
        'nextPage': 'Página siguiente',
        'close': 'Cerrar',
        'pageOf': 'Página {current} de {total}'
    }
};

export function setLanguage(lang) {
    const elementsToTranslate = {
        'main-title': 'title',
        'search-input': 'searchPlaceholder',
        'search-button': 'searchButton',
        'prev-page': 'prevPage',
        'next-page': 'nextPage',
        'close-pdf': 'close'
    };

    Object.entries(elementsToTranslate).forEach(([elementId, translationKey]) => {
        const element = document.getElementById(elementId);
        if (element) {
            if (elementId === 'search-input') {
                element.setAttribute('placeholder', translations[lang][translationKey]);
            } else {
                element.textContent = translations[lang][translationKey];
            }
        }
    });

    document.querySelectorAll('.view-pdf').forEach(button => {
        button.textContent = translations[lang].viewPdf;
    });
    document.querySelectorAll('.view-tutorial').forEach(button => {
        button.textContent = translations[lang].viewTutorial;
    });
    document.querySelectorAll('.play-audio').forEach(button => {
        if (button.textContent === translations[lang].stopAudio) {
            button.textContent = translations[lang].stopAudio;
        } else {
            button.textContent = translations[lang].playAudio;
        }
    });
}

export function translate(key, lang = 'fr') {
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    return key; // Retourne la clé si aucune traduction n'est trouvée
}
