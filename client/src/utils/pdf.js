import * as pdfjs from 'pdfjs-dist';

// Configure the pdfjs worker to run in a web worker via CDN
if (typeof window !== 'undefined') {
  // Use a reliable CDN for the worker matching standard pdfjs version
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
}

export async function loadPDF(url) {
  const loadingTask = pdfjs.getDocument(url);
  return await loadingTask.promise;
}
