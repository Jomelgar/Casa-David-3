
const sequelize = require('../Db');
const { DataTypes } = require('sequelize');

const Hospital = sequelize.define('Hospital', {
    id_hospital: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'hospital',
    timestamps: false,
  });

  const Sala = sequelize.define('Sala', {
    id_sala: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_piso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_sala: {
      type: DataTypes.STRING(25),
      allowNull: false
    }
  }, {
    tableName: 'sala',
    timestamps: false
  });

  const Piso = sequelize.define('Piso', {
    id_piso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_hospital: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_piso: {
      type: DataTypes.STRING(25),
      allowNull: false
    }
  }, {
    tableName: 'piso',
    timestamps: false
  });
  
  Piso.belongsTo(Hospital, {foreignKey: 'id_hospital'})
  Sala.belongsTo(Piso, { foreignKey: 'id_piso' });
  Piso.hasMany(Sala, {foreignKey: 'id_piso'})
  Hospital.hasMany(Piso, {foreignKey: 'id_hospital'})

  
  module.exports = {Hospital, Piso, Sala};