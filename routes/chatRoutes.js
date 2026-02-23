import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { basicChat, chatStreamPlaceholder } from '../controllers/chatController.js';

const router = Router();

// POST /api/chat
// Basic synchronous chat endpoint (no RAG or streaming yet)
router.post('/', authenticate, basicChat);

// GET /api/chat/stream
// Placeholder SSE endpoint
router.get('/stream', authenticate, chatStreamPlaceholder);

export default router;

