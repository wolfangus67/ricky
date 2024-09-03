// main.js

import { openPdfViewer, initializePdfViewer } from './pdfViewer.js';
import { initializeAudioPlayer, toggleAudio } from './audio.js';
import { openYoutubeViewer } from './tutorial.js';
import { setLanguage, translate } from './translations.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initializePdfViewer();
    initializeAudioPlayer();
    setLanguage('fr'); // Initialisez la langue par défaut
    await loadSongs();
    setupLanguageSelector();
    updateTranslations();
});

function setupLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                const selectedLanguage = e.target.getAttribute('data-lang');
                setLanguage(selectedLanguage);
                updateTranslations();
            }
        });
    }
}

function updateTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
}

async function loadSongs() {
    try {
        const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
        const files = await response.json();
        const ukuleleNeck = document.getElementById('ukulele-neck');

        if (!ukuleleNeck) {
            console.error("L'élément 'ukulele-neck' n'a pas été trouvé.");
            return;
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
        // Afficher un message d'erreur à l'utilisateur
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Une erreur s'est produite lors du chargement des chansons. Veuillez réessayer plus tard.";
        document.body.appendChild(errorMessage);
    }
}

function createSongElement(songName, pdfUrl) {
    const songElement = document.createElement('div');
    songElement.className = 'song';

    const viewPdfText = translate('view_pdf');
    const viewTutorialText = translate('view_tutorial');
    const playAudioText = translate('play_audio');

    songElement.innerHTML = `
        <h2>${songName}</h2>
        <div class="button-container">
            <button class="view-pdf" data-translate="view_pdf">${viewPdfText}</button>
            <button class="view-tutorial" data-translate="view_tutorial">${viewTutorialText}</button>
            <button class="play-audio" data-translate="play_audio">${playAudioText}</button>
        </div>
    `;

    songElement.querySelector('.view-pdf').addEventListener('click', () => openPdfViewer(pdfUrl));
    songElement.querySelector('.view-tutorial').addEventListener('click', () => openYoutubeViewer(songName));
    songElement.querySelector('.play-audio').addEventListener('click', (e) => toggleAudio(songName, e.target));

    return songElement;
}
