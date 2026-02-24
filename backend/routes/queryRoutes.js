import express from "express";
import { queryDocuments } from "../controllers/queryController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/query", authenticate, queryDocuments);

export default router;

