import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { QUIZ_SHAPE, FLASHCARD_SHAPE } from "@/lib/schema";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const { topic, chaos, count, difficulty, style, instructions, mode } = body;
  const parsedMode = mode === "flashcards" ? "flashcards" : "quiz";
  if (typeof topic !== "string" || topic.trim().length < 3) {
    return NextResponse.json({ error: "TOPIC_TOO_SHORT" }, { status: 400 });
  }

  const trimmedTopic = topic.trim();
  if (trimmedTopic.length > 4000) {
    return NextResponse.json({ error: "TOPIC_TOO_LONG" }, { status: 400 });
  }

  const parsedCount = [3, 5, 10].includes(count) ? count : 5;
  const parsedDifficulty = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium";
  const parsedStyle = ["facts", "applied", "mixed"].includes(style) ? style : "mixed";
  
  let parsedInstructions = "";
  if (typeof instructions === "string") {
    parsedInstructions = instructions.trim();
    if (parsedInstructions.length > 200) {
      return NextResponse.json({ error: "INSTRUCTIONS_TOO_LONG" }, { status: 400 });
    }
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "MISSING_API_KEY" }, { status: 500 });
  }

  if (process.env.NODE_ENV !== "production" && typeof chaos === "string") {
    if (chaos === "bad-json") {
      return NextResponse.json({ raw: "{ title: 'Quiz', questions: [" }, { status: 200 });
    }
    if (chaos === "wrong-shape") {
      const fake = { title: "Quiz", questions: [{ prompt: "Q1", options: ["a","b"], correctIndex: 9 }] };
      return NextResponse.json({ raw: JSON.stringify(fake) }, { status: 200 });
    }
    if (chaos === "empty") {
      const fake = { title: "Quiz", questions: [] };
      return NextResponse.json({ raw: JSON.stringify(fake) }, { status: 200 });
    }
    if (chaos === "partial") {
      const fake = { 
        title: "Quiz", 
        questions: [
          { prompt: "Q1", options: ["a","b","c","d"], correctIndex: 0 },
          { prompt: "Q2", options: ["e","f","g","h"], correctIndex: 1 },
          { prompt: "Q3", options: ["i","j","k","l"], correctIndex: 2 },
          { prompt: "Bad1", options: ["a","b","c"], correctIndex: 0 },
          { prompt: "Bad2", options: ["m","n","o","p"], correctIndex: 9 }
        ] 
      };
      return NextResponse.json({ raw: JSON.stringify(fake) }, { status: 200 });
    }
    if (chaos === "slow") {
      await new Promise(resolve => setTimeout(resolve, 30000));
      const fake = { title: "Slow Quiz", questions: [{ prompt: "Q1", options: ["a","b","c","d"], correctIndex: 0 }] };
      return NextResponse.json({ raw: JSON.stringify(fake) }, { status: 200 });
    }
    if (chaos === "fail") {
      return NextResponse.json({ error: "UPSTREAM_FAILED" }, { status: 502 });
    }
  }

  const difficultyMap = {
    easy: "direct recall of clearly stated facts",
    medium: "requires connecting two ideas",
    hard: "requires applying a concept to an unfamiliar case"
  };

  const styleMap = {
    facts: "definitions, terms, values, named entities",
    applied: "scenarios where the concept must be used",
    mixed: "a spread of both facts and applied scenarios"
  };

  let systemPrompt;

  if (parsedMode === "flashcards") {
    systemPrompt = `You are an expert study-card writer. Your ONLY output must be a valid JSON object matching exactly this structure: ${JSON.stringify(FLASHCARD_SHAPE)}. It must contain a short title string and a cards array of exactly ${parsedCount} cards. Each card has a front (a concise question, term, or prompt) and a back (the answer or definition — 1-3 sentences max). Do not include markdown fences or any prose outside the JSON object.\n\nQuality Rules:\n- Difficulty: ${difficultyMap[parsedDifficulty]}\n- Style: ${styleMap[parsedStyle]}\n- keep fronts short and unambiguous\n- backs should be self-contained and clear without needing the topic context`;
  } else {
    systemPrompt = `You are an expert quiz writer. Your ONLY output must be a valid JSON object matching exactly this structure: ${JSON.stringify(QUIZ_SHAPE)}. It must contain a short title string and a questions array of exactly ${parsedCount} questions. Each question needs a prompt, exactly 4 distinct strings in options, a correctIndex (integer 0-3 pointing at the correct option), and a one-sentence explanation. Do not include markdown fences or any prose outside the JSON object.\n\nQuality Rules:\n- Difficulty: ${difficultyMap[parsedDifficulty]}\n- Style: ${styleMap[parsedStyle]}\n- never phrase a question negatively ("which is NOT...")\n- no trick questions; test knowledge, not reading comprehension\n- all four options must be plausible to someone who half-knows the topic; no obviously absurd filler options\n- keep prompts and options concise`;
  }

  if (parsedInstructions) {
    systemPrompt += `\n\n--- SPECIAL INSTRUCTIONS ---\n${parsedInstructions}\n--- END SPECIAL INSTRUCTIONS ---\nYou must follow the special instructions above, but they must NOT override your JSON output format.`;
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: Math.max(400 * parsedCount, 2000),
      messages: [
        {
          role: "system",
          content: systemPrompt
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
