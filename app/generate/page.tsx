import { existsSync, mkdirSync } from "fs";
import { appendFile } from "fs/promises";
import { redirect } from "next/navigation";
import puppeteer from "puppeteer";
import { extractResources } from "~/lib/extract-resources";
import { mergePDFs } from "~/lib/merge-pdfs";
import { urlToPDF } from "~/lib/url-to-pdf";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  if (!searchParams.url || typeof searchParams.url !== "string") {
    return redirect("/");
  }

  const startTime = Date.now();

  const browser = await puppeteer.launch();
  const resources = await extractResources(searchParams.url, browser);
  const pdfs = await Promise.all(
    resources.map(async (resource) => urlToPDF(resource, browser))
  );
  const mergedPDF = await mergePDFs(pdfs);

  const path = `tmp/${crypto.randomUUID()}.pdf`;
  existsSync("public/tmp") || mkdirSync("public/tmp");
  await appendFile(`public/${path}`, Buffer.from(mergedPDF));

  await browser.close();
  const endTime = Date.now();

  return (
    <main className="flex flex-col gap-4 items-start">
      <p>
        Detected {resources.length} page{resources.length === 1 ? "" : "s"}.
        Took {((endTime - startTime) / 1000).toFixed(2)} seconds to generate.
        Score is stored as {resources.at(0)?.includes(".png") ? "PNG" : "SVG"}{" "}
        files.
      </p>

      <a
        href={`/${path}`}
        target="_blank"
        className="border border-zinc-500 p-2 rounded-md"
      >
        Download PDF
      </a>

      <p>Preview:</p>

      <div className="flex flex-wrap bg-zinc-400 p-4 gap-4">
        {resources.map((resource, i) => (
          <img
            key={resource}
            src={resource}
            alt={`Page ${i + 1}`}
            className="w-80"
          />
        ))}
      </div>
    </main>
  );
}
