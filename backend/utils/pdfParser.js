import pdfParse from 'pdf-parse';

/**
 * Parse a PDF buffer and return extracted text (and basic metadata).
 * This keeps the ingestion controller clean and testable.
 *
 * @param {Buffer} buffer
 * @returns {Promise<{ text: string, numPages: number }>}
 */
export async function parsePDF(buffer) {
  const parsed = await pdfParse(buffer);
  return {
    text: parsed.text || '',
    numPages: parsed.numpages || 0,
  };
}

