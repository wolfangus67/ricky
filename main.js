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
                const songElement = document.createElement('div');
                songElement.className = 'song';
                songElement.innerHTML = `<h2>${songName}</h2>`;
                ukuleleNeck.appendChild(songElement);
            }
        });
    } catch (error) {
        console.error('Error fetching song list:', error);
    }
}
