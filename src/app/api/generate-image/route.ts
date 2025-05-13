// src/app/api/generate-image/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, aspectRatio } = await req.json();

    const sizeMap = {
      "1:1": "1024x1024",
      "16:9": "1792x1024",
      "9:16": "1024x1792",
    };

    console.log("Sending Request to OpenAI with:", {
      prompt,
      model: "dall-e-3", // ✅ 切换到 DALL·E 3
      n: 1,
      size: sizeMap[aspectRatio] || "1024x1024",
    });

    const response = await openai.images.generate({
      model: "dall-e-3", // ✅ 使用 DALL·E 3（如果不可用，可以切换到 DALL·E 2）
      prompt,
      n: 1,
      size: sizeMap[aspectRatio] || "1024x1024",
    });

    console.log("OpenAI Response:", response);
    return NextResponse.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: error?.response?.data?.error || "Failed to generate image" },
      { status: 500 }
    );
  }
}
