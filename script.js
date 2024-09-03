async function getSongList() {
    const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
    const files = await response.json();
    const songList = document.getElementById('song-list');

    files.forEach(file => {
        if (file.name.endsWith('.pdf')) {
            const songName = file.name.replace('.pdf', '').replace(/_/g, ' ');
            const songElement = document.createElement('section');
            songElement.className = 'song';
            // Utilisez l'URL brute de GitHub
            const fileUrl = `https://github.com/wolfangus67/ricky/raw/main/songs/${file.name}`;
            songElement.innerHTML = `
                <h2>${songName}</h2>
                <a href="${fileUrl}" target="_blank">Voir la tablature PDF</a>
            `;
            songList.appendChild(songElement);
        }
    });
}

getSongList();
