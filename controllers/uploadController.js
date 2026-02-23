import fs from "fs/promises";
import { parsePDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/chunker.js";
import { DocumentChunk } from "../models/DocumentChunk.js";

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const documentName = req.file.originalname;

    // Read file
    const fileBuffer = await fs.readFile(filePath);

    // Extract text from PDF
    const { text, numPages } = await parsePDF(fileBuffer);

    if (!text) {
      return res
        .status(400)
        .json({ message: "No text content found in PDF" });
    }

    // Chunk text
    const chunks = chunkText(text, 1000, 100);

    if (chunks.length === 0) {
      return res
        .status(400)
        .json({ message: "No chunks generated from PDF" });
    }

    // Prepare documents
    const docsToInsert = chunks.map((content, index) => ({
      documentName,
      pageNumber: null,
      chunkIndex: index,
      content,
      embedding: [],
    }));

    // Insert into MongoDB
    const inserted = await DocumentChunk.insertMany(docsToInsert);

    // Cleanup temp file
    await fs.unlink(filePath);

    return res.status(201).json({
      message: "Document ingested successfully",
      fileName: documentName,
      numPages,
      chunksCreated: inserted.length,
    });
  } catch (error) {
    next(error);
  }
};