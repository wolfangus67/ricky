// tutorial.js

export function openYoutubeViewer(songName) {
    const searchQuery = encodeURIComponent(`ricky somborn tutorial ${songName}`);
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
    
    // Ouvrir l'URL dans un nouvel onglet
    window.open(youtubeSearchUrl, '_blank');
}
