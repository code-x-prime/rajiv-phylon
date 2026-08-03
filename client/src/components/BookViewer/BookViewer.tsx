'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from './Loader';
import { usePdf } from '@/hooks/usePdf';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  Layers,
  Sparkles,
} from 'lucide-react';

const PDF_URL = 'https://pub-58262d6d8d8f475fb5d97db5d155da43.r2.dev/2026%20CATALOGUE.pdf';

interface BookViewerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  zoomScale?: number;
  pdfUrl?: string;
  onTotalPagesChange?: (total: number) => void;
}

export default function BookViewer({
  currentPage,
  onPageChange,
  pdfUrl = PDF_URL,
  onTotalPagesChange,
}: BookViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [rendering, setRendering] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'scroll'>('single');
  const [pageInput, setPageInput] = useState(String(currentPage));

  const { pdf, numPages, loading, error, progress } = usePdf(pdfUrl);

  const totalPages = numPages || 0;

  useEffect(() => {
    if (pdf && numPages > 0) {
      onTotalPagesChange?.(numPages);
    }
  }, [pdf, numPages, onTotalPagesChange]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Single page canvas rendering effect
  useEffect(() => {
    if (!pdf || totalPages === 0 || !canvasRef.current || viewMode !== 'single') return;

    let isCurrent = true;

    const renderCurrentPage = async () => {
      try {
        setRendering(true);
        const page = await pdf.getPage(currentPage);
        if (!isCurrent || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const containerWidth = Math.min(window.innerWidth - 32, 900);
        const viewportRaw = page.getViewport({ scale: 1.0 });
        
        const baseScale = containerWidth / viewportRaw.width;
        const finalScale = Math.max(baseScale * zoomScale * 1.35, 0.4);
        
        const viewport = page.getViewport({ scale: finalScale });
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = viewport.width * outputScale;
        canvas.height = viewport.height * outputScale;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const context = canvas.getContext('2d')!;
        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

        await page.render({ canvasContext: context, viewport }).promise;
        if (isCurrent) setRendering(false);
      } catch (err) {
        console.error('[PdfViewer] Render page error:', err);
        if (isCurrent) setRendering(false);
      }
    };

    renderCurrentPage();

    return () => {
      isCurrent = false;
    };
  }, [pdf, currentPage, totalPages, zoomScale, viewMode]);

  // Touch Swipe Handler for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentPage < totalPages) {
        onPageChange(currentPage + 1);
      } else if (diff < 0 && currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
    touchStartRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) onPageChange(currentPage - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onPageChange]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(pageInput, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      onPageChange(val);
    } else {
      setPageInput(String(currentPage));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] w-full">
        <Loader progress={progress.loaded} total={progress.total} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 text-center bg-red-950/20 border border-red-500/30 rounded-2xl">
        <p className="text-red-400 font-semibold mb-2 text-sm sm:text-base">Failed to load catalogue</p>
        <p className="text-xs text-white/60 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#F5B400] text-black font-semibold rounded-xl text-xs hover:bg-[#e0a300] transition-all"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-full select-none">
      {/* Viewer Control Toolbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 mb-4 shadow-2xl">
        {/* Navigation Prev/Next */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-xl p-1">
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1 px-2">
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputSubmit}
              className="w-10 text-center bg-white/10 border border-white/10 rounded px-1 py-0.5 text-xs font-mono font-semibold text-[#F5B400] focus:outline-none focus:border-[#F5B400]"
            />
            <span className="text-white/30 text-xs font-mono">/ {totalPages}</span>
          </form>

          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-1">
          <button
            onClick={() => setZoomScale(prev => Math.max(prev - 0.2, 0.6))}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoomScale(1.0)}
            className="px-2 text-[11px] font-mono text-white/60 hover:text-[#F5B400] transition-colors"
            title="Reset Zoom"
          >
            {Math.round(zoomScale * 100)}%
          </button>
          <button
            onClick={() => setZoomScale(prev => Math.min(prev + 0.2, 2.2))}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* View Mode & Download Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 border border-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'single'
                  ? 'bg-[#F5B400] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Single Page
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'scroll'
                  ? 'bg-[#F5B400] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Scroll View
            </button>
          </div>

          <a
            href={pdfUrl}
            download="Rajiv-Phylon-Catalogue-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#F5B400] text-black hover:bg-[#e0a300] transition-all flex items-center justify-center"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Main Canvas Display Area */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full flex flex-col items-center justify-center min-h-[400px] sm:min-h-[600px] bg-[#0E0E0E] border border-white/5 rounded-3xl p-2 sm:p-6 shadow-2xl relative overflow-auto max-w-full"
      >
        {rendering && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs text-[#F5B400]">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            Rendering...
          </div>
        )}

        {viewMode === 'single' ? (
          <div className="flex justify-center items-center max-w-full overflow-auto p-2">
            <canvas
              ref={canvasRef}
              className="rounded-xl shadow-2xl border border-white/10 max-w-full h-auto bg-white transition-transform duration-300"
            />
          </div>
        ) : (
          <ScrollViewer pdf={pdf} totalPages={totalPages} scale={zoomScale} />
        )}
      </div>

      {/* Mobile Swipe Hint */}
      <p className="text-[11px] text-white/30 font-mono mt-3 text-center">
        Keyboard: &larr; &rarr; Arrow keys &middot; Mobile: Swipe left/right to change pages
      </p>
    </div>
  );
}

function ScrollViewer({ pdf, totalPages, scale }: { pdf: any; totalPages: number; scale: number }) {
  return (
    <div className="flex flex-col items-center gap-6 w-full py-4 max-w-full overflow-y-auto max-h-[75vh]">
      {Array.from({ length: totalPages }, (_, idx) => (
        <ScrollCanvasPage key={idx + 1} pageNumber={idx + 1} pdf={pdf} scale={scale} totalPages={totalPages} />
      ))}
    </div>
  );
}

function ScrollCanvasPage({ pageNumber, pdf, scale, totalPages }: { pageNumber: number; pdf: any; scale: number; totalPages: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !pdf || !canvasRef.current || rendered) return;
    let isCurrent = true;

    const render = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (!isCurrent || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const containerWidth = Math.min(window.innerWidth - 32, 850);
        const viewportRaw = page.getViewport({ scale: 1.0 });
        const finalScale = (containerWidth / viewportRaw.width) * scale * 1.3;
        
        const viewport = page.getViewport({ scale: finalScale });
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = viewport.width * outputScale;
        canvas.height = viewport.height * outputScale;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const context = canvas.getContext('2d')!;
        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

        await page.render({ canvasContext: context, viewport }).promise;
        if (isCurrent) setRendered(true);
      } catch (err) {
        console.error('[ScrollCanvasPage] Render error:', err);
      }
    };

    render();
    return () => {
      isCurrent = false;
    };
  }, [isVisible, pdf, pageNumber, scale, rendered]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2 max-w-full min-h-[350px]">
      <canvas
        ref={canvasRef}
        className={`rounded-xl shadow-xl border border-white/10 bg-white max-w-full transition-opacity duration-300 ${
          rendered ? 'opacity-100' : 'hidden'
        }`}
      />
      {!rendered && (
        <div className="w-[300px] sm:w-[600px] h-[400px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/30 text-xs font-mono animate-pulse">
          Page {pageNumber} of {totalPages}
        </div>
      )}
      <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
        Page {pageNumber} of {totalPages}
      </span>
    </div>
  );
}