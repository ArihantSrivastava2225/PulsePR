import express from 'express';
import { getPROpportunities } from '../controllers/ai.controller.js';

const router = express.Router();

router.get('/opportunities', getPROpportunities);

export default router;
