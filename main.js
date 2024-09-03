// main.js

//import { openPdfViewer, initializePdfViewer } from './pdfViewer.js';
import { initializeAudioPlayer, toggleAudio, setCurrentLanguage } from './audio.js';
import { openYoutubeViewer } from './tutorial.js';
import { translations, setLanguage, translate } from './translations.js';
import { initializeSearch, updateSearchTranslation } from './search.js';
import { gapiLoaded, gisLoaded } from './gdrive.js';

let currentLang = 'fr';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Définir la langue par défaut avant toute autre initialisation
        await setDefaultLanguage();

        await initializePdfViewer();
        initializeAudioPlayer();
        initializeSearch();
        setLanguage(currentLang);
        setCurrentLanguage(currentLang);
        setupLanguageSelector();
        updateAllTranslations();
        initializeGoogleDrive();
        await loadSongsFromGitHub();
        
        // Ajouter l'écouteur d'événements pour le titre
        setupTitleClick();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showErrorMessage('Une erreur est survenue lors du chargement de la page. Veuillez réessayer.');
    }
});

// Fonction pour configurer le clic sur le titre
function setupTitleClick() {
    const titleElement = document.querySelector('header h1'); // Assurez-vous que le sélecteur correspond à votre titre
    if (titleElement) {
        titleElement.style.cursor = 'pointer'; // Changer le curseur pour indiquer que c'est cliquable
        titleElement.addEventListener('click', () => {
            location.reload(); // Rafraîchir la page
        });
    } else {
        console.error('Élément de titre non trouvé');
    }
}

// Nouvelle fonction pour définir la langue par défaut
async function setDefaultLanguage() {
    try {
        // Vérifier d'abord les préférences stockées
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang) {
            console.log('Langue stockée trouvée:', storedLang);
            currentLang = storedLang;
            return;
        }

        // Ensuite, vérifier les préférences du navigateur
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            console.log('Langue du navigateur détectée:', browserLang);
            currentLang = browserLang.split('-')[0]; // Prendre la langue principale
            // Vérifier si la langue du navigateur est supportée
            if (!translations[currentLang]) {
                console.log('Langue non supportée, utilisation de la langue par défaut');
                currentLang = 'fr'; // Langue par défaut si non supportée
            }
            return;
        }

        // En dernier recours, utiliser une langue par défaut
        console.log('Aucune préférence de langue trouvée, utilisation de la langue par défaut');
        currentLang = 'fr';
    } catch (error) {
        console.error('Erreur lors de la définition de la langue par défaut:', error);
        currentLang = 'fr'; // Utiliser le français comme fallback en cas d'erreur
    }
}

function initializeGoogleDrive() {
    gapiLoaded();
    gisLoaded();
}

function createSongElement(songName, pdfUrl) {
    const songElement = document.createElement('div');
    songElement.className = 'song';

    // Créer uniquement le lien de téléchargement
    const pdfButton = `<a href="${pdfUrl}" target="_blank" class="download-pdf" data-translate="downloadPdf">${translate('downloadPdf', currentLang)}</a>`;

    songElement.innerHTML = `
        <h2>${songName}</h2>
        <div class="button-container">
            ${pdfButton}
            <button class="view-tutorial" data-translate="viewTutorial">${translate('viewTutorial', currentLang)}</button>
            <button class="play-audio" data-translate="playAudio">${translate('playAudio', currentLang)}</button>
        </div>
    `;

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
                const songElement = createSongElement(songName, pdfUrl);
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
                // Stocker la préférence de langue
                localStorage.setItem('preferredLanguage', currentLang);
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
