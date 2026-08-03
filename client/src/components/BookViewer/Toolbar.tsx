'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  RotateCcw,
  RotateCw,
  BookOpen,
} from 'lucide-react';

interface ToolbarProps {
  currentPage: number;
  totalPages: number;
  zoomScale: number;
  setZoomScale: (scale: number | ((prev: number) => number)) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  pdfUrl: string;
  onPrev: () => void;
  onNext: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
}

export function Toolbar({
  currentPage,
  totalPages,
  zoomScale,
  setZoomScale,
  isFullscreen,
  toggleFullscreen,
  pdfUrl,
  onPrev,
  onNext,
  onRotateLeft,
  onRotateRight,
}: ToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleZoomIn = () => {
    setZoomScale((prev: number) => Math.min(prev + 0.15, 2.5));
  };

  const handleZoomOut = () => {
    setZoomScale((prev: number) => Math.max(prev - 0.15, 0.5));
  };

  const handleZoomReset = () => {
    setZoomScale(1.0);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full bg-[#121212]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-3 sm:px-6 sm:py-4 shadow-2xl max-w-full overflow-hidden">
      {/* Title / Badge */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#F5B400]/20 to-[#F5B400]/5 flex items-center justify-center shrink-0 border border-[#F5B400]/10">
          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5B400]" />
        </div>
        <div className="min-w-0 text-center sm:text-left">
          <h4 className="text-xs sm:text-sm font-heading font-semibold text-white tracking-wide truncate">
            Rajiv Phylon Catalogue
          </h4>
          <p className="text-[10px] text-white/40 font-body">
            {totalPages > 0 ? `${totalPages} Pages` : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
        {/* Pagination Prev / Next */}
        <div className="flex items-center gap-1.5 shrink-0 bg-black/40 border border-white/5 rounded-xl p-1">
          <button
            onClick={onPrev}
            disabled={currentPage <= 1}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all duration-200"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-white">
            <span className="text-[#F5B400] font-semibold">{currentPage}</span>
            <span className="text-white/20">/</span>
            <span className="text-white/60">{totalPages || 1}</span>
          </div>

          <button
            onClick={onNext}
            disabled={currentPage >= totalPages}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all duration-200"
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-1 shrink-0">
          <button
            onClick={handleZoomOut}
            disabled={zoomScale <= 0.5}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="px-1.5 text-[10px] font-mono text-white/50 min-w-[36px] text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomScale >= 2.5}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Rotation & Action buttons */}
        {showAdvanced && onRotateLeft && onRotateRight && (
          <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-1 shrink-0">
            <button
              onClick={onRotateLeft}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
              title="Rotate Left"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onRotateRight}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
              title="Rotate Right"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleFullscreen}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 shrink-0"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <a
            href={pdfUrl}
            download="Rajiv-Phylon-Catalogue-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-2.5 rounded-xl bg-[#F5B400] text-black hover:bg-[#e0a300] hover:shadow-[0_4px_20px_rgba(245,180,0,0.3)] transition-all duration-200 shrink-0 flex items-center justify-center"
            title="Download PDF Catalogue"
          >
            <Download className="h-4 w-4" />
          </a>

          {onRotateLeft && onRotateRight && (
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 shrink-0"
              title={showAdvanced ? 'Hide Advanced Controls' : 'Show Advanced Controls'}
            >
              <RotateCw className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}