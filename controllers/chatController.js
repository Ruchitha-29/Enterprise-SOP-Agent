import { ChatSession } from '../models/ChatSession.js';

// Placeholder chat endpoint: no RAG or LLM integration yet.
// This will later:
// - Embed the user query
// - Run MongoDB Atlas Vector Search over DocumentChunk
// - Build a context window
// - Call an LLM with strict context grounding
// - Stream response via SSE with citations

export async function basicChat(req, res, next) {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, user: req.user._id });
    }

    if (!session) {
      session = await ChatSession.create({
        user: req.user._id,
        title: message.slice(0, 80),
        messages: [{ role: 'user', content: message }],
      });
    } else {
      session.messages.push({ role: 'user', content: message });
      await session.save();
    }

    // Placeholder assistant reply – to be replaced with RAG + LLM integration
    const assistantReply =
      'This is a placeholder response. The RAG pipeline and LLM integration are not implemented yet.';

    session.messages.push({ role: 'assistant', content: assistantReply });
    await session.save();

    return res.status(200).json({
      sessionId: session._id,
      reply: assistantReply,
      citations: [],
    });
  } catch (error) {
    return next(error);
  }
}

// Placeholder SSE endpoint for future streaming responses.
export function chatStreamPlaceholder(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.write('event: message\n');
  res.write(
    'data: ' +
      JSON.stringify({
        message:
          'Streaming is not yet implemented. This endpoint will stream LLM responses in a future version.',
      }) +
      '\n\n',
  );

  res.write('event: end\n');
  res.write('data: {}\n\n');
  res.end();
}

