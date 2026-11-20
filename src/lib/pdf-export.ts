import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exports an HTML element directly as a clean, downloadable A4 PDF.
 * Uses high-scale rasterization (scale: 2) so Arabic cursive ligatures,
 * diacritics, and RTL fonts are rendered with 100% native browser fidelity
 * without broken or disjointed Arabic characters.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string = 'feuille_presence.pdf'
): Promise<void> {
  // Ensure element has white background and proper styles
  const canvas = await html2canvas(element, {
    scale: 2, // 2x retina scale for ultra-sharp typography
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1024,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm (A4)
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm (A4)
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Multi-page splitting if content exceeds one A4 page
  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(safeFilename);
}
