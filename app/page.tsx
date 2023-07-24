export default function Page() {
  return (
    <form action="/generate" className="flex gap-2">
      <input
        type="text"
        name="url"
        placeholder="Musescore URL"
        className="rounded-md border border-zinc-500 p-2"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
