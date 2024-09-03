// audio.js

let player;
let currentVideoId = null;
let isPlaying = false;

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

function onPlayerReady(event) {
    document.querySelectorAll('.play-pause-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const videoId = e.target.getAttribute('data-video-id');
            if (currentVideoId !== videoId) {
                player.loadVideoById(videoId);
                currentVideoId = videoId;
                isPlaying = true;
                updateButtonState(e.target, isPlaying);
            } else {
                togglePlayPause(e.target);
            }
        });
    });
}

function togglePlayPause(button) {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
    isPlaying = !isPlaying;
    updateButtonState(button, isPlaying);
}

function updateButtonState(button, playing) {
    button.textContent = playing ? 'Pause' : 'Lecture';
}

document.addEventListener('DOMContentLoaded', () => {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag);
});
