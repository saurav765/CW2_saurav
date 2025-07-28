// models/MembershipPlan.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const MembershipPlan = sequelize.define("MembershipPlan", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  planName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  durationInDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "membership_plans",
  timestamps: true,
});

module.exports = MembershipPlan;
