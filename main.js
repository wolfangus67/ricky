// main.js

import { openPdfViewer, initializePdfViewer } from './pdfViewer.js';
import { initializeAudioPlayer, toggleAudio } from './audio.js';
import { openYoutubeViewer } from './tutorial.js';
import { setLanguage, initializeTranslations } from './translations.js'; // Importation du script de traduction

document.addEventListener('DOMContentLoaded', async () => {
    await initializePdfViewer();
    initializeAudioPlayer();
    await initializeTranslations(); // Initialisation des traductions
    loadSongs();
});

async function loadSongs() {
    try {
        const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
        const files = await response.json();
        const ukuleleNeck = document.getElementById('ukulele-neck');

        files.forEach((file) => {
            if (file.name.endsWith('.pdf')) {
                const songName = file.name.replace('.pdf', '').replace(/_/g, ' ');
                const pdfUrl = `https://raw.githubusercontent.com/wolfangus67/ricky/main/songs/${encodeURIComponent(file.name)}`;
                const songElement = createSongElement(songName, pdfUrl);
                ukuleleNeck.appendChild(songElement);
            }
        });
    } catch (error) {
        console.error('Error fetching song list:', error);
    }
}

function createSongElement(songName, pdfUrl) {
    const songElement = document.createElement('div');
    songElement.className = 'song';
    songElement.innerHTML = `
        <h2>${songName}</h2>
        <div class="button-container">
            <button class="view-pdf">${translate('view_pdf')}</button>
            <button class="view-tutorial">${translate('view_tutorial')}</button>
            <button class="play-audio">${translate('play_audio')}</button>
        </div>
    `;

    songElement.querySelector('.view-pdf').addEventListener('click', () => {
        openPdfViewer(pdfUrl);
    });
    songElement.querySelector('.view-tutorial').addEventListener('click', () => openYoutubeViewer(songName));
    songElement.querySelector('.play-audio').addEventListener('click', (e) => toggleAudio(songName, e.target));

    return songElement;
}

// Fonction pour traduire le texte
function translate(key) {
    return translations[currentLanguage][key] || key; // Utilise la clé pour obtenir la traduction
}
