// gdrive.js

// Constantes pour l'API Google Drive
const CLIENT_ID = '234810356117-bc5je2lea6h1pri38gv9jdlh8b6uc7nu.apps.googleusercontent.com';
const API_KEY = 'VOTRE_CLE_API'; // Remplacez par votre clé API réelle
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

const FOLDER_ID = '13W-w8jsXQhfMczbu2-vLUfp8JkwDY7mU';

let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // défini plus tard
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        await loadSongsFromDrive();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

async function loadSongsFromDrive() {
    try {
        const response = await gapi.client.drive.files.list({
            'q': `'${FOLDER_ID}' in parents and mimeType='application/pdf'`,
            'fields': 'files(id, name)'
        });

        const files = response.result.files;
        const ukuleleNeck = document.getElementById('ukulele-neck');

        files.forEach((file) => {
            const songName = file.name.replace('.pdf', '');
            const pdfUrl = `https://drive.google.com/file/d/${file.id}/view`;
            const songElement = createSongElement(songName, pdfUrl);
            ukuleleNeck.appendChild(songElement);
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
            <a href="${pdfUrl}" target="_blank" class="view-pdf">Voir PDF</a>
        </div>
    `;

    return songElement;
}

function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}

// Exporter les fonctions pour les utiliser dans d'autres fichiers
export { gapiLoaded, gisLoaded, handleAuthClick };
