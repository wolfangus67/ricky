export function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const songs = document.querySelectorAll('.song');

    songs.forEach(song => {
        const songTitle = song.querySelector('h2').textContent.toLowerCase();
        if (songTitle.includes(searchTerm)) {
            song.style.display = 'block';
        } else {
            song.style.display = 'none';
        }
    });
}
