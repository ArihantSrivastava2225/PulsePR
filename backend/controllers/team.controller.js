import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const getContentCreators = async (req, res) => {
    try {
        // Search for all variations of the content creator role
        const creators = await User.find({
            role: { $in: ["content-creator", "content_creator", "creator"] }
        }).select("-password");
        res.status(200).json({ success: true, creators });
    } catch (error) {
        console.error("Error fetching content creators:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createTeam = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const managerId = req.user._id;

        if (members.length > 5) {
            return res.status(400).json({ success: false, message: "Team size cannot exceed 5 members" });
        }

        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
            return res.status(400).json({ success: false, message: "Team name already exists" });
        }

        const newTeam = await Team.create({
            name,
            description,
            manager: managerId,
            members
        });

        res.status(201).json({ success: true, team: newTeam });
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getUserTeams = async (req, res) => {
    try {
        const userId = req.user._id;
        const teams = await Team.find({
            $or: [{ manager: userId }, { members: userId }]
        });
        res.status(200).json({ success: true, teams });
    } catch (error) {
        console.error("Error fetching user teams:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
