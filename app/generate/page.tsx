import { existsSync, mkdirSync } from "fs";
import { appendFile } from "fs/promises";
import { redirect } from "next/navigation";
import { extractSVGs } from "~/lib/extract-svgs";
import { mergePDFs } from "~/lib/merge-pdfs";
import { urlToPDF } from "~/lib/url-to-pdf";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  if (!searchParams.url || typeof searchParams.url !== "string") {
    return redirect("/");
  }

  const svgs = await extractSVGs(searchParams.url);
  const pdfs = await Promise.all(svgs.map(async (svg) => urlToPDF(svg)));
  const mergedPDF = await mergePDFs(pdfs);

  const path = `tmp/${crypto.randomUUID()}.pdf`;
  existsSync("public/tmp") || mkdirSync("public/tmp");
  await appendFile(`public/${path}`, Buffer.from(mergedPDF));

  return (
    <main className="flex flex-col gap-4 items-start">
      <p>
        Detected {svgs.length} page{svgs.length === 1 ? "" : "s"}.
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
        {svgs.map((svg) => (
          <img
            key={svg}
            src={svg}
            alt={`Page ${svgs.indexOf(svg) + 1}`}
            className="w-80"
          />
        ))}
      </div>
    </main>
  );
}
