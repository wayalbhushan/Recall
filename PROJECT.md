# Recall: Turn your notes into a test.

## What this is
A take-home assignment for a Software Engineering Intern role at Flam AI.
Built by one person in a hard 8-hour budget. Graded, then defended in a
live interview where the author must explain decisions, fix an injected
bug, and add a feature on the spot.

## The task
A React app: free-form text in → real LLM API call → model returns
STRUCTURED JSON → app parses it and renders an interactive, stateful UI.
It is NOT a chatbot. Printing raw model text does not satisfy this.

Chosen variant: Study Assistant. User pastes notes or a topic, the model
returns a quiz, the user takes it, and can re-test only the questions
they got wrong.

## Grading weights
- React & frontend architecture — 25%
- AI integration & data handling — 25%
- Handling BAD AI output — 20%
- UI/UX & product sense — 15%
- Communication & understanding — 15%

The brief states most of the signal is in handling bad output. Treat
failure paths as the main feature, not as cleanup.

## Stack
- Next.js App Router, JavaScript (NOT TypeScript — explicitly not graded)
- Tailwind CSS
- Groq via the `groq-sdk` package
- openai/gpt-oss-120b on Groq (the Llama 3.3 model is deprecated)
- Turbopack is the default bundler. Do not disable it or add webpack config.
- No state library, no form library, no component library, no Zod
- No new dependencies without being asked

## Non-negotiable constraints
- The Groq API key is read ONLY inside app/api/**/route.js. It must never
  appear in a client component or the browser bundle.
- Every file using useState/useEffect/onClick starts with "use client".
- Model output is UNTRUSTED INPUT. It is validated at exactly one
  boundary, then never type-checked again.
- No crashes on any bad model output, ever.
- Mobile-first responsive. Works at 360px wide.
- Visible keyboard focus on every interactive element.

## How to work
- Small, focused changes. One concern per task.
- Explain what you are about to do in 2–3 lines BEFORE writing files.
- After writing, list which files changed and why in one line each.
- Do not create files that were not asked for.
- Do not add comments that restate the code.
- If a requirement is ambiguous, ask instead of guessing.

## The author must be able to defend every line live.
Prefer the simple, readable, explainable implementation over the clever
one. Plain for-loops over chained array gymnastics. No abstractions with
a single call site.
