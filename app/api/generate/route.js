import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { QUIZ_SHAPE } from "@/lib/schema";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const { topic } = body;
  if (typeof topic !== "string" || topic.trim().length < 3) {
    return NextResponse.json({ error: "TOPIC_TOO_SHORT" }, { status: 400 });
  }

  const trimmedTopic = topic.trim();
  if (trimmedTopic.length > 4000) {
    return NextResponse.json({ error: "TOPIC_TOO_LONG" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "MISSING_API_KEY" }, { status: 500 });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `You are an expert quiz writer. Your ONLY output must be a valid JSON object matching exactly this structure: ${JSON.stringify(QUIZ_SHAPE)}. It must contain a short title string and a questions array of exactly 5 questions. Each question needs a prompt, exactly 4 distinct strings in options, a correctIndex (integer 0-3 pointing at the correct option), and a one-sentence explanation. Do not include markdown fences or any prose outside the JSON object.`
        },
        {
          role: "user",
          content: trimmedTopic
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json({ error: "EMPTY_UPSTREAM" }, { status: 502 });
    }

    return NextResponse.json({ raw: content }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "UPSTREAM_FAILED" }, { status: 502 });
  }
}
