// src/app/api/check-api/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const response = await openai.models.list();
    return NextResponse.json({ models: response.data });
  } catch (error) {
    console.error("Error checking API access:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
