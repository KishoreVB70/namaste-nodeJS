import { NextResponse } from "next/server";
import axios from "axios";

// Mark the route as dynamic
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Get the URL from query parameters
    const { searchParams } = new URL(request.url);
    const audioUrl = searchParams.get("url");

    if (!audioUrl) {
      return NextResponse.json(
        { error: "Audio URL is required" },
        { status: 400 },
      );
    }

    // Validate if the URL is from fal.media for security
    if (
      !audioUrl.startsWith("https://v2.fal.media/") &&
      !audioUrl.startsWith("https://fal.media/")
    ) {
      return NextResponse.json(
        { error: "Invalid audio URL domain" },
        { status: 400 },
      );
    }

    const response = await axios({
      method: "get",
      url: audioUrl,
      responseType: "arraybuffer",
    });

    // Create response with appropriate headers
    const headers = new Headers({
      "Content-Type": "audio/wav",
      "Content-Length": response.data.length,
    });

    return new NextResponse(response.data, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("Error proxying audio:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio file" },
      { status: 500 },
    );
  }
}
