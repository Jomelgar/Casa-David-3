const Sequelize = require('sequelize');
const sequelize = require('../Db');
const {Persona} = require('./persona');
const {Pais} = require('./pais');

const Afiliado = sequelize.define('Afiliado', {
    id_afiliado: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dni: {
      type: Sequelize.STRING(20),
      allowNull: true 
    },
    nombre:  {
      type: Sequelize.STRING(100),
      allowNull: true 
    },
    condicion: {
      type: Sequelize.STRING(60),
    },
    id_pais:
    {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'afiliado',
    timestamps: false
  });

  const Patrono = sequelize.define('Patrono', {
    id_patrono: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'patrono',
    timestamps: false
  });

  const PatronoAfiliado = sequelize.define('PatronoAfiliado', {
    id_patrono_afiliado: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_patrono: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_afiliado: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'patrono_afiliado',
    timestamps: false
  });



  PatronoAfiliado.belongsTo(Patrono, {foreignKey: 'id_patrono'});
  PatronoAfiliado.belongsTo(Afiliado,{foreignKey: 'id_afiliado'});
  Afiliado.belongsTo(Pais, {foreignKey: 'id_pais'});

  Patrono.hasMany(PatronoAfiliado, { foreignKey: 'id_patrono' });
  Afiliado.hasMany(PatronoAfiliado, { foreignKey: 'id_afiliado' });
  Pais.hasMany(Afiliado,{foreignKey: 'id_pais'});
  module.exports = {Afiliado, Patrono, PatronoAfiliado};