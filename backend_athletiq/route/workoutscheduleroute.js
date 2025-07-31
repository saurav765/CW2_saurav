const express = require("express");
const router = express.Router();
const {
  getWorkoutScheduleForUser,
  createWorkoutSchedule,
} = require("../controller/workoutschedulecontroller");
const authGuard = require("../middleware/authguard");
const isAdmin = require("../middleware/isAdmin");

// Get schedules for a user
router.get("/:userId", authGuard, getWorkoutScheduleForUser);

// Create a workout schedule
router.post("/", authGuard, isAdmin, createWorkoutSchedule);

module.exports = router;
