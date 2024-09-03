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
        button.addEventListener('click', async (e) => {
            const songName = e.target.getAttribute('data-song-name');
            const videoId = await getYouTubeVideoId(songName);
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

async function getYouTubeVideoId(query) {
    const apiKey = 'YOUR_YOUTUBE_API_KEY';
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=1`);
    const data = await response.json();
    return data.items[0]?.id.videoId;
}

document.addEventListener('DOMContentLoaded', () => {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag);
});
