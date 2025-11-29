import mongoose from "mongoose";

const juniorManagerSchema = new mongoose.Schema({
    name: String,
    email: String,
    status: {
        type: String,
        enum: ["available", "busy"],
        default: "available"
    },
    activeTasks: {
        type: Number,
        default: 0,
    },
});

const JuniorMg = mongoose.model("JuniorMg", juniorManagerSchema);

export default JuniorMg;