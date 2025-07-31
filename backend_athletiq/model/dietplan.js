const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const DietPlan = sequelize.define(
  "DietPlan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meals: {
      type: DataTypes.TEXT, // you can store JSON or a delimited string
      allowNull: true,
    },
  },
  {
    tableName: "dietplans",
    timestamps: true,
  }
);

module.exports = DietPlan;
