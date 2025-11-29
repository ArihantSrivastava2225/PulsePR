import Campaign from '../models/campaign.model.js';

export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json({ success: true, campaigns });
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createCampaign = async (req, res) => {
    try {
        const { name, clientEmail, description, team, deadline } = req.body;

        const newCampaign = await Campaign.create({
            name,
            clientEmail,
            description,
            team,
            deadline
        });

        res.status(201).json({ success: true, campaign: newCampaign });
    } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const campaign = await Campaign.findByIdAndUpdate(id, { status }, { new: true });

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        res.status(200).json({ success: true, campaign });
    } catch (error) {
        console.error("Error updating campaign status:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
