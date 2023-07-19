import { PDFDocument } from "pdf-lib";

export async function mergePDFs(arr: Buffer[]) {
  const mergedPDF = await PDFDocument.create();

  for (const buffer of arr) {
    const pdf = await PDFDocument.load(buffer);
    const pages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPDF.addPage(page));
  }

  return await mergedPDF.save();
}
