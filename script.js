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
                    `;
                    songList.appendChild(songElement);
                }
            });

            document.querySelectorAll('.view-pdf').forEach(button => {
                button.addEventListener('click', (e) => {
                    console.log('Button clicked');
                    const pdfUrl = e.target.getAttribute('data-pdf-url');
                    console.log('PDF URL:', pdfUrl);
                    openPdfViewer(pdfUrl);
                });
            });
        } catch (error) {
            console.error('Error fetching song list:', error);
        }
    }

    function openPdfViewer(url) {
        console.log('Opening PDF viewer with URL:', url);
        const iframe = document.getElementById('pdf-iframe');
        iframe.src = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        document.getElementById('pdf-viewer').style.display = 'block';
    }

    document.getElementById('close-pdf').addEventListener('click', () => {
        console.log('Closing PDF viewer');
        document.getElementById('pdf-viewer').style.display = 'none';
        document.getElementById('pdf-iframe').src = '';
    });

    getSongList();
});
