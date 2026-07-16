'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import BookPage from './BookPage';
import { usePdf } from '@/hooks/usePdf';

const PDF_URL = 'https://pub-58262d6d8d8f475fb5d97db5d155da43.r2.dev/rajiv-phylon/2026%20CATALOGUE.pdf';

interface BookViewerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  zoomScale: number;
}

export default function BookViewer({ currentPage, onPageChange, zoomScale }: BookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  const [pdfReady, setPdfReady] = useState(false);

  const { pdf, numPages, loading, error, renderPageToCanvas } = usePdf(PDF_URL);

  useEffect(() => {
    console.log('[BookViewer] pdf state:', { pdf: !!pdf, numPages, loading, error });
    if (pdf && numPages > 0) {
      setPdfReady(true);
    }
  }, [pdf, numPages, loading, error]);

  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const mobile = width < 768;
    setIsMobile(mobile);

    let bookWidth = 500;
    let bookHeight = 700;

    if (mobile) {
      bookWidth = Math.min(width - 32, 420);
      bookHeight = Math.round(bookWidth * 1.4);
    } else if (width < 1024) {
      bookWidth = 380;
      bookHeight = 520;
    } else if (width < 1440) {
      bookWidth = 450;
      bookHeight = 620;
    } else {
      bookWidth = 550;
      bookHeight = 760;
    }

    setDimensions({ width: bookWidth, height: bookHeight });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

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
          onRendered={() => setRenderedPages(prev => new Set(prev).add(i))}
          scale={2.0}
        />
      );
    }
    return pages;
  }, [totalPages, currentPage, renderedPages, pdf, dimensions.width, dimensions.height]);

  useEffect(() => {
    if (!containerRef.current || !pdfReady || !totalPages) return;

    let flipBookInstance: any = null;
    let initialized = false;

    const initFlipBook = async () => {
      if (!containerRef.current || initialized) return;
      
      const { HTMLFlipBook } = await import('page-flip');
      
      if (flipBookRef.current) {
        flipBookRef.current.destroy();
      }

      const pageElements = containerRef.current.querySelectorAll('.page');
      if (pageElements.length === 0) return;

      flipBookInstance = new HTMLFlipBook(containerRef.current, {
        width: dimensions.width,
        height: dimensions.height,
        size: 'fixed',
        minWidth: 300,
        maxWidth: 1200,
        minHeight: 400,
        maxHeight: 1600,
        drawShadow: true,
        showCover: true,
        usePortrait: isMobile,
        startPage: currentPage - 1,
        flippingTime: 800,
        swipeDistance: 30,
        maxShadowOpacity: 0.4,
        showPageCorners: true,
        cornerWidth: isMobile ? 60 : 80,
        cornerHeight: isMobile ? 60 : 80,
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
        if (!renderedPages.has(pageNum)) {
          setRenderedPages(prev => new Set(prev).add(pageNum));
        }
        if (pageIndex + 1 < totalPages && !renderedPages.has(pageIndex + 2)) {
          setRenderedPages(prev => new Set(prev).add(pageIndex + 2));
        }
      });
    };

    initFlipBook();

    return () => {
      if (flipBookInstance) {
        flipBookInstance.destroy();
      }
    };
  }, [pdfReady, totalPages, dimensions, isMobile, currentPage, renderedPages, onPageChange]);

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
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-full max-w-[1400px]">
          <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-gradient-to-b from-[#121212] to-[#080808] rounded-2xl border border-white/5 p-8 text-center shadow-2xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#F5B400]/10 rounded-full blur-2xl animate-pulse" />
              <div className="h-16 w-16 text-[#F5B400] animate-spin relative z-10">
                <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle className="animate-spin" cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path className="animate-spin" strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              </div>
            </div>
            <h3 className="font-heading text-xl font-semibold text-white tracking-wide mb-2">
              Preparing Premium Catalogue
            </h3>
            <p className="text-white/40 text-sm font-body max-w-xs mb-6">
              Rendering pages for high-definition 3D experience.
            </p>
          </div>
        </div>
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
    <div className="flex justify-center items-center select-none w-full">
      <div 
        className="relative py-8 md:py-12 px-4 md:px-8 bg-[#0D0D0D]/40 backdrop-blur-md rounded-[32px] border border-white/5 shadow-2xl w-full"
        style={{
          perspective: '1500px',
        }}
      >
        <div className="absolute inset-x-8 bottom-4 h-6 bg-black/60 blur-xl rounded-full z-0 pointer-events-none" />

        <div 
          ref={containerRef} 
          className="relative z-10 flex"
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