const express = require("express");
const router = express.Router();
const { markAttendance, getAttendanceHistory, getMonthlyAttendanceSummary } = require("../controller/attendanceController");
const authGuard = require("../middleware/authguard");
const isAdmin = require("../middleware/isAdmin");

router.post("/mark", authGuard, isAdmin, markAttendance);
router.get("/history/:userId", authGuard, isAdmin, getAttendanceHistory);
router.get("/summary", authGuard, isAdmin, getMonthlyAttendanceSummary);

module.exports = router;
