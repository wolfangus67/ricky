document.addEventListener('DOMContentLoaded', () => {
    async function getSongList() {
        try {
            const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
            const files = await response.json();
            const songList = document.getElementById('song-list');

            files.forEach(file => {
                if (file.name.endsWith('.pdf')) {
                    const songName = file.name.replace('.pdf', '').replace(/_/g, ' ');
                    const songElement = document.createElement('section');
                    songElement.className = 'song';
                    const fileUrl = `https://github.com/wolfangus67/ricky/raw/main/songs/${file.name}`;
                    songElement.innerHTML = `
                        <h2>${songName}</h2>
                        <button class="view-pdf" data-pdf-url="${fileUrl}">Voir la tablature PDF</button>
                        <button class="view-tutorial" data-song-name="${songName}">Voir le tuto</button>
                    `;
                    songList.appendChild(songElement);
                }
            });

            document.querySelectorAll('.view-pdf').forEach(button => {
                button.addEventListener('click', (e) => {
                    const pdfUrl = e.target.getAttribute('data-pdf-url');
                    openPdfViewer(pdfUrl);
                });
            });

            document.querySelectorAll('.view-tutorial').forEach(button => {
                button.addEventListener('click', (e) => {
                    const songName = e.target.getAttribute('data-song-name');
                    openYoutubeViewer(songName);
                });
            });
        } catch (error) {
            console.error('Error fetching song list:', error);
        }
    }

    function openPdfViewer(url) {
        const iframe = document.getElementById('pdf-iframe');
        const loadingIndicator = document.getElementById('loading');
        
        loadingIndicator.style.display = 'block';
        
        iframe.onload = function() {
            loadingIndicator.style.display = 'none';
        };
        
        iframe.src = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        document.getElementById('pdf-viewer').style.display = 'block';
    }

    function openYoutubeViewer(songName) {
        const iframe = document.getElementById('youtube-iframe');
        const searchQuery = encodeURIComponent(`ricky somborn tutorial ${songName}`);
        iframe.src = `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;
        document.getElementById('youtube-viewer').style.display = 'block';
    }

    document.getElementById('close-pdf').addEventListener('click', () => {
        document.getElementById('pdf-viewer').style.display = 'none';
        document.getElementById('pdf-iframe').src = '';
    });

    document.getElementById('close-youtube').addEventListener('click', () => {
        document.getElementById('youtube-viewer').style.display = 'none';
        document.getElementById('youtube-iframe').src = '';
    });

    getSongList();
});
