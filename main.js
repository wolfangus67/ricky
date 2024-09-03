import { openPdfViewer, initializePdfViewer } from './pdfViewer.js';
import { initializeAudioPlayer, toggleAudio, setCurrentLanguage } from './audio.js';
import { openYoutubeViewer } from './tutorial.js';
import { translations, setLanguage, translate } from './translations.js';
import { initializeSearch, updateSearchTranslation } from './search.js';

let currentLang = 'fr';
let pdfIndex = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializePdfViewer();
        initializeAudioPlayer();
        initializeSearch();
        setLanguage(currentLang);
        setCurrentLanguage(currentLang);
        await loadSongs();
        setupLanguageSelector();
        updateAllTranslations();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showErrorMessage('Une erreur est survenue lors du chargement de la page. Veuillez réessayer.');
    }
});

async function loadSongs() {
    try {
        const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
        const files = await response.json();
        pdfIndex = files
            .filter(file => file.name.endsWith('.pdf'))
            .map(file => {
                const [artist, title] = file.name.replace('.pdf', '').split(' - ');
                return { artist, title, fileName: file.name };
            });

        displaySongs();
    } catch (error) {
        console.error('Erreur lors du chargement des chansons:', error);
        showErrorMessage("Une erreur s'est produite lors du chargement des chansons. Veuillez réessayer plus tard.");
    }
}

function displaySongs() {
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = '';

    pdfIndex.forEach(song => {
        const songElement = createSongElement(song.title, song.fileName);
        songsList.appendChild(songElement);
    });
}

function createSongElement(title, fileName) {
    const songElement = document.createElement('div');
    songElement.className = 'song';

    const songLink = document.createElement('a');
    songLink.href = '#';
    songLink.textContent = title;
    songLink.addEventListener('click', (e) => {
        e.preventDefault();
        const pdfUrl = `https://wolfangus67.github.io/ricky/songs/${encodeURIComponent(fileName)}`;
        openPdfViewer(pdfUrl);
    });

    songElement.appendChild(songLink);
    return songElement;
}

function setupLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                currentLang = e.target.getAttribute('data-lang');
                setLanguage(currentLang);
                setCurrentLanguage(currentLang);
                updateAllTranslations();
                updateSearchTranslation(translations, currentLang);
            }
        });
    } else {
        console.error('Élément language-selector non trouvé');
    }
}

function updateAllTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key, currentLang);
    });
}

function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}
