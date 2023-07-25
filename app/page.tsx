import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Page() {
  return (
    <main className="flex flex-grow flex-col gap-4">
      <p className="leading-relaxed">
        Enter the URL of the Musescore score you want to download below,
        including the <Code>https://</Code> part of the URL. Musescore lists{" "}
        <a
          href="https://musescore.com/sheetmusic/public-domain"
          className="underline underline-offset-2 transition-colors hover:text-primary/80"
          target="_blank"
        >
          scores that are in the public domain
        </a>{" "}
        and are able to be downloaded in accordance with their terms, although
        this tool may or may not work with other publicly available scores as
        well. Here are some examples of public domain scores to try:
      </p>

      <ul className="list-inside list-disc pl-4 leading-relaxed">
        <li>
          Canon in D:{" "}
          <Code breakAll>
            https://musescore.com/user/1809056/scores/1019991
          </Code>
        </li>
        <li>
          Für Elise - Beethoven:{" "}
          <Code breakAll>https://musescore.com/user/19710/scores/33816</Code>
        </li>
        <li>
          Clair de Lune - Debussy:{" "}
          <Code breakAll>https://musescore.com/user/19710/scores/58553</Code>
        </li>
      </ul>

      <form action="/generate" className="flex gap-2">
        <Input
          type="text"
          name="url"
          placeholder="Musescore URL"
          className="w-64"
        />
        <Button type="submit">Submit</Button>
      </form>

      <span className="flex items-center justify-center gap-4 py-4">
        <hr className="w-24 border-border" />
        <p className="text-sm text-muted-foreground">OR</p>
        <hr className="w-24 border-border" />
      </span>

      <p className="leading-relaxed">
        Send an HTTP GET request to <Code>/api/generate</Code> with the{" "}
        <Code>url</Code> query parameter set to the Musescore URL. Response will
        either be an error or of the following type:{" "}
        <Code>
          &#123; path: string; resources: string[]; time: number; &#125;
        </Code>
        . The <Code>path</Code> is the path to the generated PDF, the{" "}
        <Code>resources</Code> are the links to the generated images, and the{" "}
        <Code>time</Code> is the time in milliseconds it took to generate the
        PDF.
      </p>
    </main>
  );
}

function Code({
  children,
  breakAll,
}: {
  children: ReactNode;
  breakAll?: boolean;
}) {
  return (
    <span
      className={`rounded-md bg-secondary p-1 font-mono text-sm ${
        breakAll ? "break-all" : ""
      }`}
    >
      {children}
    </span>
  );
}
