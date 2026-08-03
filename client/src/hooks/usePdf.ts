import { useState, useEffect, useCallback } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export interface UsePdfProgress {
  loaded: number;
  total: number;
}

interface UsePdfReturn {
  pdf: PDFDocumentProxy | null;
  numPages: number;
  loading: boolean;
  error: Error | null;
  progress: UsePdfProgress;
  loadPage: (pageNum: number) => Promise<PDFPageProxy>;
  renderPageToCanvas: (page: PDFPageProxy, canvas: HTMLCanvasElement, scale?: number) => Promise<void>;
}

export function usePdf(url: string): UsePdfReturn {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<UsePdfProgress>({ loaded: 0, total: 0 });

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
    let targetUrl = '';
    if (typeof url === 'string') {
      targetUrl = url;
    } else if (url && typeof url === 'object') {
      targetUrl = (url as any).url || (url as any).src || '';
    }

    if (!targetUrl || typeof window === 'undefined') {
      if (!targetUrl) {
        setError(new Error('No valid PDF URL provided'));
        setLoading(false);
      }
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setProgress({ loaded: 0, total: 0 });

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        if (typeof window !== 'undefined') {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '4.0.379'}/pdf.worker.min.mjs`;
        }

        const docParams = {
          url: targetUrl,
          cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '4.0.379'}/cmaps/`,
          cMapPacked: true,
        };

        let pdfDoc: PDFDocumentProxy | null = null;
        try {
          const loadingTask = pdfjs.getDocument(docParams);
          loadingTask.onProgress = (data) => {
            if (isMounted && data.total > 0) {
              setProgress({ loaded: data.loaded, total: data.total });
            }
          };
          pdfDoc = await loadingTask.promise;
        } catch (directErr) {
          console.warn('[usePdf] Direct PDF getDocument failed, attempting fetch ArrayBuffer fallback:', directErr);
          const response = await fetch(targetUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch PDF catalog (HTTP ${response.status})`);
          }
          const contentLength = Number(response.headers.get('content-length') || 0);
          const reader = response.body?.getReader();
          let receivedBytes = 0;
          const chunks: Uint8Array[] = [];

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                chunks.push(value);
                receivedBytes += value.length;
                if (isMounted) {
                  setProgress({ loaded: receivedBytes, total: contentLength || receivedBytes });
                }
              }
            }
          }

          const arrayBuffer = new Uint8Array(receivedBytes);
          let position = 0;
          for (const chunk of chunks) {
            arrayBuffer.set(chunk, position);
            position += chunk.length;
          }

          const fallbackTask = pdfjs.getDocument({
            data: arrayBuffer,
            cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '4.0.379'}/cmaps/`,
            cMapPacked: true,
          });
          pdfDoc = await fallbackTask.promise;
        }

        console.log('[usePdf] PDF loaded successfully:', { numPages: pdfDoc.numPages });
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

  return { pdf, numPages, loading, error, progress, loadPage, renderPageToCanvas };
}