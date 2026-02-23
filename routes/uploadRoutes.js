import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { uploadDocument } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Configure multer to store files in a temporary uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${sanitized}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'));
  }
  return cb(null, true);
};

const upload = multer({ storage, fileFilter });

// POST /api/upload
// Authenticated route to upload PDFs for ingestion
router.post('/', authenticate, upload.single('file'), uploadDocument);

export default router;

