import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

// Allow parsing of `multipart/form-data`
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handle the file upload
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      NextResponse.json({message: "Improper file"}, {status: 400});
    }

    // if (!file.type == "wav")
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join("/", "tmp", file.name);

    void await writeFile(path, buffer);

    return NextResponse.json({ message: "File uploaded successfully!" });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { error: "Failed to upload the file." },
      { status: 500 }
    );
  }
}
