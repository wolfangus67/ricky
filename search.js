let songIndex = {};
let artistIndex = {};

function initializeSearch() {
    fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs')
        .then(response => response.json())
        .then(files => {
            files.forEach((file) => {
                if (file.name.endsWith('.pdf')) {
                    const [artist, title] = file.name.replace('.pdf', '').split(' - ');
                    const songInfo = {
                        artist: artist,
                        title: title,
                        fileUrl: file.download_url
                    };

                    // Indexer par artiste
                    if (!artistIndex[artist]) {
                        artistIndex[artist] = [];
                    }
                    artistIndex[artist].push(songInfo);

                    // Indexer tous les morceaux
                    songIndex[title.toLowerCase()] = songInfo;
                }
            });
            console.log('Search index initialized');
        })
        .catch(error => console.error('Error initializing search:', error));
}

function searchSongs(query) {
    const searchResults = [];
    const lowerQuery = query.toLowerCase();

    for (const title in songIndex) {
        if (title.includes(lowerQuery) || songIndex[title].artist.toLowerCase().includes(lowerQuery)) {
            searchResults.push(songIndex[title]);
        }
    }

    return searchResults;
}

function displaySearchResults(results) {
    const ukuleleNeck = document.getElementById('ukulele-neck');
    ukuleleNeck.innerHTML = ''; // Clear existing content

    if (results.length === 0) {
        ukuleleNeck.innerHTML = '<p>Aucun résultat trouvé.</p>';
        return;
    }

    results.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song';
        songElement.innerHTML = `
            <h3>${song.artist} - ${song.title}</h3>
            <button class="view-pdf" data-pdf-url="${song.fileUrl}">Voir la tablature PDF</button>
            <button class="view-tutorial" data-song-name="${song.title}">Voir le tuto</button>
        `;
        ukuleleNeck.appendChild(songElement);
    });

    // Réattacher les event listeners
    document.querySelectorAll('.view-pdf').forEach(button => {
        button.addEventListener('click', (e) => {
            const pdfUrl = e.target.getAttribute('data-pdf-url');
            // Appeler la fonction d'ouverture de PDF ici
            console.log('Opening PDF:', pdfUrl);
        });
    });

    document.querySelectorAll('.view-tutorial').forEach(button => {
        button.addEventListener('click', (e) => {
            const songName = e.target.getAttribute('data-song-name');
            // Appeler la fonction d'ouverture de tutoriel YouTube ici
            console.log('Opening tutorial for:', songName);
        });
    });
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value;
    const results = searchSongs(query);
    displaySearchResults(results);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});
