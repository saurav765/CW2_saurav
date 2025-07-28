// controllers/attendanceController.js
const Attendance = require("../model/attendance");

const markAttendance = async (req, res) => {
  try {
    const { userId, date, status } = req.body;
    if (!userId || !status) {
      return res.status(400).json({ success: false, message: "userId and status are required" });
    }
    const attendanceDate = date || new Date().toISOString().slice(0, 10); // default today YYYY-MM-DD

    // Upsert: create if not exists, else update
    const [attendance, created] = await Attendance.findOrCreate({
      where: { userId, date: attendanceDate },
      defaults: { status },
    });
    if (!created) {
      attendance.status = status;
      await attendance.save();
    }
    return res.status(200).json({ success: true, attendance, message: "Attendance marked successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to mark attendance", error });
  }
};
const getAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month } = req.query; // format 'YYYY-MM'

    if (!userId) return res.status(400).json({ success: false, message: "userId required" });
    if (!month) return res.status(400).json({ success: false, message: "month query param required" });

    const startDate = new Date(month + "-01");
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const attendanceRecords = await Attendance.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      order: [["date", "ASC"]],
    });
    return res.status(200).json({ success: true, attendanceRecords });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get attendance history", error });
  }
};


const getMonthlyAttendanceSummary = async (req, res) => {
  try {
    const { month } = req.query; // format 'YYYY-MM'
    if (!month) return res.status(400).json({ success: false, message: "month query param required" });

    const startDate = new Date(month + "-01");
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const attendanceRecords = await Attendance.findAll({
      where: {
        date: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      order: [["userId", "ASC"], ["date", "ASC"]],
    });
    return res.status(200).json({ success: true, attendanceRecords });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get attendance summary", error });
  }
};
module.exports = {
  markAttendance,
  getAttendanceHistory,
  getMonthlyAttendanceSummary
};