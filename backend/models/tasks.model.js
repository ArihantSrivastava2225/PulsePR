import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: String,
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JuniorManager",
    },
    deadline: Date,
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    }
});

const Tasks = mongoose.model("Tasks", taskSchema);

export default Tasks;