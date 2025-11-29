import express from "express";
import Campaign from "../models/campaign.model.js";
import JuniorMg from "../models/juniormg.model.js";
import Tasks from "../models/tasks.model.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all ongoing campaigns
router.get("/campaigns", protect, authorizeRoles("senior-manager", "director"), async (req, res) => {
  const campaigns = await Campaign.find();
  res.json(campaigns);
});

// Get all junior managers
router.get("/junior-managers", protect, authorizeRoles("senior-manager"), async (req, res) => {
  const managers = await JuniorMg.find();
  res.json(managers);
});

// Get upcoming deadlines
router.get("/deadlines", protect, authorizeRoles("senior-manager"), async (req, res) => {
  const deadlines = await Tasks.find().populate("campaign assignedTo");
  res.json(deadlines);
});

// Upload report to director (mock route)
router.post("/upload-report", protect, authorizeRoles("senior-manager"), async (req, res) => {
  const { title, link } = req.body;
  // In future, integrate Nodemailer to email director
  res.json({ message: `Report '${title}' uploaded successfully!`, link });
});

export default router;
