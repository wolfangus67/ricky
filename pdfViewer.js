// pdfViewer.mjs

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let canvas;
let ctx;

export function initializePdfControls() {
    document.getElementById('prev-page').addEventListener('click', onPrevPage);
    document.getElementById('next-page').addEventListener('click', onNextPage);
    document.getElementById('close-pdf').addEventListener('click', closePdfViewer);
    canvas = document.getElementById('pdf-render');
    ctx = canvas.getContext('2d');
}

export async function openPdfViewer(pdfUrl) {
    document.getElementById('pdf-viewer').style.display = 'flex';
    try {
        const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.esm.min.js');
        pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
        document.getElementById('page-num').textContent = pageNum;
        renderPage(pageNum);
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}

async function renderPage(num) {
    pageRendering = true;
    try {
        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({scale: scale});
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
    document.getElementById('page-num').textContent = num;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
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
    document.getElementById('pdf-viewer').style.display = 'none';
}
