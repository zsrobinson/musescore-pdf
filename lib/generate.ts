import puppeteer from "puppeteer";
import { extractResources } from "./extract-resources";
import { urlToPDF } from "./url-to-pdf";
import { mergePDFs } from "./merge-pdfs";
import { existsSync, mkdirSync } from "fs";
import { appendFile } from "fs/promises";

export async function generate(url: string) {
  const startTime = Date.now();

  const browser = await puppeteer.launch();
  const resources = await extractResources(url, browser);
  const pdfs = await Promise.all(
    resources.map(async (resource) => urlToPDF(resource, browser))
  );
  const mergedPDF = await mergePDFs(pdfs);

  const path = `/tmp/${crypto.randomUUID()}.pdf`;
  existsSync("public/tmp") || mkdirSync("public/tmp");
  await appendFile("public" + path, Buffer.from(mergedPDF));

  await browser.close();
  const endTime = Date.now();

  return {
    path,
    resources,
    time: endTime - startTime,
  };
}
