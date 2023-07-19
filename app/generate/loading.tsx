import { IconLoader } from "@tabler/icons-react";

export default async function Loading() {
  return (
    <main>
      Processing your URL...
      <IconLoader className="animate-spin" />
    </main>
  );
}
