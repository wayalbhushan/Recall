function checkQuestion(q) {
  if (!q || typeof q !== "object" || Array.isArray(q)) return "NOT_OBJECT";
  if (typeof q.prompt !== "string" || q.prompt.trim() === "") return "BAD_PROMPT";
  if (!Array.isArray(q.options) || q.options.length !== 4) return "BAD_OPTIONS_LENGTH";
  
  const seenOptions = new Set();
  for (let i = 0; i < q.options.length; i++) {
    const opt = q.options[i];
    if (typeof opt !== "string" || opt.trim() === "") return "BAD_OPTION";
    const lowerOpt = opt.trim().toLowerCase();
    if (seenOptions.has(lowerOpt)) return "DUPLICATE_OPTION";
    seenOptions.add(lowerOpt);
  }

  if (typeof q.correctIndex !== "number" || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) {
    return "BAD_CORRECT_INDEX";
  }

  return null;
}

export function validateQuiz(data) {
  if (!data || typeof data !== "object" || !Array.isArray(data.questions)) {
    return { ok: false, reason: "MISSING_QUESTIONS" };
  }

  const good = [];
  let droppedCount = 0;

  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    const reason = checkQuestion(q);
    
    if (reason !== null) {
      droppedCount++;
      continue;
    }

    const normalizedOptions = [];
    for (let j = 0; j < q.options.length; j++) {
      normalizedOptions.push(q.options[j].trim());
    }

    let explanation = "";
    if (typeof q.explanation === "string") {
      explanation = q.explanation.trim();
    }

    good.push({
      id: String(i),
      prompt: q.prompt.trim(),
      options: normalizedOptions,
      correctIndex: q.correctIndex,
      explanation
    });
  }

  if (good.length === 0) {
    return { ok: false, reason: "NO_VALID_QUESTIONS" };
  }

  let title = "Quiz";
  if (typeof data.title === "string" && data.title.trim() !== "") {
    title = data.title.trim();
  }

  return {
    ok: true,
    title,
    questions: good,
    droppedCount
  };
}
