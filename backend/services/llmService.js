export async function generateAnswer(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt is required");
  }

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

