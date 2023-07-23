import type { Browser } from "puppeteer";

export async function urlToPDF(url: string, browser: Browser) {
  const req = await fetch(url);
  const page = await browser.newPage();
  let width = "900";

  if (url.includes(".png")) {
    // some scores are stored as png files instead of svgs

    const img = await req.arrayBuffer();
    const base64 = Buffer.from(img).toString("base64");

    await page.setContent(
      `<img src="data:image/png;base64,${base64}" width="900" />`
    );
  } else {
    // if not png, assume it's an svg

    const svg = await req.text();
    await page.setContent(svg);

    width =
      (await page.evaluate(() => {
        const svg = document.querySelector("svg");
        return svg?.getAttribute("width");
      })) ?? "3000";
  }

  // 0.3 scale works well for 2976.38
  // therefore scale should be 0.3 * (2976.38 / width) => 900 / width
  // not sure where the 900 comes from, but it works

  const scale = Math.min(900 / Number(width), 2);
  return await page.pdf({ format: "A4", scale });
}
