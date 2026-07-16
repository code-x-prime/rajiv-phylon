import { useState, useEffect } from "react";
import { loadPDF } from "@/utils/pdf";

export function usePdf(url) {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    loadPDF(url)
      .then((pdfDoc) => {
        if (isMounted) {
          setPdf(pdfDoc);
          setNumPages(pdfDoc.numPages);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading PDF:", err);
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { pdf, numPages, loading, error };
}
