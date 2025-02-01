import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { readdir, readFile, open, writeFile, rm } from "fs/promises";
import { pinata } from "@/lib/utils/pinataConfig";

export const runtime = "nodejs";
// Note: To use Formidable, Default Next server body parser must be disabled
export const disableBodyParser = true;
const UPLOAD_DIR = path.resolve("/tmp/uploads");
const ALGORITHM = "aes-256-gcm";

const getDataFromReq = async (req: NextRequest) => {
  // Ensure the uploads directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Obtain the file from the request
  const formData: FormData = await req.formData();
  const chunk = formData.get("chunk");
  const fileName = formData.get("fileName");
  const chunkIndexString = formData.get("chunkIndex");
  const totalChunksString = formData.get("chunk");

  // Existence check
  if (!chunk || !fileName || !chunkIndexString || !totalChunksString) {
    throw new Error("Input error: Missing required fields");
  }

  if (
    !(chunk instanceof File) ||
    typeof fileName !== "string" ||
    typeof chunkIndexString !== "string" ||
    typeof totalChunksString !== "string"
  ) {
    throw new Error("Input error: Invalid input types");
  }
  const chunkIndex = parseInt(chunkIndexString as string);
  const totalChunks = parseInt(chunkIndexString as string);

  return { chunk, fileName, chunkIndex, totalChunks };
};

const enryptFile = async (filePath: string) => {
  const fileData = await readFile(filePath);
  const key = process.env.AUDIO_ENCRYPTION_KEY as string;
  if (key.length != 64)
    throw new Error("Invalid key length. Must be a 64-character hex string.");
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encryptedPart = Buffer.concat([
    cipher.update(fileData),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encryptedPart]);
};
// Handle the file upload
export async function POST(req: NextRequest) {
  try {
    const { chunk, fileName, chunkIndex, totalChunks } =
      await getDataFromReq(req);

    const buffer = Buffer.from(await chunk.arrayBuffer());

    // Create a temporary directory to store chunks for reassembly
    const directoryPath = path.join(UPLOAD_DIR, fileName);
    const filePath = path.join(directoryPath, `chunk_${chunkIndex}`);
    writeFile(filePath, buffer);

    // Check all chunks recieved
    const chunkFiles = await readdir(directoryPath);

    if (chunkFiles.length !== totalChunks) {
      return NextResponse.json({
        message: `Chunk ${chunkIndex} uploaded successfully`,
      });
    }
    const finalFilePath = path.join(directoryPath, "final");

    // Open a file handle for writing the final file.
    const fileHandle = await open(finalFilePath, "w");

    // Sort chunk file names by chunk index (assumes naming as "chunk_0", "chunk_1", …)
    const sortedChunks = chunkFiles.sort((a, b) => {
      const aIdx = Number(a.split("_")[1]);
      const bIdx = Number(b.split("_")[1]);
      return aIdx - bIdx;
    });

    // Append each chunk to the final file
    for (const chunkFile of sortedChunks) {
      const chunkData = await readFile(path.join(directoryPath, chunkFile));
      await fileHandle.write(chunkData);
    }
    await fileHandle.close();
    const encryptedBuffer = await enryptFile(finalFilePath);
    console.log(encryptedBuffer);
    const file = new File([encryptedBuffer], fileName, { type: "text/plain" });
    const response = await pinata.upload.file(file);

    // Clean up: remove the temporary folder and its contents
    await rm(directoryPath, { recursive: true, force: true });

    return NextResponse.json({
      message: "File uploaded and reassembled successfully",
      cid: response.IpfsHash,
    });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { error: "Failed to upload the file." },
      { status: 500 }
    );
  }
}
