import puppeteer from "puppeteer";

export async function urlToPDF(url: string) {
  const req = await fetch(url);
  const svg = await req.text();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(svg);
  return await page.pdf({ format: "A4", scale: 0.3 });
}
