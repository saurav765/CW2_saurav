// models/workoutSchedule.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const WorkoutSchedule = sequelize.define(
  "WorkoutSchedule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // table name string
        key: "id",
      },
    },
    workoutDay: {
      type: DataTypes.STRING, // e.g. "Monday", or you can use DATEONLY for specific dates
      allowNull: false,
    },
    workoutDetails: {
      type: DataTypes.TEXT, // detailed workout description or JSON string
      allowNull: false,
    },
  },
  {
    tableName: "workout_schedules",
    timestamps: true,
  }
);

module.exports = WorkoutSchedule;
