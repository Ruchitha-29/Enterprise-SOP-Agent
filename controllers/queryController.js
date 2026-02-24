import { retrieveRelevantChunks } from "../services/retrievalService.js";
import { generateAnswer } from "../services/llmService.js";

export const queryDocuments = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const matches = await retrieveRelevantChunks(question, 5);

    if (!matches.length) {
      return res.status(200).json({
        question,
        answer: "No relevant information found.",
        matches: [],
      });
    }

    const answer = await generateAnswer(question, matches);

    return res.status(200).json({
      question,
      answer,
      matches,
    });
  } catch (error) {
    next(error);
  }
};

