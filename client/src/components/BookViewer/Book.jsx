import React, { useEffect, useRef, useState, useCallback } from "react";
import BookPage from "./BookPage";

export default function Book({ pdf, currentPage, onPageChange, zoomScale }) {
  const containerRef = useRef(null);
  const pageFlipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });
  const [isMobile, setIsMobile] = useState(false);

  // Determine page dimensions and layout mode
  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    const mobile = width < 768;
    setIsMobile(mobile);

    // Book size calculations
    let bookWidth = 550;
    let bookHeight = 750;

    if (mobile) {
      // Mobile: single page, scaled to fit screen width
      bookWidth = Math.min(width - 32, 450);
      bookHeight = bookWidth * 1.4; // 1:1.4 aspect ratio
    } else if (width < 1024) {
      // Tablet
      bookWidth = 380;
      bookHeight = 520;
    } else {
      // Desktop
      bookWidth = 500;
      bookHeight = 680;
    }

    setDimensions({ width: bookWidth, height: bookHeight });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Handle PageFlip initialization
  useEffect(() => {
    if (!containerRef.current || !pdf) return;

    let pageFlipInstance = null;

    const initPageFlip = async () => {
      // Dynamic import of page-flip to prevent SSR issues
      const { PageFlip } = await import("page-flip");

      if (!containerRef.current) return;

      // Destroy previous instance if any
      if (pageFlipRef.current) {
        pageFlipRef.current.destroy();
      }

      pageFlipInstance = new PageFlip(containerRef.current, {
        width: dimensions.width,
        height: dimensions.height,
        size: "fixed",
        minWidth: 300,
        maxWidth: 1000,
        minHeight: 400,
        maxHeight: 1400,
        drawShadow: true,
        showCover: true,
        usePortrait: isMobile,
        startPage: currentPage - 1, // 0-indexed in PageFlip
        flippingTime: 800,
        swipeDistance: 30,
        maxShadowOpacity: 0.4,
      });

      pageFlipInstance.loadFromHTML(containerRef.current.querySelectorAll(".page"));
      pageFlipRef.current = pageFlipInstance;

      // Event listener for page turns
      pageFlipInstance.on("flip", (e) => {
        // PageFlip indexes from 0. Page 1 is index 0.
        onPageChange(e.data + 1);
      });
    };

    initPageFlip();

    return () => {
      if (pageFlipInstance) {
        pageFlipInstance.destroy();
      }
    };
  }, [pdf, dimensions, isMobile]);

  // External controller support (e.g. from parent/Toolbar)
  useEffect(() => {
    if (pageFlipRef.current && pdf) {
      const currentInstIndex = pageFlipRef.current.getCurrentPageIndex();
      const targetIndex = currentPage - 1;
      if (currentInstIndex !== targetIndex && targetIndex >= 0 && targetIndex < pdf.numPages) {
        pageFlipRef.current.turnToPage(targetIndex);
      }
    }
  }, [currentPage, pdf]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!pageFlipRef.current) return;

      if (e.key === "ArrowLeft") {
        pageFlipRef.current.flipPrev();
      } else if (e.key === "ArrowRight") {
        pageFlipRef.current.flipNext();
      } else if (e.key === " " || e.key === "Enter") {
        // Spacebar / Enter flips next
        e.preventDefault();
        pageFlipRef.current.flipNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const totalPages = pdf ? pdf.numPages : 0;

  // Build the list of pages with virtualization info
  const renderPagesList = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Virtualization rule: Render page if it is close to current page
      const isVisible = Math.abs(i - currentPage) <= 3 || i === 1 || i === totalPages;
      pages.push(
        <BookPage
          key={i}
          pageNumber={i}
          pdf={pdf}
          isVisible={isVisible}
          width={dimensions.width}
          height={dimensions.height}
        />
      );
    }
    return pages;
  };

  return (
    <div 
      className="flex justify-center items-center select-none"
      style={{
        transform: `scale(${zoomScale})`,
        transition: "transform 0.3s ease",
      }}
    >
      <div 
        className="relative py-8 md:py-12 px-4 md:px-8 bg-[#0D0D0D]/40 backdrop-blur-md rounded-[32px] border border-white/5 shadow-2xl"
        style={{
          perspective: "1500px",
        }}
      >
        {/* Book shadow base */}
        <div className="absolute inset-x-8 bottom-4 h-6 bg-black/60 blur-xl rounded-full z-0 pointer-events-none" />

        <div 
          ref={containerRef} 
          className="relative z-10 flex"
          style={{
            width: isMobile ? `${dimensions.width}px` : `${dimensions.width * 2}px`,
            height: `${dimensions.height}px`,
          }}
        >
          {pdf && renderPagesList()}
        </div>
      </div>
    </div>
  );
}
