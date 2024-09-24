import mongoose from "mongoose";
// setting up schema for goal
const GoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        required: true 
    },
    target: { type: Number, required: true }, // Target value for the goal
    progress: { type: Number, default: 0 }, // Current progress towards the goal
    deadline: { type: Date, required: true }, // Deadline for achieving the goal
    createdAt: { type: Date, default: Date.now } // Automatically set creation date
});

export default mongoose.model("Goal", GoalSchema);
