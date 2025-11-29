import express from 'express';
import { createTeam, getContentCreators, getUserTeams } from '../controllers/team.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/creators', verifyToken, authorizeRoles("junior-manager", "director"), getContentCreators);
router.get('/my-teams', verifyToken, getUserTeams);
router.post('/', verifyToken, authorizeRoles("junior-manager"), createTeam);

export default router;
