import { setLanguage } from './translations.js';
import { initializeSearch } from './search.js';
import { openPdfViewer, initializePdfControls } from './pdfViewer.js';
import { openYoutubeViewer } from './tutorial.js';
import { initializeAudioPlayer, toggleAudio, setCurrentLanguage } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
    setLanguage('fr'); // Langue par défaut
    setCurrentLanguage('fr'); // Définir la langue par défaut pour l'audio
    initializeSearch();
    initializePdfControls();
    initializeAudioPlayer();

    // Gestionnaire pour le sélecteur de langue
    document.getElementById('language-selector').addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            const lang = e.target.getAttribute('data-lang');
            setLanguage(lang);
            setCurrentLanguage(lang);
        }
    });

    // Chargement initial des chansons
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
                const songElement = createSongElement(songName, file.download_url);
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
            <button class="view-pdf">Voir la tablature PDF</button>
            <button class="view-tutorial">Voir le tuto</button>
            <button class="play-audio">Lecture</button>
        </div>
    `;

    songElement.querySelector('.view-pdf').addEventListener('click', () => openPdfViewer(pdfUrl));
    songElement.querySelector('.view-tutorial').addEventListener('click', () => openYoutubeViewer(songName));
    songElement.querySelector('.play-audio').addEventListener('click', (e) => toggleAudio(songName, e.target));

    return songElement;
}
