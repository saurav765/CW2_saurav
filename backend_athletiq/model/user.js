// models/user.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
    membershipPlan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trainerId: {   // <-- Add this field
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Trainers',  // Table name in DB for trainers
        key: 'id',
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
