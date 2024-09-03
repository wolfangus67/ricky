// main.js

document.addEventListener('DOMContentLoaded', () => {
    loadSongs();
});

async function loadSongs() {
    try {
        const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
        const files = await response.json();
        const ukuleleNeck = document.getElementById('ukulele-neck');

        files.forEach((file) => {
            if (file.name.endsWith('.pdf')) {
                const songName = file.name.replace('.pdf', '').replace(/_/g, ' ');
                const pdfUrl = `https://raw.githubusercontent.com/wolfangus67/ricky/main/songs/${encodeURIComponent(file.name)}`;
                const songElement = createSongElement(songName, pdfUrl);
                ukuleleNeck.appendChild(songElement);
            }
        });
    } catch (error) {
        console.error('Error fetching song list:', error);
    }
}

function createSongElement(songName, pdfUrl) {
    const songElement = document.createElement('div');
    songElement.className = 'song';
    songElement.innerHTML = `
        <h2>${songName}</h2>
        <div class="button-container">
            <button class="view-pdf">Voir la tablature PDF</button>
            <button class="view-tutorial">Voir le tuto</button>
            <button class="play-audio">Lecture</button>
        </div>
    `;

    songElement.querySelector('.view-pdf').addEventListener('click', () => console.log('Ouvrir PDF:', pdfUrl));
    songElement.querySelector('.view-tutorial').addEventListener('click', () => console.log('Ouvrir tutoriel pour:', songName));
    songElement.querySelector('.play-audio').addEventListener('click', () => console.log('Jouer audio pour:', songName));

    return songElement;
}
