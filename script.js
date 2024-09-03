import * as pdfjsLib from './pdfjs/pdf.mjs';

document.addEventListener('DOMContentLoaded', () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs/pdf.worker.mjs';

    async function getSongList() {
        try {
            const response = await fetch('https://api.github.com/repos/wolfangus67/ricky/contents/songs');
            const files = await response.json();
            const ukuleleNeck = document.getElementById('ukulele-neck');

            files.forEach((file, index) => {
                if (file.name.endsWith('.pdf')) {
                    const songName = file.name.replace('.pdf', '').replace(/_/g, ' ');
                    const songElement = document.createElement('div');
                    songElement.className = 'song';
                    const fileUrl = file.download_url;
                    songElement.innerHTML = `
                        <h2>${songName}</h2>
                        <button class="view-pdf" data-pdf-url="${fileUrl}">Voir la tablature PDF</button>
                        <button class="view-tutorial" data-song-name="${songName}">Voir le tuto</button>
                    `;
                    ukuleleNeck.appendChild(songElement);

                    if (index < files.length - 1) {
                        const fret = document.createElement('div');
                        fret.className = 'fret';
                        ukuleleNeck.appendChild(fret);
                    }
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

    async function openPdfViewer(url) {
        const loadingTask = pdfjsLib.getDocument(url);
        try {
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const container = document.getElementById('pdf-container');
            if (!container) {
                console.error('PDF container not found');
                return;
            }
            container.innerHTML = ''; // Clear previous content
            const canvas = document.createElement('canvas');
            container.appendChild(canvas);

            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext);

            const pdfViewer = document.getElementById('pdf-viewer');
            if (pdfViewer) {
                pdfViewer.style.display = 'block';
            } else {
                console.error('PDF viewer element not found');
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    }

    function openYoutubeViewer(songName) {
        const searchQuery = encodeURIComponent(`ricky somborn tutorial ${songName}`);
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
        window.open(youtubeSearchUrl, '_blank');
    }

    const closePdf = document.getElementById('close-pdf');
    if (closePdf) {
        closePdf.addEventListener('click', () => {
            const pdfViewer
