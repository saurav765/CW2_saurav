const { WorkoutSchedule, User } = require("../db/models");

// Get workout schedule for a user
const getWorkoutScheduleForUser = async (req, res) => {
  try {
    const userId = req.params.userId; // or get from auth token: req.user.id

    const schedules = await WorkoutSchedule.findAll({
      where: { userId },
      order: [["workoutDay", "ASC"]], // sort by day or customize
    });

    res.json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching workout schedule", error });
  }
};

// Create or update a workout schedule (optional)
const createWorkoutSchedule = async (req, res) => {
  try {
    const { userId, workoutDay, workoutDetails } = req.body;

    if (!userId || !workoutDay || !workoutDetails) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // You could add logic here to check if workoutDay for user exists to update instead of create
    const schedule = await WorkoutSchedule.create({ userId, workoutDay, workoutDetails });

    res.status(201).json({ success: true, message: "Workout schedule created", schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating schedule", error });
  }
};

module.exports = {
  getWorkoutScheduleForUser,
  createWorkoutSchedule,
};
