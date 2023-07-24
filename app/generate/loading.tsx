import { IconLoader2 } from "@tabler/icons-react";

export default async function Loading() {
  return (
    <main className="flex flex-grow items-center justify-center gap-2">
      <IconLoader2 className="animate-spin" />
      Processing your score, this may take a few moments.
    </main>
  );
}
