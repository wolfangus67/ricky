pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.js';

async function getSongList() {
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
            const pdfUrl = e.target.getAttribute('data-pdf-url');
            openPdfViewer(pdfUrl);
        });
    });
}

async function openPdfViewer(url) {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.getElementById('pdf-render');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    await page.render(renderContext);

    document.getElementById('pdf-viewer').style.display = 'block';
}

document.getElementById('close-pdf').addEventListener('click', () => {
    document.getElementById('pdf-viewer').style.display = 'none';
});

getSongList();
