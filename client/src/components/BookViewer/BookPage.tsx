'use client';

import React, { useEffect, useRef, useState, memo, forwardRef } from 'react';

interface BookPageProps {
  pageNumber: number;
  pdf: any;
  isVisible: boolean;
  width: number;
  height: number;
  onRendered?: () => void;
  scale?: number;
}

export const BookPage = memo(forwardRef<HTMLDivElement, BookPageProps>(
  ({ pageNumber, pdf, isVisible, width, height, onRendered, scale = 2.0 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(false);
    const [rendered, setRendered] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      if (!isVisible || !pdf || !canvasRef.current) {
        return;
      }

      let isCurrent = true;
      let animationFrame: number;

      const renderPage = async () => {
        try {
          setLoading(true);
          setError(null);
          const page = await pdf.getPage(pageNumber);
          
          if (!isCurrent || !canvasRef.current) return;

          const canvas = canvasRef.current;
          const viewport = page.getViewport({ scale });
          const outputScale = window.devicePixelRatio || 1;

          canvas.width = viewport.width * outputScale;
          canvas.height = viewport.height * outputScale;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          const context = canvas.getContext('2d')!;
          context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

          await page.render({ canvasContext: context, viewport }).promise;

          if (isCurrent) {
            setRendered(true);
            setLoading(false);
            onRendered?.();
          }
        } catch (err) {
          if (isCurrent) {
            setError(err as Error);
            setLoading(false);
            setRendered(true);
          }
        }
      };

      renderPage();

      return () => {
        isCurrent = false;
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    }, [pdf, pageNumber, isVisible, scale, onRendered]);

    const isCover = pageNumber === 1 || pageNumber === pdf?.numPages;
    const isLeftPage = pageNumber % 2 === 0;

    return (
      <div
        ref={ref}
        className={`page bg-white relative shadow-lg overflow-hidden flex flex-col ${
          isCover ? 'hard-cover' : 'soft-page'
        }`}
        style={{ width: `${width}px`, height: `${height}px` }}
        data-density={isCover ? 'hard' : 'soft'}
        data-page={pageNumber}
      >
        <div
          className={`absolute inset-y-0 w-[30px] z-10 pointer-events-none opacity-20 ${
            isLeftPage
              ? 'right-0 bg-gradient-to-r from-transparent to-black'
              : 'left-0 bg-gradient-to-l from-transparent to-black'
          }`}
        />

        {isVisible && (
          <canvas
            ref={canvasRef}
            className={`w-full h-full transition-opacity duration-500 object-contain ${
              rendered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {(!rendered || loading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <div className="w-8 h-8 rounded-full border-2 border-t-[#F5B400] border-gray-200 animate-spin mb-2" />
            <span className="text-xs font-mono font-medium">PAGE {pageNumber}</span>
          </div>
        )}

        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-10">
          <span className="text-[10px] font-mono tracking-widest text-black/30 font-medium px-2 py-0.5 bg-white/60 rounded">
            {pageNumber}
          </span>
        </div>
      </div>
    );
  }
));

BookPage.displayName = 'BookPage';

export default BookPage;