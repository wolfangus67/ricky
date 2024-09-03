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
                    const fileUrl = file.download_url;
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
        const pdfViewer = document.getElementById('pdf-viewer');
        
        loadingIndicator.style.display = 'block';
        pdfViewer.style.display = 'block';
        
        iframe.onload = function() {
            loadingIndicator.style.display = 'none';
        };
        
        iframe.src = url;
    }

    function openYoutubeViewer(songName) {
        const iframe = document.getElementById('youtube-iframe');
        const youtubeViewer = document.getElementById('youtube-viewer');
        const searchQuery = encodeURIComponent(`ricky somborn tutorial ${songName}`);
        iframe.src = `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;
        youtubeViewer.style.display = 'block';
    }

    const closePdf = document.getElementById('close-pdf');
    if (closePdf) {
        closePdf.addEventListener('click', () => {
            const pdfViewer = document.getElementById('pdf-viewer');
            pdfViewer.style.display = 'none';
            document.getElementById('pdf-iframe').src = '';
        });
    }

    const closeYoutube = document.getElementById('close-youtube');
    if (closeYoutube) {
        closeYoutube.addEventListener('click', () => {
            const youtubeViewer = document.getElementById('youtube-viewer');
            youtubeViewer.style.display = 'none';
            document.getElementById('youtube-iframe').src = '';
        });
    }

    getSongList();
});
