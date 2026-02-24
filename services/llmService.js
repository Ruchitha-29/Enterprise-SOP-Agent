export async function generateAnswer(question, contextChunks) {
  if (!question) {
    throw new Error("Question is required");
  }

  const context = contextChunks
    .map((chunk, index) => `Context ${index + 1}:\n${chunk.content}`)
    .join("\n\n");

  const prompt = `
You are an intelligent assistant.

Use ONLY the provided context to answer the question.
If the answer is not found in the context, say:
"I don't know based on the provided document."

---------------------
${context}
---------------------

Question:
${question}

Answer:
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();

  return data.response;
}

