import express from 'express';
import { getEvents, createEvent } from '../controllers/event.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getEvents);
router.post('/', verifyToken, createEvent);

export default router;
