import * as pdfjs from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
}

export interface PDFPageImage {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export interface PDFDocumentInfo {
  numPages: number;
  pageImages: PDFPageImage[];
}

export async function loadPDFDocument(url: string): Promise<pdfjs.PDFDocumentProxy> {
  const loadingTask = pdfjs.getDocument({ url, verbosity: 0 });
  return loadingTask.promise;
}

export async function renderPageToCanvas(
  pdf: pdfjs.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 2.0
): Promise<PDFPageImage> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const outputScale = window.devicePixelRatio || 1;
  
  canvas.width = viewport.width * outputScale;
  canvas.height = viewport.height * outputScale;
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;
  
  const transform = outputScale !== 1 
    ? [outputScale, 0, 0, outputScale, 0, 0] 
    : null;
  
  const renderContext: pdfjs.RenderParameters = {
    canvasContext: context,
    viewport: viewport,
    transform: transform,
  };
  
  await page.render(renderContext).promise;
  
  return {
    pageNumber,
    canvas,
    width: viewport.width,
    height: viewport.height,
  };
}

export async function renderAllPagesToCanvas(
  pdf: pdfjs.PDFDocumentProxy,
  scale: number = 2.0,
  onProgress?: (current: number, total: number) => void
): Promise<PDFPageImage[]> {
  const totalPages = pdf.numPages;
  const pageImages: PDFPageImage[] = [];
  
  for (let i = 1; i <= totalPages; i++) {
    const pageImage = await renderPageToCanvas(pdf, i, scale);
    pageImages.push(pageImage);
    onProgress?.(i, totalPages);
  }
  
  return pageImages;
}

export function canvasToDataURL(canvas: HTMLCanvasElement, type: string = 'image/jpeg', quality: number = 0.9): string {
  return canvas.toDataURL(type, quality);
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string = 'image/jpeg', quality: number = 0.9): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}