import fs from "fs/promises";
import { parsePDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/chunker.js";
import { DocumentChunk } from "../models/DocumentChunk.js";
import { generateEmbedding } from "../services/embeddingService.js";

export const uploadDocument = async (req, res, next) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    filePath = req.file.path;
    const documentName = req.file.originalname;

    console.log("📄 Uploading:", documentName);

    // Read uploaded file
    const fileBuffer = await fs.readFile(filePath);

    // Extract text from PDF
    const { text, numPages } = await parsePDF(fileBuffer);

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "No text content found in PDF",
      });
    }

    console.log("📝 Extracted text length:", text.length);

    // Chunk text
    const rawChunks = chunkText(text, 1000, 100);

    // Filter out blank or tiny chunks (<50 chars)
    const chunks = rawChunks.filter(
      (chunk) => chunk && chunk.trim()
    );

    if (chunks.length === 0) {
      return res.status(400).json({
        message: "No valid chunks generated from PDF",
      });
    }

    console.log("📦 Total chunks:", chunks.length);

    const docsToInsert = [];

    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];

      console.log(`🔹 Processing chunk ${index}`);

      const embedding = await generateEmbedding(chunk);

      if (!embedding || !Array.isArray(embedding)) {
        throw new Error(`Invalid embedding for chunk ${index}`);
      }

      console.log(
        `✅ Chunk ${index} embedding length:`,
        embedding.length
      );

      docsToInsert.push({
        documentName,
        pageNumber: null,
        chunkIndex: index,
        content: chunk,
        embedding,
        createdAt: new Date(),
      });
    }

    // Remove old chunks of same document
    await DocumentChunk.deleteMany({ documentName });

    // Insert new chunks
    const inserted = await DocumentChunk.insertMany(docsToInsert);

    console.log("🎉 Inserted documents:", inserted.length);

    return res.status(201).json({
      message: "Document ingested successfully",
      fileName: documentName,
      numPages,
      chunksCreated: inserted.length,
    });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    next(error);
  } finally {
    // Always cleanup temp file
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn("⚠️ Could not delete temp file");
      }
    }
  }
};