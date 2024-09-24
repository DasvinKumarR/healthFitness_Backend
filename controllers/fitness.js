import Fitness from "../models/Fitness.js";

// Log exercise details
export const logExercise = async (req, res) => {
    const { userId, exerciseType, duration, distance, caloriesBurned } = req.body;

    // Validate incoming data
    if (!userId || !exerciseType || duration == null || distance == null || caloriesBurned == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newExercise = new Fitness({
            userId,
            exerciseType,
            duration,
            distance,
            caloriesBurned,
        });
        
        await newExercise.save();
        res.status(201).json({
            message: 'Exercise logged successfully',
            exercise: newExercise
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get exercise data for a specific user
export const getExerciseData = async (req, res) => {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        const data = await Fitness.find({ userId });
        
        if (data.length === 0) {
            return res.status(404).json({ message: 'No data available for this user' }); 
        }

        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Delete an exercise entry
export const deleteExerciseData = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Missing exercise entry ID' });
    }

    try {
        const deletedExercise = await Fitness.findByIdAndDelete(id);
        
        if (!deletedExercise) {
            return res.status(404).json({ error: 'Exercise entry not found' });
        }

        res.status(200).json({ message: 'Exercise entry deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
