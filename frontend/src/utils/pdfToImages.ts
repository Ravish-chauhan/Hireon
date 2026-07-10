// src/utils/pdfToImages.ts

import * as pdfjsLib from "pdfjs-dist";

// Worker path for 3.11.174
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function pdfToImagesFromUrl(pdfUrl: string): Promise<string[]> {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    const images: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 3 });

      // Create canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // PDF.js v3 render call
      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      // Convert to BASE64 image
      const imgData = canvas.toDataURL("image/png");
      images.push(imgData);
    }

    return images;
  } catch (error) {
    console.error("PDF → Image failed:", error);
    return [];
  }
}