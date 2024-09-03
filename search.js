// search.js

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

                    if (!artistIndex[artist]) {
                        artistIndex[artist] = [];
                    }
                    artistIndex[artist].push(songInfo);

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
    ukuleleNeck.innerHTML = '';

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

    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.view-pdf').forEach(button => {
        button.addEventListener('click', (e) => {
            const pdfUrl = e.target.getAttribute('data-pdf-url');
            console.log('Opening PDF:', pdfUrl);
            // Appeler la fonction d'ouverture de PDF ici
        });
    });

    document.querySelectorAll('.view-tutorial').forEach(button => {
        button.addEventListener('click', (e) => {
            const songName = e.target.getAttribute('data-song-name');
            console.log('Opening tutorial for:', songName);
            // Appeler la fonction d'ouverture de tutoriel YouTube ici
        });
    });
}

function createSuggestionsList(results) {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';

    results.forEach(song => {
        const li = document.createElement('li');
        li.textContent = `${song.artist} - ${song.title}`;
        li.addEventListener('click', () => {
            document.getElementById('search-input').value = `${song.artist} - ${song.title}`;
            suggestionsList.style.display = 'none';
            displaySearchResults([song]);
        });
        suggestionsList.appendChild(li);
    });

    suggestionsList.style.display = results.length > 0 ? 'block' : 'none';
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value;
    const results = searchSongs(query);
    displaySearchResults(results);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const suggestionsList = document.createElement('ul');
    suggestionsList.id = 'suggestions-list';
    suggestionsList.style.display = 'none';
    document.getElementById('search-container').appendChild(suggestionsList);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length > 1) {
            const results = searchSongs(query);
            createSuggestionsList(results.slice(0, 5)); // Limiter à 5 suggestions
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            suggestionsList.style.display = 'none';
        }
    });

    searchButton.addEventListener('click', () => {
        handleSearch();
        suggestionsList.style.display = 'none';
    });

    // Cacher les suggestions si on clique en dehors
    document.addEventListener('click', (e) => {
        if (e.target !== searchInput && e.target !== suggestionsList) {
            suggestionsList.style.display = 'none';
        }
    });
});
