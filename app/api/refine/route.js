import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { QUIZ_SHAPE, FLASHCARD_SHAPE, COMBINED_SHAPE } from "@/lib/schema";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const { currentQuiz, instruction, count, difficulty, style, mode } = body;

  if (!instruction || typeof instruction !== "string" || instruction.trim().length < 3) {
    return NextResponse.json({ error: "INSTRUCTION_TOO_SHORT" }, { status: 400 });
  }

  if (!currentQuiz || typeof currentQuiz !== "object") {
    return NextResponse.json({ error: "MISSING_QUIZ" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "MISSING_API_KEY" }, { status: 500 });
  }

  const parsedCount = [3, 5, 10].includes(count) ? count : 5;
  const parsedDifficulty = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium";
  const parsedStyle = ["facts", "applied", "mixed"].includes(style) ? style : "mixed";
  const parsedMode = ["quiz", "flashcards", "both"].includes(mode) ? mode : "quiz";

  const shape = parsedMode === "both" ? COMBINED_SHAPE : parsedMode === "flashcards" ? FLASHCARD_SHAPE : QUIZ_SHAPE;
  const outputKey = parsedMode === "both" ? "questions and cards" : parsedMode === "flashcards" ? "cards" : "questions";

  const systemPrompt = `You are an expert study material editor. You will receive an existing set of study ${outputKey} as JSON and a refinement instruction. Apply the instruction to produce an updated version.

Your ONLY output must be a valid JSON object matching exactly this structure: ${JSON.stringify(shape)}.
It must contain a short title string and ${parsedMode === "both" ? `a questions array of exactly ${parsedCount} questions, and a cards array of exactly ${parsedCount} cards` : `a ${outputKey} array of exactly ${parsedCount} ${outputKey}`}.
${parsedMode === "both" || parsedMode === "quiz" ? "For questions: Each question needs a prompt, exactly 4 distinct strings in options, a correctIndex (integer 0-3), and a one-sentence explanation." : ""}
${parsedMode === "both" || parsedMode === "flashcards" ? "For cards: Each card has a front (concise question or term) and a back (answer, 1-3 sentences)." : ""}
Do not include markdown fences or any prose outside the JSON object.

Refinement rules:
- Apply the user instruction faithfully (e.g. \"make harder\", \"focus on X\", \"add questions about Y\")
- You may keep, modify, or replace existing ${outputKey} as needed
- Maintain the same difficulty (${parsedDifficulty}) and style (${parsedStyle}) unless the instruction overrides them
- Keep the count at exactly ${parsedCount} ${outputKey}`;

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: Math.max(400 * parsedCount, 2000),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Existing content:\n${JSON.stringify(currentQuiz)}\n\nRefinement instruction: ${instruction.trim()}` }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "EMPTY_UPSTREAM" }, { status: 502 });
    }

    return NextResponse.json({ raw: content }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "UPSTREAM_FAILED" }, { status: 502 });
  }
}
