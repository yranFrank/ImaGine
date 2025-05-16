// src/app/api/generate-image/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { tmpdir } from "os";
import sharp from "sharp";
import fetch from "node-fetch";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to save image as PNG format
async function saveImageAsPNG(buffer: Buffer, filename: string) {
  const tmpPath = path.join(tmpdir(), filename);
  await sharp(buffer).png().toFile(tmpPath);
  console.log(`✅ Image saved as PNG to temporary path: ${tmpPath}`);
  return tmpPath;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt")?.toString() || "";
    const image = formData.get("image") as File | null;

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided." }, { status: 400 });
    }

    if (!image) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    console.log("✅ Attempting DALL-E 2 (Image-to-Image)");

    // Convert the image to PNG to meet DALL-E 2 requirements
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const savedPath = await saveImageAsPNG(imageBuffer, "uploaded_image.png");
    console.log("✅ Image path for OpenAI:", savedPath);

    // Read the image file as buffer
    const imageBufferRead = await fs.readFile(savedPath);
    console.log("✅ Image read as buffer:", imageBufferRead.length, "bytes");

    // Send the request using OpenAI API
    const response = await openai.images.edit({
      model: "dall-e-2",
      image: imageBufferRead, // Use the image buffer directly
      prompt,
      n: 1,
      size: "1024x1024",
    });

    console.log("✅ OpenAI Response:", response);

    if (response.error) {
      console.error("❌ OpenAI API Error:", response.error);
      return NextResponse.json({ error: response.error.message || "OpenAI API Error" }, { status: 500 });
    }

    return NextResponse.json({
      imageUrl: response.data[0]?.url || response.data[0]?.b64_json,
    });
  } catch (error) {
    console.error("❌ Error generating image:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
