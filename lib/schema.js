export const QUIZ_SHAPE = {
  title: "string",
  questions: [
    {
      prompt: "string",
      options: ["string", "string", "string", "string"],
      correctIndex: 0,
      explanation: "string"
    }
  ]
};

export const FLASHCARD_SHAPE = {
  title: "string",
  cards: [
    {
      front: "string",
      back: "string"
    }
  ]
};

export const COMBINED_SHAPE = {
  title: "string",
  questions: QUIZ_SHAPE.questions,
  cards: FLASHCARD_SHAPE.cards
};
