import { pipeline } from "@xenova/transformers";

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("🔄 Loading local embedding model (first time only)...");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("✅ Local embedding model loaded");
  }
  return embedder;
}

export async function generateEmbedding(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid text input for embedding");
  }

  const model = await getEmbedder();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  const vector = Array.from(output.data);

  console.log("Embedding length:", vector.length);

  return vector;
}