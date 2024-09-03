import * as pdfjsLib from './pdfjs/pdf.mjs';
import translations from './translations.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs/pdf.worker.mjs';

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

// ... (le reste de votre code pour openPdfViewer, renderPage, etc.)

document.getElementById('language-selector').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        setLanguage(e.target.getAttribute('data-lang'));
    }
});

getSongList();
setLanguage('fr'); // Langue par défaut
