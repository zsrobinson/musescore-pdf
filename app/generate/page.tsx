import { redirect } from "next/navigation";
import puppeteer from "puppeteer";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  if (!searchParams.url || typeof searchParams.url !== "string") {
    return redirect("/");
  }

  const browser = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();
  await page.goto(searchParams.url, { waitUntil: "load" });

  console.log("page loaded");

  const { firstPage, totalPages } = await page.evaluate(() => {
    const images = document.querySelectorAll("img");
    let firstPage = "";
    let firstPageAlt = "";

    images.forEach((image) => {
      if (image.src.includes("musescore.com/static/musescore/scoredata/g")) {
        firstPage = image.src;
        firstPageAlt = image.alt;
      }
    });

    const totalPages = Number(firstPageAlt.split(" ").at(-2));
    return { firstPage, totalPages };
  });

  console.log("first page", firstPage);
  console.log("total pages", totalPages);
  console.log("scrolling to bottom");

  await page.mouse.move(500, 500);

  let otherPages: string[] = [];

  for (let i = 0; i < totalPages - 1; i++) {
    await page.mouse.wheel({ deltaY: 1185 });
    await new Promise((r) => setTimeout(r, 250));

    const newOtherPages = await page.evaluate(() => {
      const images = document.querySelectorAll("img");
      const matches: string[] = [];

      images.forEach((image) => {
        if (
          image.src.includes("s3.ultimate-guitar.com/musescore.scoredata/g/")
        ) {
          matches.push(image.src);
        }
      });

      return matches;
    });

    otherPages.push(...newOtherPages);
  }

  // find unique items in otherPages array
  otherPages = otherPages.filter((page, i) => otherPages.indexOf(page) === i);

  // const path = `/tmp/${crypto.randomUUID()}.png`;
  // await page.screenshot({ path: `public/${path}` });

  await browser.close();

  return (
    <main>
      <div className="flex flex-wrap">
        {[firstPage, ...otherPages].map((page, i) => (
          <img
            key={i}
            src={page}
            alt={`sheet music, page ${i + 1}`}
            className="w-80"
          />
        ))}
      </div>

      {/* <img src={path} alt="screenshot" /> */}
    </main>
  );
}
