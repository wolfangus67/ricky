// pdfViewer.js

let pdfjsLib;
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let canvas;
let ctx;

export async function initializePdfViewer() {
    try {
        pdfjsLib = await import('./pdfjs/pdf.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs/pdf.worker.mjs';
    } catch (error) {
        console.error('Error initializing PDF.js:', error);
        showErrorMessage('Erreur lors de l\'initialisation du visualiseur PDF.');
    }
}

export async function openPdfViewer(pdfUrl) {
    if (!pdfjsLib) {
        await initializePdfViewer();
    }

    const pdfViewer = document.getElementById('pdf-viewer');
    pdfViewer.style.display = 'flex';

    try {
        const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            withCredentials: true,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/cmaps/',
            cMapPacked: true,
        });
        
        pdfDoc = await loadingTask.promise;
        pageNum = 1;
        renderPage(pageNum);
        setupPdfControls();
    } catch (error) {
        console.error('Erreur lors du chargement du PDF:', error);
        console.error('Détails de l\'erreur:', error.message);
        console.error('URL du PDF:', pdfUrl);
        showErrorMessage('Erreur lors du chargement du PDF. Veuillez vérifier votre connexion et réessayer.');
    }
}

async function renderPage(num) {
    pageRendering = true;
    try {
        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: scale });
        canvas = document.getElementById('pdf-render');
        ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        pageRendering = false;

        if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
        }
    } catch (error) {
        console.error('Error rendering page:', error);
        pageRendering = false;
    }
    updatePageInfo();
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function updatePageInfo() {
    document.getElementById('page-num').textContent = pageNum;
    document.getElementById('page-count').textContent = pdfDoc.numPages;
}

function setupPdfControls() {
    document.getElementById('prev-page').addEventListener('click', onPrevPage);
    document.getElementById('next-page').addEventListener('click', onNextPage);
    document.getElementById('close-pdf').addEventListener('click', closePdfViewer);
}

function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

function closePdfViewer() {
    const pdfViewer = document.getElementById('pdf-viewer');
    pdfViewer.style.display = 'none';
    pdfDoc = null;
    pageNum = 1;
    pageRendering = false;
    pageNumPending = null;
}

function showErrorMessage(message) {
    console.error('Erreur PDF:', message);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
}
