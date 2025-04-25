const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const {Hospital} = require('./hospital')
const {Persona} = require('./persona')

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_hospital: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
    nickname: {
        type: DataTypes.STRING(25),
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('admin', 'usuario', 'otro'), 
        allowNull: false,
    },
},
    {
        tableName: 'usuario',
        timestamps: false
    }
);

const UsuarioPrivilegio = sequelize.define('UsuarioPrivilegio', {
    id_usuario_privilegio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_privilegio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'usuario_privilegio',
    timestamps: false,
  });

  const Privilegio = sequelize.define('Privilegio', {
    id_privilegio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING(355),
      allowNull: false,
    },
  }, {
    tableName: 'privilegio',
    timestamps: false,
  });

  Usuario.belongsTo(Persona, { foreignKey: 'id_persona' });
  Usuario.belongsTo(Hospital, { foreignKey: 'id_hospital' });
  Persona.hasOne(Usuario, { foreignKey: 'id_persona' });
  Hospital.hasMany(Usuario, { foreignKey: 'id_hospital' });

  UsuarioPrivilegio.belongsTo(Usuario, { foreignKey: 'id_usuario' });
  UsuarioPrivilegio.belongsTo(Privilegio, { foreignKey: 'id_privilegio' });
  
  Usuario.hasMany(UsuarioPrivilegio, { foreignKey: 'id_usuario' });
  Privilegio.hasMany(UsuarioPrivilegio, { foreignKey: 'id_privilegio' });

module.exports = {Usuario, Privilegio, UsuarioPrivilegio};

