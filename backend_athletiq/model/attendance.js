const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY, // Just date, no time
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("present", "absent"),
      allowNull: false,
      defaultValue: "absent",
    },
  },
  {
    tableName: "attendances",
    timestamps: true,
    indexes: [{ unique: true, fields: ["userId", "date"] }], // unique per user/date
  }
);

module.exports = Attendance;
