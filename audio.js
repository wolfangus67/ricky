// audio.js

const API_KEY = 'AIzaSyDiFuUIrm1WXjp9slhwMl4G4R23kssEwr0';

let player;
let currentVideoId = null;
let isPlaying = false;

export function initializeAudioPlayer() {
    loadYouTubeAPI();
}

function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.onYouTubeIframeAPIReady = function() {
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
    if (event.data == YT.PlayerState.ENDED) {
        isPlaying = false;
        updateButtonState();
    }
}

export async function toggleAudio(songName, button) {
    if (isPlaying) {
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
            console.error('No video found for:', songName);
            return;
        }
    }
    updateButtonState(button);
}

function updateButtonState(button) {
    if (button) {
        button.textContent = isPlaying ? 'Stop' : 'Lecture';
    }
    // Mettre à jour tous les boutons si nécessaire
    document.querySelectorAll('.play-audio').forEach(btn => {
        btn.textContent = btn === button && isPlaying ? 'Stop' : 'Lecture';
    });
}

async function getYouTubeVideoId(query) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=1`);
    const data = await response.json();
    return data.items[0]?.id.videoId;
}
