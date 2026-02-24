import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { listChatSessions, getChatSession } from "../controllers/chatSessionsController.js";

const router = Router();

// GET /api/chat
// List sessions for logged-in user
router.get("/", authenticate, listChatSessions);

// GET /api/chat/:id
// Get a single session (must belong to user + company)
router.get("/:id", authenticate, getChatSession);

export default router;

