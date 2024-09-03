import * as pdfjsLib from './pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs/pdf.worker.mjs';

let currentPdf = null;
let currentPage = 1;
let pageCount = 0;

export async function openPdfViewer(url) {
    try {
        currentPdf = await pdfjsLib.getDocument(url).promise;
        pageCount = currentPdf.numPages;
        currentPage = 1;
        renderPage(currentPage);
        document.getElementById('pdf-viewer').style.display = 'flex';
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}

async function renderPage(num) {
    const page = await currentPdf.getPage(num);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.getElementById('pdf-render');
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: ctx,
        viewport: viewport
    };
    await page.render(renderContext);

    updatePageNumber();
}

function updatePageNumber() {
    const pageNumElement = document.getElementById('page-num');
    if (pageNumElement) {
        pageNumElement.textContent = `Page ${currentPage} of ${pageCount}`;
    }
}

export function initializePdfControls() {
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < pageCount) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    document.getElementById('close-pdf').addEventListener('click', () => {
        document.getElementById('pdf-viewer').style.display = 'none';
    });
}
