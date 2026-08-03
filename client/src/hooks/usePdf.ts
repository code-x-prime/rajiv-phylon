import { useState, useEffect, useCallback } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

interface UsePdfReturn {
  pdf: PDFDocumentProxy | null;
  numPages: number;
  loading: boolean;
  error: Error | null;
  loadPage: (pageNum: number) => Promise<PDFPageProxy>;
  renderPageToCanvas: (page: PDFPageProxy, canvas: HTMLCanvasElement, scale?: number) => Promise<void>;
}

export function usePdf(url: string): UsePdfReturn {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(async (pageNum: number): Promise<PDFPageProxy> => {
    if (!pdf) throw new Error('PDF not loaded');
    return pdf.getPage(pageNum);
  }, [pdf]);

  const renderPageToCanvas = useCallback(
    async (page: PDFPageProxy, canvas: HTMLCanvasElement, scale = 2.0): Promise<void> => {
      const viewport = page.getViewport({ scale });
      const outputScale = window.devicePixelRatio || 1;
      
      canvas.width = viewport.width * outputScale;
      canvas.height = viewport.height * outputScale;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      const context = canvas.getContext('2d')!;
      context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

      await page.render({ canvasContext: context, viewport }).promise;
    },
    []
  );

  useEffect(() => {
    if (!url || typeof window === 'undefined') return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        if (typeof window !== 'undefined') {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '4.0.379'}/pdf.worker.min.mjs`;
        }

        const loadingTask = pdfjs.getDocument(url);
        const pdfDoc = await loadingTask.promise;

        console.log('[usePdf] PDF loaded:', { numPages: pdfDoc.numPages });
        if (isMounted) {
          setPdf(pdfDoc);
          setNumPages(pdfDoc.numPages);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('[usePdf] Error loading PDF:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { pdf, numPages, loading, error, loadPage, renderPageToCanvas };
}