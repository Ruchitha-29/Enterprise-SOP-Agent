import pdfParse from 'pdf-parse';
import fs from 'fs/promises';

// NOTE: Chunking, embeddings, and MongoDB Atlas Vector Search will be added later.

export async function uploadSop(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    const fileBuffer = await fs.readFile(filePath);
    const parsed = await pdfParse(fileBuffer);

    // Placeholder: just return basic info, no DB writes yet
    return res.status(201).json({
      message: 'SOP uploaded successfully (RAG processing TBD)',
      fileName: req.file.originalname,
      numPages: parsed.numpages,
      textPreview: parsed.text.slice(0, 500),
    });
  } catch (error) {
    return next(error);
  } finally {
    // Clean up temp file
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore
    }
  }
}

