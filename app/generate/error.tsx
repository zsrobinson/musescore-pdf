"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error }: Props) {
  return (
    <main className="flex-grow">
      <div className="flex flex-col items-start gap-2 rounded-lg bg-red-900/20 p-4">
        <h2 className="text-xl font-semibold">
          An Unexpected Error Has Occurred
        </h2>

        <p>
          Please double check the URL you submitted and your network connection.
        </p>

        <p className="font-mono">Error Message: {error.message}</p>

        <Button asChild>
          <Link href="/">Return to homepage</Link>
        </Button>
      </div>
    </main>
  );
}
