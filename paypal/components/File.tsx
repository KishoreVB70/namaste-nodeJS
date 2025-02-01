"use client";
import axios from "axios";
import React, { useState } from "react";
const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB

const uploadChunk = async (
  chunkIndex: number,
  chunk: Blob,
  totalChunks: number,
  fileName: string
) => {
  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("chunkIndex", chunkIndex.toString());
  formData.append("totalChunks", totalChunks.toString());
  formData.append("fileName", fileName);

  const response = await axios.post("/api/upload", formData);

  // If it's the last chunk, get the IPFS CID from the response
  if (chunkIndex === totalChunks - 1) {
    console.log("response", response);
    const data = response.data;
    return data.cid;
  }
};

function File() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  async function upload() {
    if (!file) return;
    try {
      const fileSize = file.size;
      const fileName = file.name;
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

      console.log(fileSize, totalChunks);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        const chunk = file.slice(start, end);

        const data = await uploadChunk(
          chunkIndex,
          chunk,
          totalChunks,
          fileName
        );
        if (data) console.log("data obatined", data);
      }
    } catch (error) {
      console.log(error);
      setMessage("error uploading file");
    }
  }

  function fileChanleHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <div className="flex flex-col">
      <input type="file" onChange={(e) => fileChanleHandler(e)} />
      <button
        onClick={upload}
        className="m-5 p-5 border border-white hover:bg-white hover:text-black"
      >
        Upload
      </button>
      <p>{message}</p>
    </div>
  );
}

export default File;
