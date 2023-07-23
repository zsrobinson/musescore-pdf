import puppeteer from "puppeteer";

export async function urlToPDF(url: string) {
  const req = await fetch(url);
  const svg = await req.text();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(svg);

  const width =
    (await page.evaluate(() => {
      const svg = document.querySelector("svg");
      return svg?.getAttribute("width");
    })) ?? "3000";

  // 0.3 scale works well for 2976.38
  // therefore scale should be 0.3 * (2976.38 / width) => 900 / width
  // not sure where the 900 comes from, but it works

  return await page.pdf({ format: "A4", scale: 900 / Number(width) });
}
