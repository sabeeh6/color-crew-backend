import express from 'express';
import { getChatHistory } from '../controllers/chatController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get chat history for a sketch (authenticated users only)
router.get('/:sketchId', verifyUser, getChatHistory);

export default router;
