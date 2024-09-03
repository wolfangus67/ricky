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
    document.getElementById('main-title').textContent = translations[lang].title;
    document.getElementById('search-input').setAttribute('placeholder', translations[lang].searchPlaceholder);
    document.getElementById('search-button').textContent = translations[lang].searchButton;
    document.getElementById('prev-page').textContent = translations[lang].prevPage;
    document.getElementById('next-page').textContent = translations[lang].nextPage;
    document.getElementById('close-pdf').textContent = translations[lang].close;

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
