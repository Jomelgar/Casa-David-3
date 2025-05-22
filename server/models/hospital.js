
const sequelize = require('../Db');
const Sequelize = require('sequelize');
const {Pais} = require('./pais');
const { act } = require('react');

const Hospital = sequelize.define('Hospital', {
    id_hospital: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pais:
    {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    activo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    }
  }, {
    tableName: 'hospital',
    timestamps: false,
  });

  const Sala = sequelize.define('Sala', {
    id_sala: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_piso: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    nombre_sala: {
      type: Sequelize.STRING(25),
      allowNull: false
    }
  }, {
    tableName: 'sala',
    timestamps: false
  });

  const Piso = sequelize.define('Piso', {
    id_piso: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_hospital: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    nombre_piso: {
      type: Sequelize.STRING(25),
      allowNull: false
    }
  }, {
    tableName: 'piso',
    timestamps: false
  });
  
  Piso.belongsTo(Hospital, {foreignKey: 'id_hospital'})
  Sala.belongsTo(Piso, { foreignKey: 'id_piso' });
  Hospital.belongsTo(Pais,{foreignKey: 'id_pais'});

  Piso.hasMany(Sala, {foreignKey: 'id_piso'});
  Hospital.hasMany(Piso, {foreignKey: 'id_hospital'});
  Pais.hasMany(Hospital,{foreignKey: 'id_pais'});
  
  module.exports = {Hospital, Piso, Sala};