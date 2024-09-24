import mongoose from "mongoose";

// schema definition for exercise log
 const FitnessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    exerciseType: String,
    duration: Number,
    distance: Number,
    caloriesBurned: Number,
    date: { type: Date, default: Date.now }
  });

  export default mongoose.model('Fitness', FitnessSchema);