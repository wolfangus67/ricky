export function openYoutubeViewer(songName) {
    const searchQuery = encodeURIComponent(`ricky somborn tutorial ${songName}`);
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
    window.open(youtubeSearchUrl, '_blank');
}
