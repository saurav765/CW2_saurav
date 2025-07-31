const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');

const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'trainers', // ✅ Explicit table name for consistency with foreign keys
});

module.exports = Trainer;
