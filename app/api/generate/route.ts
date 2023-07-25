import { NextResponse } from "next/server";
import { generate } from "~/lib/generate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { message: "Missing url search param" },
      { status: 400 }
    );
  } else if (!url.includes("musescore.com")) {
    return NextResponse.json(
      { message: "Hostname must be musescore.com" },
      { status: 400 }
    );
  }

  try {
    const response = await generate(url);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: (error as any).message ?? "Unknown error has occurred" },
      { status: 500 }
    );
  }
}
