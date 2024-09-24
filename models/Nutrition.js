import mongoose from "mongoose";
// schema for food log
const NutritionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    foodItem: String,
    calories: Number,
    macronutrients: {
        protein: Number,
        carbohydrates: Number,
        fats: Number
    },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Nutrition', NutritionSchema);