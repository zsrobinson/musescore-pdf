export default function Page() {
  return (
    <form action="/generate" className="flex gap-2">
      <input
        type="text"
        name="url"
        placeholder="Musescore URL"
        className="border border-zinc-500 p-2 rounded-md"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
