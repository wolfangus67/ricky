// main.js

import { openPdfViewer, initializePdfViewer } from './pdfViewer.js';
import { initializeAudioPlayer, toggleAudio, setCurrentLanguage } from './audio.js';
import { openYoutubeViewer } from './tutorial.js';
import { translations, setLanguage, translate } from './translations.js';
import { initializeSearch, updateSearchTranslation } from './search.js';
import { gapiLoaded, gisLoaded } from './gdrive.js';

let currentLang = 'fr';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializePdfViewer();
        initializeAudioPlayer();
        initializeSearch();
        setLanguage(currentLang);
        setCurrentLanguage(currentLang);
        setupLanguageSelector();
        updateAllTranslations();
        initializeGoogleDrive();
        await loadSongsFromGitHub();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showErrorMessage('Une erreur est survenue lors du chargement de la page. Veuillez réessayer.');
    }
});

function initializeGoogleDrive() {
    gapiLoaded();
    gisLoaded();
}

function createSongElement(songName, pdfUrl, isGithub = true) {
    const songElement = document.createElement('div');
    songElement.className = 'song';

    let pdfButton;
    if (isGithub) {
        pdfButton = `<button class="view-pdf" data-translate="viewPdf">${translate('viewPdf', currentLang)}</button>`;
    } else {
        pdfButton = `<a href="${pdfUrl}" target="_blank" class="download-pdf" data-translate="downloadPdf">${translate('downloadPdf', currentLang)}</a>`;
    }

    songElement.innerHTML = `
        <h2>${songName}</h2>
        <div class="button-container">
            ${pdfButton}
            <button class="view-tutorial" data-translate="viewTutorial">${translate('viewTutorial', currentLang)}</button>
            <button class="play-audio" data-translate="playAudio">${translate('playAudio', currentLang)}</button>
        </div>
    `;

    if (isGithub) {
        songElement.querySelector('.view-pdf').addEventListener('click', () => openPdfViewer(pdfUrl));
    }
    songElement.querySelector('.view-tutorial').addEventListener('click', () => openYoutubeViewer(songName));
    songElement.querySelector('.play-audio').addEventListener('click', (e) => toggleAudio(songName, e.target));

    return songElement;
}

async function loadSongsFromGitHub() {
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
                const pdfUrl = `https://wolfangus67.github.io/ricky/songs/${encodeURIComponent(file.name)}`;
                const songElement = createSongElement(songName, pdfUrl, true);
                ukuleleNeck.appendChild(songElement);
            }
        });
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des chansons depuis GitHub:', error);
        showErrorMessage("Une erreur s'est produite lors du chargement des chansons depuis GitHub. Veuillez réessayer plus tard.");
    }
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
