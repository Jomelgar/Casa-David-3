const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const {Persona} = require('./persona');

const Afiliado = sequelize.define('Afiliado', {
    id_afiliado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: true 
    },
    nombre:  {
      type: DataTypes.STRING(100),
      allowNull: true 
    },
    
    condicion: {
      type: DataTypes.STRING(60),
    }
  }, {
    tableName: 'afiliado',
    timestamps: false
  });

  const Patrono = sequelize.define('Patrono', {
    id_patrono: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'patrono',
    timestamps: false
  });

  const PatronoAfiliado = sequelize.define('PatronoAfiliado', {
    id_patrono_afiliado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_patrono: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_afiliado: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'patrono_afiliado',
    timestamps: false
  });



  PatronoAfiliado.belongsTo(Patrono, {foreignKey: 'id_patrono'})
  
  Patrono.hasMany(PatronoAfiliado, { foreignKey: 'id_patrono' });
  Afiliado.hasMany(PatronoAfiliado, { foreignKey: 'id_afiliado' });

  module.exports = {Afiliado, Patrono, PatronoAfiliado};