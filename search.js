// search.js

let songList = [];

export function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const suggestionList = document.createElement('ul');
    suggestionList.id = 'suggestion-list';
    document.getElementById('search-container').appendChild(suggestionList);

    // Charger la liste des chansons
    loadSongList();

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Cacher les suggestions quand on clique en dehors
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput && e.target !== suggestionList) {
            suggestionList.style.display = 'none';
        }
    });
}

async function loadSongList() {
    try {
        const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
        const files = await response.json();
        songList = files
            .filter(file => file.name.endsWith('.pdf'))
            .map(file => file.name.replace('.pdf', '').replace(/_/g, ' '));
    } catch (error) {
        console.error('Error fetching song list:', error);
        showErrorMessage("Une erreur s'est produite lors du chargement de la liste des chansons.");
    }
}

function handleSearchInput(e) {
    const searchTerm = e.target.value.toLowerCase();
    const suggestionList = document.getElementById('suggestion-list');
    suggestionList.innerHTML = '';

    if (searchTerm.length > 0) {
        const suggestions = songList.filter(song => 
            song.toLowerCase().includes(searchTerm)
        );

        suggestions.forEach(song => {
            const li = document.createElement('li');
            const highlightedText = song.replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
            li.innerHTML = highlightedText;
            li.addEventListener('click', () => {
                e.target.value = song;
                performSearch();
                suggestionList.style.display = 'none';
            });
            suggestionList.appendChild(li);
        });

        suggestionList.style.display = suggestions.length > 0 ? 'block' : 'none';
    } else {
        suggestionList.style.display = 'none';
    }
}

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const songs = document.querySelectorAll('.song');

    songs.forEach(song => {
        const songTitle = song.querySelector('h2').textContent.toLowerCase();
        song.style.display = songTitle.includes(searchTerm) ? 'block' : 'none';
    });
}

function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}

export function updateSearchTranslation(translations, lang) {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchInput.placeholder = translations[lang].searchPlaceholder;
    searchButton.textContent = translations[lang].searchButton;
}
