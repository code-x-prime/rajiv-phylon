import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  BookOpen,
} from "lucide-react";

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
}) {
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.15, 1.6));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 0.15, 0.75));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 shadow-2xl">
      {/* Left: Info */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5B400]/20 to-[#F5B400]/5 flex items-center justify-center shrink-0 border border-[#F5B400]/10">
          <BookOpen className="h-5 w-5 text-[#F5B400]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-display font-semibold text-white tracking-wide truncate">
            Rajiv Phylon Catalogue
          </h4>
          <p className="text-[10px] text-white/40 font-body">
            Premium Polymer Footwear Soles &middot; {totalPages} pages
          </p>
        </div>
      </div>

      {/* Center: Navigation Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onPrev}
          disabled={currentPage <= 1}
          className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white/70 transition-all duration-200"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-white">
          <span className="text-[#F5B400] font-semibold">{currentPage}</span>
          <span className="text-white/20">/</span>
          <span className="text-white/60">{totalPages}</span>
        </div>

        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white/70 transition-all duration-200"
          aria-label="Next Page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Right: Actions (Zoom, Fullscreen, Download) */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Zoom */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-1 shrink-0">
          <button
            onClick={handleZoomOut}
            disabled={zoomScale <= 0.75}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="px-2 text-[10px] font-mono text-white/50 min-w-[40px] text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomScale >= 1.6}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 shrink-0"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
        </button>

        {/* Download */}
        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#F5B400] text-black hover:bg-[#e0a300] hover:shadow-[0_4px_20px_rgba(245,180,0,0.3)] transition-all duration-200 shrink-0 flex items-center justify-center"
          title="Download PDF Catalogue"
        >
          <Download className="h-4.5 w-4.5" />
        </a>
      </div>
    </div>
  );
}
