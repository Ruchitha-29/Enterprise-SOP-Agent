import { generateEmbedding } from "./embeddingService.js";
import { DocumentChunk } from "../models/DocumentChunk.js";

export async function retrieveRelevantChunks(query, topK = 5) {
  if (!query || typeof query !== "string") {
    throw new Error("Invalid query input");
  }

  console.log("🔎 Generating query embedding...");
  const queryEmbedding = await generateEmbedding(query);

  console.log("Query embedding length:", queryEmbedding.length);

  if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== 384) {
    throw new Error("Query embedding dimension mismatch");
  }

  console.log("🚀 Running vector search...");

  const results = await DocumentChunk.aggregate([
    {
      $vectorSearch: {
        index: "default", // MUST match Atlas index name
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: topK,
      },
    },
    {
      $project: {
        _id: 0,
        documentName: 1,
        content: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  console.log("Vector search results:", results);

  return results || [];
}