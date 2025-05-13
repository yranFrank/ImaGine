"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("medium");
  const [background, setBackground] = useState("opaque");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/generate-image", {
        prompt,
        aspectRatio,
        quality,
        background,
      });

      setGeneratedImage(response.data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">AI Image Generator</h1>

      <input
        type="text"
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="px-4 py-2 border rounded-md w-80 mb-4"
      />

      <select
        value={aspectRatio}
        onChange={(e) => setAspectRatio(e.target.value)}
        className="px-4 py-2 border rounded-md mb-4"
      >
        <option value="1:1">1:1 (Square)</option>
        <option value="16:9">16:9 (Landscape)</option>
        <option value="9:16">9:16 (Portrait)</option>
      </select>

      <select
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
        className="px-4 py-2 border rounded-md mb-4"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={background}
        onChange={(e) => setBackground(e.target.value)}
        className="px-4 py-2 border rounded-md mb-4"
      >
        <option value="opaque">Opaque</option>
        <option value="transparent">Transparent</option>
      </select>

      <button
        onClick={handleGenerateImage}
        disabled={loading}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {generatedImage && (
        <div className="mt-6">
          <img
            src={generatedImage}
            alt="Generated Image"
            className="max-w-md rounded-md shadow-md"
          />
          <a
            href={generatedImage}
            download="generated-image.png"
            className="block mt-2 text-blue-500 underline"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}
