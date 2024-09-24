import Nutrition from "../models/Nutrition.js";

// Log food intake
export const logFood = async (req, res) => {
  const { userId, foodItem, calories, macronutrients } = req.body;

  // Validate incoming data
  if (!userId || !foodItem || calories == null || !macronutrients) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      const newNutrition = new Nutrition({
          userId,
          foodItem,
          calories,
          macronutrients: {
              protein: macronutrients.protein,
              carbohydrates: macronutrients.carbohydrates, 
              fats: macronutrients.fats 
          },
      });
      await newNutrition.save();
      res.status(201).json({ message: 'Nutrition logged successfully', nutrition: newNutrition });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};


// Get food data for a specific user
export const getFoodData = async (req, res) => {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        const data = await Nutrition.find({ userId });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a nutrition entry
export const deleteFoodData = async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return res.status(400).json({ error: 'Missing nutrition entry ID' });
  }

  try {
      const deletedNutrition = await Nutrition.findByIdAndDelete(id);
      
      if (!deletedNutrition) {
          return res.status(404).json({ error: 'Nutrition entry not found' });
      }

      res.status(200).json({ message: 'Nutrition entry deleted successfully' });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};
