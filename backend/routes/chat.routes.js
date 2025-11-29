import express from 'express';
import { getChatHistory, saveMessage } from '../controllers/chat.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:room', verifyToken, getChatHistory);
router.post('/', verifyToken, saveMessage);

export default router;
