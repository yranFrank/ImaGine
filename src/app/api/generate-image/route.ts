import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";

console.log("✅ Sharp Version:", sharp.version);
console.log("✅ Sharp Installed Modules:", sharp.format);
// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    console.log(" Receiving request...");

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const prompt = formData.get('prompt')?.toString() || '';
    const aspectRatio = formData.get('aspectRatio')?.toString() || 'auto';

    console.log(" Form Data:", { file, prompt, aspectRatio });

    if (!file || !prompt) {
      return NextResponse.json({ error: '缺少文件或提示词参数' }, { status: 400 });
    }

    const allowedSizes = {
      'auto': 'auto',
      '1:1': '1024x1024',
      '2:3': '1024x1536',
      '3:2': '1536x1024'
    };

    if (!(aspectRatio in allowedSizes)) {
      return NextResponse.json({ error: 'unsupported spec' }, { status: 400 });
    }

    const sizeValue = allowedSizes[aspectRatio];

    // Convert image to a compressed format with format detection
    const arrayBuffer = await file.arrayBuffer();
    let imageBuffer = Buffer.from(arrayBuffer);

    const imageInfo = await sharp(imageBuffer).metadata();
    if (!["jpeg", "png", "webp"].includes(imageInfo.format || "")) {
      return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
    }

    imageBuffer = await sharp(imageBuffer)
      .resize({
        width: sizeValue === "auto" ? null : parseInt(sizeValue.split("x")[0]),
        height: sizeValue === "auto" ? null : parseInt(sizeValue.split("x")[1]),
        fit: "inside"
      })
      .toFormat(imageInfo.format as any, { quality: 70 })
      .toBuffer();

    console.log(" Compressed Image size:", imageBuffer.length, "bytes");

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp-image-${Date.now()}.jpg`);
    fs.writeFileSync(tempFilePath, imageBuffer);

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: await toFile(
        fs.createReadStream(tempFilePath),
        "temp-image.jpg",
        { type: "image/jpeg" }
      ),
      prompt: prompt,
      n: 1,
      size: sizeValue
    });

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);

    const base64Data = response.data[0]?.b64_json;

    return NextResponse.json({ image: base64Data });

  } catch (err: any) {
    console.error('❌ error in generating:', err);
    return NextResponse.json({ error: 'generate fail', details: err.message }, { status: 500 });
  }
}
