import { openPdfViewer, initializePdfViewer } from './pdfViewer.js';
import { initializeAudioPlayer, toggleAudio, setCurrentLanguage } from './audio.js';
import { openYoutubeViewer } from './tutorial.js';
import { translations, setLanguage, translate } from './translations.js';
import { initializeSearch, updateSearchTranslation } from './search.js';

let currentLang = 'fr'; // Définissez la langue par défaut

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializePdfViewer();
        initializeAudioPlayer();
        initializeSearch();
        setLanguage(currentLang);
        setCurrentLanguage(currentLang);
        await loadSongs(); // Assurez-vous que cette fonction est définie
        setupLanguageSelector();
        updateAllTranslations();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showErrorMessage('Une erreur est survenue lors du chargement de la page. Veuillez réessayer.');
    }
});

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
    updateSongButtonsTranslations();
}

function updateSongButtonsTranslations() {
    document.querySelectorAll('.view-pdf').forEach(button => {
        button.textContent = translate('viewPdf', currentLang);
    });
    document.querySelectorAll('.view-tutorial').forEach(button => {
        button.textContent = translate('viewTutorial', currentLang);
    });
    document.querySelectorAll('.play-audio').forEach(button => {
        button.textContent = translate('playAudio', currentLang);
    });
}

async function loadSongs() {
    try {
        const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
        const files = await response.json();
        const ukuleleNeck = document.getElementById('ukulele-neck');

        if (!ukuleleNeck) {
            throw new Error("L'élément 'ukulele-neck' n'a pas été trouvé.");
        }

        files.forEach((file) => {
            if (file.name.endsWith('.pdf')) {
                const songName = file.name.replace('.pdf', '').replace(/_/g, ' ');
                const pdfUrl = `https://raw.githubusercontent.com/wolfangus67/ricky/main/songs/${encodeURIComponent(file.name)}`;
                const songElement = createSongElement(songName, pdfUrl);
                ukuleleNeck.appendChild(songElement);
            }
        });
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des chansons:', error);
        showErrorMessage("Une erreur s'est produite lors du chargement des chansons. Veuillez réessayer plus tard.");
    }
}

function createSongElement(songName, pdfUrl) {
    const songElement = document.createElement('div');
    songElement.className = 'song';

    songElement.innerHTML = `
        <h2>${songName}</h2>
        <div class="button-container">
            <button class="view-pdf" data-translate="viewPdf">${translate('viewPdf', currentLang)}</button>
            <button class="view-tutorial" data-translate="viewTutorial">${translate('viewTutorial', currentLang)}</button>
            <button class="play-audio" data-translate="playAudio">${translate('playAudio', currentLang)}</button>
        </div>
    `;

    songElement.querySelector('.view-pdf').addEventListener('click', () => openPdfViewer(pdfUrl));
    songElement.querySelector('.view-tutorial').addEventListener('click', () => openYoutubeViewer(songName));
    songElement.querySelector('.play-audio').addEventListener('click', (e) => toggleAudio(songName, e.target));

    return songElement;
}

function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}
