// audio.js

let player;
let currentVideoId = null;
let isPlaying = false;

// Charger l'API YouTube IFrame
function loadYouTubeAPI() {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag);
}

// Initialiser le lecteur YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

// Ajouter des boutons "Lecture" et gérer les clics
function onPlayerReady(event) {
    document.querySelectorAll('.song').forEach(songElement => {
        const songName = songElement.querySelector('h2').textContent;
        const playButton = document.createElement('button');
        playButton.className = 'play-audio';
        playButton.textContent = 'Lecture';
        playButton.setAttribute('data-song-name', songName);
        songElement.appendChild(playButton);

        playButton.addEventListener('click', async () => {
            const videoId = await getYouTubeVideoId(songName);
            if (currentVideoId !== videoId) {
                player.loadVideoById(videoId);
                currentVideoId = videoId;
                isPlaying = true;
                updateButtonState(playButton, isPlaying);
            } else {
                togglePlayPause(playButton);
            }
        });
    });
}

// Rechercher l'ID de la vidéo YouTube
async function getYouTubeVideoId(query) {
    const apiKey = 'AIzaSyDiFuUIrm1WXjp9slhwMl4G4R23kssEwr0';
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=1`);
    const data = await response.json();
    return data.items[0]?.id.videoId;
}

// Gérer la lecture et la pause
function togglePlayPause(button) {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
    isPlaying = !isPlaying;
    updateButtonState(button, isPlaying);
}

// Mettre à jour l'état du bouton
function updateButtonState(button, playing) {
    button.textContent = playing ? 'Pause' : 'Lecture';
}

// Charger l'API YouTube et initialiser les lecteurs
document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeAPI();
});
