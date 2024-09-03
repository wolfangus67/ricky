import { translations } from './translations.js';

const API_KEY = 'AIzaSyDiFuUIrm1WXjp9slhwMl4G4R23kssEwr0'; // Remplacez par votre clé API sécurisée

let player;
let currentVideoId = null;
let isPlaying = false;
let currentPlayingButton = null;
let currentLang = 'fr';

export function initializeAudioPlayer() {
    loadYouTubeAPI();
}

function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log("YouTube player is ready");
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        updateButtonState();
    }
}

export async function toggleAudio(songName, button) {
    try {
        if (currentPlayingButton && currentPlayingButton !== button) {
            currentPlayingButton.textContent = translations[currentLang].playAudio;
        }

        if (isPlaying && currentPlayingButton === button) {
            player.pauseVideo();
            isPlaying = false;
        } else {
            const videoId = await getYouTubeVideoId(songName);
            if (videoId) {
                if (currentVideoId !== videoId) {
                    player.loadVideoById(videoId);
                    currentVideoId = videoId;
                }
                player.playVideo();
                isPlaying = true;
            } else {
                console.error('Aucune vidéo trouvée pour:', songName);
                showErrorMessage("Impossible de trouver la vidéo pour cette chanson.");
                return;
            }
        }
        currentPlayingButton = button;
        updateButtonState();
    } catch (error) {
        console.error('Erreur lors de la lecture de l\'audio:', error);
        showErrorMessage("Une erreur s'est produite lors de la lecture de l'audio.");
    }
}

function updateButtonState() {
    if (currentPlayingButton) {
        currentPlayingButton.textContent = isPlaying ? translations[currentLang].stopAudio : translations[currentLang].playAudio;
    }
}

async function getYouTubeVideoId(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=1`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.items[0]?.id.videoId;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID vidéo YouTube:', error);
        showErrorMessage("Impossible de charger la vidéo YouTube. Veuillez réessayer plus tard.");
        return null;
    }
}

export function setCurrentLanguage(lang) {
    currentLang = lang;
}

function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}
