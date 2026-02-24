import { retrieveRelevantChunks } from "../services/retrievalService.js";
import { generateAnswer } from "../services/llmService.js";
import { ChatSession } from "../models/ChatSession.js";

export const queryDocuments = async (req, res, next) => {
  try {
    const { question, sessionId } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const matches = await retrieveRelevantChunks(question, req.user, 5);

    if (!matches.length) {
      const fallbackAnswer =
        "No relevant information found in your company's documents.";

      // Persist conversation even when no matches are found
      const savedSessionId = await upsertSession({
        reqUser: req.user,
        sessionId,
        question,
        answer: fallbackAnswer,
      });

      return res.status(200).json({
        question,
        answer: fallbackAnswer,
        matches: [],
        sessionId: savedSessionId,
      });
    }

    const retrievedText = matches
      .map(
        (m, idx) =>
          `CHUNK ${idx + 1} (doc: ${m.documentName}, score: ${typeof m.score === "number" ? m.score.toFixed(3) : "n/a"}):\n${m.content}`,
      )
      .join("\n\n---\n\n");

    const systemPrompt = `
You are an internal AI assistant.
Only answer using the provided context.
If the answer is not found in context, say:
"I cannot find this in the uploaded documents."

Be precise and factual.
`.trim();

    const userPrompt = `
CONTEXT:
${retrievedText}

QUESTION:
${question}

Answer strictly using context.
`.trim();

    const prompt = `${systemPrompt}\n\n${userPrompt}\n`;

    const answer = await generateAnswer(prompt);

    const savedSessionId = await upsertSession({
      reqUser: req.user,
      sessionId,
      question,
      answer,
    });

    return res.status(200).json({
      question,
      answer,
      matches,
      sessionId: savedSessionId,
    });
  } catch (error) {
    next(error);
  }
};

async function upsertSession({ reqUser, sessionId, question, answer }) {
  const userId = reqUser?._id?.toString?.() || reqUser?.id?.toString?.() || reqUser?.id;
  const companyId = reqUser?.companyId;

  const userMessage = { role: "user", content: question };
  const assistantMessage = { role: "assistant", content: answer };

  if (sessionId) {
    const session = await ChatSession.findOne({
      _id: sessionId,
      userId,
      companyId,
    });

    if (session) {
      session.messages.push(userMessage, assistantMessage);
      if (!session.title) {
        session.title = question.slice(0, 60);
      }
      await session.save();
      return session._id.toString();
    }
  }

  const session = await ChatSession.create({
    userId,
    companyId,
    title: question.slice(0, 60),
    messages: [userMessage, assistantMessage],
  });

  return session._id.toString();
}

