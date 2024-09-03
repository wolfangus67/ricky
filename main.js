import { openPdfViewer, initializePdfViewer } from './pdfViewer.js';
import { initializeAudioPlayer, toggleAudio, setCurrentLanguage } from './audio.js';
import { openYoutubeViewer } from './tutorial.js';
import { translations, setLanguage, translate } from './translations.js';
import { initializeSearch, updateSearchTranslation } from './search.js';

let currentLang = 'fr';

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
        const ukuleleNeck = document.getElementById('ukulele-neck');

        if (!ukuleleNeck) {
            throw new Error("L'élément 'ukulele-neck' n'a pas été trouvé.");
        }

        files.forEach((file) => {
            if (file.name.endsWith('.pdf')) {
                const songName = file.name.replace('.pdf', '').replace(/_/g, ' ');
                const pdfUrl = `https://wolfangus67.github.io/ricky/songs/${encodeURIComponent(file.name)}`;
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

    songElement.querySelector
