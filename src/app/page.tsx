"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Image-to-Image Generator";
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    if (!image) {
      setError("Please upload an image.");
      return;
    }
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("prompt", prompt);
    formData.append("ratio", aspectRatio);

    try {
      const response = await axios.post("/api/generate-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      setGeneratedImage(`data:image/png;base64,${response.data.image}`);
    } catch (err: any) {
      setError(`Server Error: ${err.response?.data?.error || "Unknown Error"}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPrompt("");
    setImage(null);
    setImagePreview(null);
    setAspectRatio("1:1");
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center">
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        src="background.mp4"
      ></video>

      <div className="relative z-10 mt-8">
        <h1 className="text-4xl font-bold mb-8">Image-to-Image Generator</h1>

        <div className="flex gap-8 max-w-6xl w-full">
          <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Original Image</h2>
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded Image" className="w-full rounded-md" />
            ) : (
              <div className="text-gray-400">No image uploaded</div>
            )}
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-4 hover:bg-blue-600 transition">
              Choose File
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Prompt & Settings</h2>
            <textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-gray-700 rounded-md p-2 mb-4"
            />
            <select
              onChange={(e) => setAspectRatio(e.target.value)}
              value={aspectRatio}
              className="w-full bg-gray-700 rounded-md p-2 mb-4"
            >
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="4:5">4:5</option>
            </select>
            <div className="flex gap-4">
              <button onClick={handleGenerate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" disabled={loading}>
                {loading ? "Generating..." : "Generate Image"}
              </button>
              <button onClick={resetForm} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
                Reset
              </button>
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </div>

          <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
            {generatedImage ? (
              <img src={generatedImage} alt="Generated" className="w-full rounded-md" />
            ) : (
              <div className="text-gray-400">No image generated</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
