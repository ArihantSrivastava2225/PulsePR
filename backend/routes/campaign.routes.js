import express from 'express';
import { getCampaigns, createCampaign, updateCampaignStatus } from '../controllers/campaign.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getCampaigns);
router.post('/', verifyToken, authorizeRoles('director', 'senior-manager'), createCampaign);
router.patch('/:id/status', verifyToken, authorizeRoles('director', 'senior-manager'), updateCampaignStatus);

export default router;
