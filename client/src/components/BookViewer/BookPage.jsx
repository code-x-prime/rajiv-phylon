import React, { useEffect, useRef, useState } from "react";

const BookPage = React.forwardRef(({ pageNumber, pdf, isVisible, width, height }, ref) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    // If the page is not visible and not near the current page, or pdf isn't loaded, don't render
    if (!isVisible || !pdf) {
      return;
    }

    let isCurrent = true;
    const renderPage = async () => {
      try {
        setLoading(true);
        const page = await pdf.getPage(pageNumber);
        
        if (!isCurrent || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // High quality scale: Render at 2x and size down with CSS for crispness
        const scale = 2.0;
        const viewport = page.getViewport({ scale });

        // Calculate scale to match our container dimensions
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = viewport.width * outputScale;
        canvas.height = viewport.height * outputScale;
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : null;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          transform: transform,
        };

        await page.render(renderContext).promise;
        
        if (isCurrent) {
          setRendered(true);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error rendering page ${pageNumber}:`, err);
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      isCurrent = false;
    };
  }, [pdf, pageNumber, isVisible]);

  return (
    <div 
      ref={ref} 
      className="page bg-white relative shadow-lg overflow-hidden flex flex-col justify-between"
      style={{ width: `${width}px`, height: `${height}px` }}
      data-density={pageNumber === 1 || pageNumber === pdf?.numPages ? "hard" : "soft"}
    >
      {/* Spine shadow effect */}
      <div className={`absolute inset-y-0 w-[30px] z-10 pointer-events-none opacity-20 ${
        pageNumber % 2 === 0 
          ? "right-0 bg-gradient-to-r from-transparent to-black" 
          : "left-0 bg-gradient-to-l from-transparent to-black"
      }`} />

      {/* Render Canvas if visible */}
      {isVisible && (
        <canvas 
          ref={canvasRef} 
          className={`w-full h-full transition-opacity duration-500 object-contain ${
            rendered ? "opacity-100" : "opacity-0"
          }`} 
        />
      )}

      {/* Loader / Placeholder */}
      {(!rendered || loading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
          <div className="w-8 h-8 rounded-full border-2 border-t-[#F5B400] border-gray-200 animate-spin mb-2" />
          <span className="text-xs font-mono font-medium">PAGE {pageNumber}</span>
        </div>
      )}

      {/* Page Number Footer */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-10">
        <span className="text-[10px] font-mono tracking-widest text-black/30 font-medium px-2 py-0.5 bg-white/60 rounded">
          {pageNumber}
        </span>
      </div>
    </div>
  );
});

BookPage.displayName = "BookPage";

export default React.memo(BookPage);
