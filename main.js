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

        createAlphabetIndex();
    } catch (error) {
        console.error('Erreur lors du chargement des chansons:', error);
        showErrorMessage("Une erreur s'est produite lors du chargement des chansons. Veuillez réessayer plus tard.");
    }
}

function createAlphabetIndex() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const indexContainer = document.getElementById('alphabet-index');

    for (let letter of alphabet) {
        const letterButton = document.createElement('button');
        letterButton.textContent = letter;
        letterButton.addEventListener('click', () => showArtistsByLetter(letter));
        indexContainer.appendChild(letterButton);
    }
}

function showArtistsByLetter(letter) {
    const artistsList = document.getElementById('artists-list');
    artistsList.innerHTML = '';

    const filteredArtists = [...new Set(pdfIndex
        .filter(song => song.artist.toUpperCase().startsWith(letter))
        .map(song => song.artist))];

    filteredArtists.forEach(artist => {
        const artistButton = document.createElement('button');
        artistButton.textContent = artist;
        artistButton.addEventListener('click', () => showSongsByArtist(artist));
        artistsList.appendChild(artistButton);
    });
}

function showSongsByArtist(artist) {
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = '';

    const artistSongs = pdfIndex.filter(song => song.artist === artist);

    artistSongs.forEach(song => {
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

// Fonction pour gérer la recherche
function handleSearch(query) {
    const normalizedQuery = query.toLowerCase();
    const filteredSongs = pdfIndex.filter(song => 
        song.artist.toLowerCase().includes(normalizedQuery) || 
        song.title.toLowerCase().includes(normalizedQuery)
    );

    displaySearchResults(filteredSongs);
}

// Fonction pour afficher les résultats de recherche
function displaySearchResults(results) {
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = '';

    if (results.length === 0) {
        songsList.innerHTML = '<p>Aucun résultat trouvé.</p>';
        return;
    }

    results.forEach(song => {
        const songElement = createSongElement(song.title, song.fileName);
        songsList.appendChild(songElement);
    });
}

// Ajoutez un écouteur d'événements pour le bouton de recherche
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    handleSearch(query);
});

// Ajoutez un écouteur d'événements pour la recherche en temps réel (optionnel)
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length >= 3) { // Commencez la recherche après 3 caractères
        handleSearch(query);
    }
});
