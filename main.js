// Importations
import { handleAuthClick } from './gdrive.js';
import { translations, setLanguage, translate } from './translations.js';
// Importez d'autres modules nécessaires

let currentLang = 'fr';

// Fonction pour mettre à jour toutes les traductions
function updateAllTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key, currentLang);
    });
}

// Fonction pour configurer le sélecteur de langue
function setupLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                currentLang = e.target.getAttribute('data-lang');
                setLanguage(currentLang);
                updateAllTranslations();
            }
        });
    } else {
        console.error('Élément language-selector non trouvé');
    }
}

// Fonction pour afficher un message d'erreur
function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}

// Fonction pour charger les chansons
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

// Fonction pour créer un élément de chanson
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

    // Ajoutez ici les écouteurs d'événements pour les boutons

    return songElement;
}

// Écouteur d'événement pour le chargement du DOM
document.addEventListener('DOMContentLoaded', async () => {
    try {
        document.getElementById('authorize_button').addEventListener('click', handleAuthClick);
        
        // Initialisations
        setLanguage(currentLang);
        await loadSongs();
        setupLanguageSelector();
        updateAllTranslations();
        
        // Autres initialisations si nécessaire
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showErrorMessage('Une erreur est survenue lors du chargement de la page. Veuillez réessayer.');
    }
});

// Exportez les fonctions si nécessaire
export { updateAllTranslations, setupLanguageSelector };
