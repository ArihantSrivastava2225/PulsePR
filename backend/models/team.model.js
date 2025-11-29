import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    description: {
        type: String,
    },
}, {
    timestamps: true,
});

// Validate max 5 members
teamSchema.path('members').validate(function (value) {
    return value.length <= 5;
}, 'Team size cannot exceed 5 members');

const Team = mongoose.model("Team", teamSchema);

export default Team;
