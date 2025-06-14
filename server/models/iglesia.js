const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Iglesia = sequelize.define('Iglesia', {
    id_iglesia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName: 'iglesia',
    timestamps: false
  });
  
  module.exports = {Iglesia};