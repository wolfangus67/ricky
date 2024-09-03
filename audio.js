// audio.js

let currentAudio = null;

function initializeAudioPlayers() {
    document.querySelectorAll('.play-pause-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const songName = e.target.getAttribute('data-song-name');
            togglePlayPause(songName, e.target);
        });
    });
}

function togglePlayPause(songName, button) {
    if (currentAudio && currentAudio.getAttribute('data-song-name') !== songName) {
        // Si une autre chanson est en cours de lecture, on l'arrête
        currentAudio.pause();
        currentAudio.currentTime = 0;
        updateButtonState(document.querySelector(`[data-song-name="${currentAudio.getAttribute('data-song-name')}"]`), false);
    }

    if (!currentAudio || currentAudio.getAttribute('data-song-name') !== songName) {
        // Si aucune chanson n'est en cours ou si c'est une nouvelle chanson
        if (currentAudio) {
            currentAudio.pause();
        }
        currentAudio = new Audio(`songs/${songName}.mp3`); // Assurez-vous que le chemin est correct
        currentAudio.setAttribute('data-song-name', songName);
    }

    if (currentAudio.paused) {
        currentAudio.play();
        updateButtonState(button, true);
    } else {
        currentAudio.pause();
        updateButtonState(button, false);
    }
}

function updateButtonState(button, playing) {
    button.textContent = playing ? 'Pause' : 'Lecture';
}

document.addEventListener('DOMContentLoaded', initializeAudioPlayers);
