import express from "express";
import { queryDocuments } from "../controllers/queryController.js";

const router = express.Router();

router.post("/query", queryDocuments);

export default router;

