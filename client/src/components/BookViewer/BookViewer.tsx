'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import BookPage from './BookPage';
import { Loader } from './Loader';
import { usePdf } from '@/hooks/usePdf';

const PDF_URL = 'https://pub-58262d6d8d8f475fb5d97db5d155da43.r2.dev/2026%20CATALOGUE.pdf';

interface BookViewerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  zoomScale: number;
  pdfUrl?: string;
  onTotalPagesChange?: (total: number) => void;
}

export default function BookViewer({ currentPage, onPageChange, zoomScale, pdfUrl = PDF_URL, onTotalPagesChange }: BookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  const [pdfReady, setPdfReady] = useState(false);

  const { pdf, numPages, loading, error, progress } = usePdf(pdfUrl);

  useEffect(() => {
    console.log('[BookViewer] pdf state:', { pdf: !!pdf, numPages, loading, error });
    if (pdf && numPages > 0) {
      setPdfReady(true);
      onTotalPagesChange?.(numPages);
    }
  }, [pdf, numPages, loading, error, onTotalPagesChange]);

  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const mobile = width < 768;
    setIsMobile(mobile);

    let bookWidth = 500;
    let bookHeight = 700;

    if (mobile) {
      // Calculate available width with padding considered (e.g. 24px total)
      const availWidth = Math.min(width - 24, 400);
      bookWidth = Math.max(availWidth, 260);
      bookHeight = Math.round(bookWidth * 1.38);
    } else if (width < 1024) {
      bookWidth = 360;
      bookHeight = 500;
    } else if (width < 1440) {
      bookWidth = 440;
      bookHeight = 600;
    } else {
      bookWidth = 520;
      bookHeight = 720;
    }

    setDimensions({ width: bookWidth, height: bookHeight });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const handlePageRendered = useCallback((pageNum: number) => {
    setRenderedPages(prev => {
      if (prev.has(pageNum)) return prev;
      const next = new Set(prev);
      next.add(pageNum);
      return next;
    });
  }, []);

  const totalPages = numPages || 0;

  const renderPages = useMemo(() => {
    const pages: React.ReactElement[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const isVisible = renderedPages.has(i) ||
        Math.abs(i - currentPage) <= 2 ||
        i === 1 ||
        i === totalPages;

      pages.push(
        <BookPage
          key={i}
          pageNumber={i}
          pdf={pdf}
          isVisible={isVisible}
          width={dimensions.width}
          height={dimensions.height}
          onRendered={() => handlePageRendered(i)}
          scale={2.0}
        />
      );
    }
    return pages;
  }, [totalPages, currentPage, renderedPages, pdf, dimensions.width, dimensions.height, handlePageRendered]);

  useEffect(() => {
    if (!containerRef.current || !pdfReady || !totalPages) return;

    let flipBookInstance: any = null;
    let initialized = false;

    const initFlipBook = async () => {
      if (!containerRef.current || initialized) return;

      const pageFlipMod = await import('page-flip');
      const PageFlipClass = pageFlipMod.PageFlip || (pageFlipMod as any).default?.PageFlip || (pageFlipMod as any).default;

      if (!PageFlipClass) {
        console.error('[BookViewer] Could not find PageFlip constructor class');
        return;
      }

      if (flipBookRef.current) {
        try {
          flipBookRef.current.destroy();
        } catch (_) {}
      }

      const pageElements = containerRef.current.querySelectorAll('.page');
      if (pageElements.length === 0) return;

      flipBookInstance = new PageFlipClass(containerRef.current, {
        width: dimensions.width,
        height: dimensions.height,
        size: 'fixed',
        minWidth: 260,
        maxWidth: 1200,
        minHeight: 360,
        maxHeight: 1600,
        drawShadow: true,
        showCover: true,
        usePortrait: isMobile,
        startPage: currentPage - 1,
        flippingTime: 800,
        swipeDistance: 30,
        maxShadowOpacity: 0.4,
        showPageCorners: true,
        cornerWidth: isMobile ? 40 : 80,
        cornerHeight: isMobile ? 40 : 80,
      });

      flipBookInstance.loadFromHTML(pageElements);
      flipBookRef.current = flipBookInstance;
      initialized = true;
      setIsInitialized(true);

      flipBookInstance.on('flip', (e: any) => {
        onPageChange(e.data + 1);
      });

      flipBookInstance.on('flipStart', (e: any) => {
        const pageIndex = e.data;
        const pageNum = pageIndex + 1;
        handlePageRendered(pageNum);
        if (pageIndex + 1 < totalPages) {
          handlePageRendered(pageIndex + 2);
        }
      });
    };

    initFlipBook();

    return () => {
      if (flipBookInstance) {
        try {
          flipBookInstance.destroy();
        } catch (_) {}
      }
    };
  }, [pdfReady, totalPages, dimensions, isMobile, onPageChange, handlePageRendered]);

  useEffect(() => {
    if (flipBookRef.current && pdfReady) {
      const currentInstIndex = flipBookRef.current.getCurrentPageIndex();
      const targetIndex = currentPage - 1;
      if (currentInstIndex !== targetIndex && targetIndex >= 0 && targetIndex < totalPages) {
        flipBookRef.current.turnToPage(targetIndex);
      }
    }
  }, [currentPage, pdfReady, totalPages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!flipBookRef.current) return;

      if (e.key === 'ArrowLeft') {
        flipBookRef.current.flipPrev();
      } else if (e.key === 'ArrowRight') {
        flipBookRef.current.flipNext();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipBookRef.current.flipNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] w-full">
        <Loader progress={progress.loaded} total={progress.total} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-full max-w-[1400px]">
          <div className="p-8 text-center bg-red-950/20 border border-red-500/30 rounded-2xl">
            <p className="text-red-400 font-semibold mb-2">Failed to load the catalogue</p>
            <p className="text-xs text-white/60 mb-4">{error.message || 'Unknown error'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-xs font-semibold"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center select-none w-full max-w-full overflow-hidden">
      <div
        className="relative py-4 md:py-12 px-2 md:px-8 bg-[#0D0D0D]/40 backdrop-blur-md rounded-2xl sm:rounded-[32px] border border-white/5 shadow-2xl w-full max-w-full flex items-center justify-center overflow-hidden"
        style={{
          perspective: '1500px',
        }}
      >
        <div className="absolute inset-x-8 bottom-4 h-6 bg-black/60 blur-xl rounded-full z-0 pointer-events-none" />

        <div
          ref={containerRef}
          className="relative z-10 flex justify-center items-center max-w-full"
          style={{
            width: isMobile ? `${dimensions.width}px` : `${dimensions.width * 2}px`,
            height: `${dimensions.height}px`,
          }}
        >
          {pdf && renderPages}
        </div>
      </div>
    </div>
  );
}