const { DietPlan, User } = require('../db/models');

// Create Diet Plan
const createDietPlan = async (req, res) => {
  const { title, meals, calories, description } = req.body;
  try {
    // If meals is an object or array, stringify it to store as TEXT
    const mealsString = meals ? JSON.stringify(meals) : null;

    const plan = await DietPlan.create({ 
      title, 
      meals: mealsString, 
      calories, 
      description 
    });
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating plan", err: err.message });
  }
};

// Assign Diet Plan to User
const assignDietPlanToUser = async (req, res) => {
  const { userId, dietPlanId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.dietPlanId = dietPlanId;
    await user.save();

    res.json({ success: true, message: "Diet plan assigned" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error assigning plan", err: err.message });
  }
};

// Get diet plan for logged-in user
const getUserDietPlan = async (req, res) => {
  const userId = req.user.id; // from auth token
  try {
    const user = await User.findByPk(userId, { include: DietPlan });
    if (!user || !user.DietPlan) {
      return res.status(404).json({ success: false, message: "Diet plan not found for user" });
    }

    // Parse meals string back to JSON if exists
    const dietPlan = user.DietPlan.toJSON();
    if (dietPlan.meals) {
      dietPlan.meals = JSON.parse(dietPlan.meals);
    }

    res.json({ success: true, dietPlan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching plan", err: err.message });
  }
};

module.exports = {
  createDietPlan,
  assignDietPlanToUser,
  getUserDietPlan
};
