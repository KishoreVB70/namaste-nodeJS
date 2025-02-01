import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { readdir, readFile, open, writeFile, rm } from "fs/promises";
import { pinata } from "@/lib/utils/pinataConfig";

export const runtime = "nodejs";
// Todo: Ensure boyd parser is disabled by default
// export const disableBodyParser = true;
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
  const totalChunksString = formData.get("totalChunks");

  // Existence check
  if (!chunk || !fileName || !chunkIndexString || !totalChunksString) {
    return new Error("Input error: Missing required fields");
  }

  if (
    !(chunk instanceof File) ||
    typeof fileName !== "string" ||
    typeof chunkIndexString !== "string" ||
    typeof totalChunksString !== "string"
  ) {
    return new Error("Input error: Invalid input types");
  }
  const chunkIndex = parseInt(chunkIndexString as string);
  const totalChunks = parseInt(totalChunksString as string);

  return { chunk, fileName, chunkIndex, totalChunks };
};

const enryptFile = async (filePath: string) => {
  const fileData = await readFile(filePath);
  const key = process.env.AUDIO_ENCRYPTION_KEY as string;
  if (!key) throw new Error("Encryption key not found.");
  if (key.length != 64)
    throw new Error("Invalid key length. Must be a 64-character hex string.");
  const binaryKey = new Uint8Array(Buffer.from(key, "hex"));
  const iv = crypto.randomBytes(16);
  const binaryIv = new Uint8Array(iv);

  const cipher = crypto.createCipheriv(ALGORITHM, binaryKey, binaryIv);
  const encryptedPart = Buffer.concat([
    cipher.update(fileData),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encryptedPart]);
};
// Handle the file upload
export async function POST(req: NextRequest) {
  // This part of code is outside the try-catch block to ensure the
  // temporary directory is set outside the block
  console.log("new call");
  const dataReturnValue = await getDataFromReq(req);
  if (dataReturnValue instanceof Error) {
    return NextResponse.json(
      { error: dataReturnValue.message },
      { status: 400 }
    );
  }

  const { fileName, chunk, chunkIndex, totalChunks } = dataReturnValue;

  console.log("fileName", fileName);
  console.log("chunkIndex", chunkIndex);
  console.log("totalChunks", totalChunks);
  const directoryPath = path.join(UPLOAD_DIR, fileName);
  try {
    const buffer = Buffer.from(await chunk.arrayBuffer());

    // Create a temporary directory to store chunks for reassembly
    if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
    const filePath = path.join(directoryPath, `chunk_${chunkIndex}`);

    writeFile(filePath, buffer);

    // Check all chunks recieved
    const chunkFiles = await readdir(directoryPath);
    console.log("ChunkFIles", chunkFiles);
    console.log("chunkFiles", chunkFiles.length);
    console.log("total", totalChunks);

    if (chunkFiles.length !== totalChunks) {
      console.log("Single Chunk completed");
      return NextResponse.json({
        message: `Chunk ${chunkIndex} uploaded successfully`,
      });
    }

    console.log("Final chunk uploaded");
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
    // Clean up: remove the temporary folder and its contents
    await rm(directoryPath, { recursive: true, force: true });
    return NextResponse.json(
      { error: "Failed to upload the file." },
      { status: 500 }
    );
  }
}
