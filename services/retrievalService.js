import { generateEmbedding } from "./embeddingService.js";
import { DocumentChunk } from "../models/DocumentChunk.js";

export async function retrieveRelevantChunks(query, user, topK = 5) {
  if (!query || typeof query !== "string") {
    throw new Error("Invalid query input");
  }

  const limit = typeof topK === "number" && topK > 0 ? topK : 5;

  console.log("🔎 Generating query embedding...");
  const queryEmbedding = await generateEmbedding(query);

  console.log("Query embedding length:", queryEmbedding.length);

  if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== 384) {
    throw new Error("Query embedding dimension mismatch");
  }

  console.log("🚀 Running vector search...");

  const pipeline = [
    {
      $vectorSearch: {
        index: "default", // MUST match Atlas index name
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 200,
        limit,
      },
    },
  ];

  // Always filter by companyId BEFORE projection
  if (user?.companyId) {
    pipeline.push({
      $match: {
        companyId: user.companyId,
      },
    });
  }

  // Ensure explicit sort by vectorSearchScore desc
  pipeline.push(
    {
      $addFields: {
        score: { $meta: "vectorSearchScore" },
      },
    },
    { $sort: { score: -1 } },
    {
      $project: {
        _id: 0,
        documentName: 1,
        content: 1,
        score: 1,
      },
    },
  );

  const results = await DocumentChunk.aggregate(pipeline);

  return results || [];
}