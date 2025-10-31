import "pdfjs-dist/build/pdf.worker.mjs";

export async function generatePdfThumbnail({
  file,
}: {
  file: File | Blob;
}): Promise<Blob | null> {
  // Make sure code runs only in browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("generatePdfThumbnail can only be run in the browser.");
  }

  // Dynamic import to avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");

  const arrayBuffer = await file.arrayBuffer();

  // Use explicit types from pdfjs-dist
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);

  // Viewport & canvas rendering
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    console.error("Canvas 2D context tidak tersedia");
    return null;
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport, canvas }).promise;

  // Convert canvas to Blob
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8)
  );

  return blob;
}
