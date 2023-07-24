import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Page() {
  return (
    <form action="/generate" className="flex flex-grow gap-2">
      <Input
        type="text"
        name="url"
        placeholder="Musescore URL"
        className="w-64"
      />
      <Button type="submit" variant="secondary">
        Submit
      </Button>
    </form>
  );
}
