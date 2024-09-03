import * as pdfjsLib from './pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs/pdf.worker.mjs';

const translations = {
    'fr': {
        'title': 'Tablatures Ukulélé',
        'viewPdf': 'Voir la tablature PDF',
        'viewTutorial': 'Voir le tuto',
        'prevPage': 'Page précédente',
        'nextPage': 'Page suivante',
        'close': 'Fermer',
        'pageOf': 'Page {current} sur {total}'
    },
    'en': {
        'title': 'Ukulele Tabs',
        'viewPdf': 'View PDF Tab',
        'viewTutorial': 'View Tutorial',
        'prevPage': 'Previous Page',
        'nextPage': 'Next Page',
        'close': 'Close',
        'pageOf': 'Page {current} of {total}'
    },
    'es': {
        'title': 'Tablaturas de Ukulele',
        'viewPdf': 'Ver tablatura PDF',
        'viewTutorial': 'Ver tutorial',
        'prevPage': 'Página anterior',
        'nextPage': 'Página siguiente',
        'close': 'Cerrar',
        'pageOf': 'Página {current} de {total}'
    }
};

let currentPdf = null;
let currentPage = 1;
let pageCount = 0;
let currentLang = 'fr';

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('main-title').textContent = translations[lang].title;
    document.getElementById('prev-page').textContent = translations[lang].prevPage;
    document.getElementById('next-page').textContent = translations[lang].nextPage;
    document.getElementById('close-pdf').textContent = translations[lang].close;
    
    document.querySelectorAll('.view-pdf').forEach(button => {
        button.textContent = translations[lang].viewPdf;
    });
    document.querySelectorAll('.view-tutorial').forEach(button => {
        button.textContent = translations[lang].viewTutorial;
    });

    updatePageNumber();
}

function updatePageNumber() {
    const pageNumElement = document.getElementById('page-num');
    if (pageNumElement) {
        pageNumElement.textContent = translations[currentLang].pageOf
            .replace('{current}', currentPage)
            .replace('{total}', pageCount);
    }
}

async function getSongList() {
    try {
        const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
        const files = await response.json();
        const ukuleleNeck = document.getElementById('ukulele-neck');

        files.forEach((file, index) => {
            if (file.name.endsWith('.pdf')) {
                const songName = file.name.replace('.pdf', '').replace(/_/g, ' ');
                const songElement = document.createElement('div');
                songElement.className = 'song';
                const fileUrl = file.download_url;
                songElement.innerHTML = `
                    <h2>${songName}</h2>
                    <button class="view-pdf" data-pdf-url="${fileUrl}">${translations[currentLang].viewPdf}</button>
                    <button class="view-tutorial" data-song-name="${songName}">${translations[currentLang].viewTutorial}</button>
                `;
                ukuleleNeck.appendChild(songElement);

                if (index < files.length - 1) {
                    const fret = document.createElement('div');
                    fret.className = 'fret';
                    ukuleleNeck.appendChild(fret);
                }
            }
        });

        document.querySelectorAll('.view-pdf').forEach(button => {
            button.addEventListener('click', (e) => {
                const pdfUrl = e.target.getAttribute('data-pdf-url');
                openPdfViewer(pdfUrl);
            });
        });

        document.querySelectorAll('.view-tutorial').forEach(button => {
            button.addEventListener('click', (e) => {
                const songName = e.target.getAttribute('data-song-name');
                openYoutubeViewer(songName);
            });
        });
    } catch (error) {
        console.error('Error fetching song list:', error);
    }
}

async function openPdfViewer(url) {
    try {
        currentPdf = await pdfjsLib.getDocument(url).promise;
        pageCount = currentPdf.numPages;
        currentPage = 1;
        renderPage(currentPage);
        document.getElementById('pdf-viewer').style.display = 'flex';
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}

async function renderPage(num) {
    const page = await currentPdf.getPage(num);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.getElementById('pdf-render');
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: ctx,
        viewport: viewport
    };
    await page.render(renderContext);

    updatePageNumber();
}

function openYoutubeViewer(songName) {
    const searchQuery = encodeURIComponent(`ricky somborn tutorial ${songName}`);
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
    window.open(youtubeSearchUrl, '_blank');
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < pageCount) {
        currentPage++;
        renderPage(currentPage);
    }
});

document.getElementById('close-pdf').addEventListener('click', () => {
    document.getElementById('pdf-viewer').style.display = 'none';
});

document.getElementById('language-selector').addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        setLanguage(e.target.getAttribute('data-lang'));
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    getSongList();
    setLanguage('fr'); // Langue par défaut
});
