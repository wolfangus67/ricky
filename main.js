// main.js

import { openPdfViewer, initializePdfViewer } from './pdfViewer.js';
import { initializeAudioPlayer, toggleAudio } from './audio.js';
import { openYoutubeViewer } from './tutorial.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initializePdfViewer();
    initializeAudioPlayer();
    setLanguage(currentLanguage); // Initialise la langue
    loadSongs();
    setupLanguageSelector();
});

function setupLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                currentLanguage = e.target.getAttribute('data-lang');
                setLanguage(currentLanguage);
                updateTranslations();
            }
        });
    }
}

function updateTranslations() {
    // Mettez à jour tous les éléments traduits ici
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
            <button class="view-pdf" data-translate="view_pdf">${translate('view_pdf')}</button>
            <button class="view-tutorial" data-translate="view_tutorial">${translate('view_tutorial')}</button>
            <button class="play-audio" data-translate="play_audio">${translate('play_audio')}</button>
        </div>
    `;

    songElement.querySelector('.view-pdf').addEventListener('click', () => openPdfViewer(pdfUrl));
    songElement.querySelector('.view-tutorial').addEventListener('click', () => openYoutubeViewer(songName));
    songElement.querySelector('.play-audio').addEventListener('click', (e) => toggleAudio(songName, e.target));

    return songElement;
}
