import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    name: String,
    clientEmail: String,
    description: String,
    team: String,
    status: {
        type: String,
        enum: ["planning", "active", "completed"],
        default: "planning",
    },
    progress: {
        type: String,
        default: 0,
    },
    deadline: Date,
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;