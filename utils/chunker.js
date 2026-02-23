/**
 * Split text into overlapping chunks using a sliding window.
 *
 * @param {string} text
 * @param {number} [chunkSize=1000]
 * @param {number} [overlap=100]
 * @returns {string[]}
 */
export function chunkText(text, chunkSize = 1000, overlap = 100) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const normalized = text.trim();
  if (!normalized) {
    return [];
  }

  const chunks = [];
  const step = Math.max(1, chunkSize - overlap);
  let start = 0;

  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + chunkSize);
    const chunk = normalized.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    if (end >= normalized.length) {
      break;
    }

    start += step;
  }

  return chunks;
}

