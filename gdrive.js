// gdrive.js

import { openYoutubeViewer } from './tutorial.js';
import { toggleAudio } from './audio.js';
import { translate } from './translations.js';

const CLIENT_ID = '234810356117-bc5je2lea6h1pri38gv9jdlh8b6uc7nu.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDiFuUIrm1WXjp9slhwMl4G4R23kssEwr0';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

const FOLDER_ID = '13W-w8jsXQhfMczbu2-vLUfp8JkwDY7mU';

let gapiInited = false;
let gisInited = false;
let tokenClient;
let currentLang = 'fr';

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeLoadFiles();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // sera défini plus tard
    });
    gisInited = true;
    maybeLoadFiles();
}

function maybeLoadFiles() {
    if (gapiInited && gisInited) {
        loadSongsFromDrive();
    }
}

function createSongElement(songName, fileId) {
    const songElement = document.createElement('div');
    songElement.className = 'song';

    songElement.innerHTML = `
        <h2>${songName}</h2>
        <div class="button-container">
            <a href="https://drive.google.com/uc?export=download&id=${fileId}" target="_blank" class="download-pdf" data-translate="downloadPdf">${translate('downloadPdf', currentLang)}</a>
            <button class="view-tutorial" data-translate="viewTutorial">${translate('viewTutorial', currentLang)}</button>
            <button class="play-audio" data-translate="playAudio">${translate('playAudio', currentLang)}</button>
        </div>
    `;

    songElement.querySelector('.view-tutorial').addEventListener('click', () => openYoutubeViewer(songName));
    songElement.querySelector('.play-audio').addEventListener('click', (e) => toggleAudio(songName, e.target));

    return songElement;
}

async function loadSongsFromDrive() {
    try {
        await tokenClient.requestAccessToken({prompt: ''});
        const response = await gapi.client.drive.files.list({
            'q': `'${FOLDER_ID}' in parents and mimeType='application/pdf'`,
            'fields': 'files(id, name)'
        });

        console.log('Response:', response);

        const files = response.result.files;
        const ukuleleNeck = document.getElementById('ukulele-neck');

        if (!files || files.length === 0) {
            console.log('Aucun fichier PDF trouvé dans le dossier spécifié.');
            return;
        }

        files.forEach((file) => {
            const songName = file.name.replace('.pdf', '');
            const songElement = createSongElement(songName, file.id);
            ukuleleNeck.appendChild(songElement);
        });
    } catch (error) {
        console.error('Erreur lors du chargement de la liste des chansons:', error);
        showErrorMessage("Une erreur s'est produite lors du chargement des chansons. Veuillez réessayer plus tard.");
    }
}

function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}

export { gapiLoaded, gisLoaded };
