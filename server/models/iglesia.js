const { DataTypes } = require('sequelize');
const sequelize = require('../Db');

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