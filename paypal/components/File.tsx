"use client";
import axios from "axios";
import React, { useState } from "react";

function File() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  async function upload() {
    if (!file) return;
    try {
      console.log("going in boys");
      const formData = new FormData();
      formData.append("file", file);
      console.log(file);
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(`File uploaded successfully: ${response.data.message}`);
    } catch (error) {
      console.log(error);
      setMessage("error");
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
