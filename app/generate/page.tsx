import { existsSync, mkdirSync } from "fs";
import { appendFile } from "fs/promises";
import { redirect } from "next/navigation";
import puppeteer from "puppeteer";
import { Button } from "~/components/ui/button";
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
    <main className="flex flex-grow flex-col items-start gap-4">
      <p>
        Detected {resources.length} page{resources.length === 1 ? "" : "s"}.
        Took {((endTime - startTime) / 1000).toFixed(2)} seconds to generate.
        Score is stored as {resources.at(0)?.includes(".png") ? "PNG" : "SVG"}{" "}
        files.
      </p>

      <div className="flex gap-2">
        <Button variant="secondary" asChild>
          <a href={`/${path}`} target="_blank">
            Download PDF
          </a>
        </Button>

        <Button variant="outline" asChild>
          <a href={searchParams.url} target="_blank">
            Visit Original Score
          </a>
        </Button>
      </div>

      <div className="grid w-full grid-cols-3 gap-4 rounded-lg bg-zinc-800 p-4">
        {resources.map((resource, i) => (
          <img
            src={resource}
            alt={`Page ${i + 1}`}
            className="rounded-md"
            key={i}
          />
        ))}
      </div>

      <div className="flex w-full flex-col gap-2 rounded-lg border border-zinc-800 p-4">
        <h3 className="text-lg font-semibold">Image Links</h3>
        <ol className="flex list-decimal flex-col gap-2">
          {resources.map((resource, i) => (
            <li
              key={i}
              className="ml-8 break-all font-mono text-xs transition-colors hover:text-zinc-300"
            >
              <a href={resource} target="_blank">
                {resource}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
