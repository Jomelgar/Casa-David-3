const Sequelize  = require('sequelize');
const {Pais} = require('./pais');
const sequelize = require('../Db');
const {Departamento} = require('./departamento'); 

const Persona = sequelize.define('Persona', {
  id_persona: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_ocupacion: {
    type: Sequelize.INTEGER,
  },
  municipio_id: {
    type: Sequelize.INTEGER,
  },
  id_lugar: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dni: {
    type: Sequelize.STRING(20),
    unique: true,
  },
  primer_nombre: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  segundo_nombre: {
    type: Sequelize.STRING(30),
  },
  primer_apellido: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  segundo_apellido: {
    type: Sequelize.STRING(30),
  },
  direccion: {
    type: Sequelize.TEXT,
  },
  genero: {
    type: Sequelize.ENUM('MASCULINO', 'FEMENINO', 'OTRO'),
    allowNull: false,
  },
  fecha_nacimiento: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  compartio_evangelio: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  acepto_a_cristo: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  iglesia: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  reconcilio: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  observacion: {
    type: Sequelize.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'persona',
  timestamps: false,
});

const Ocupacion = sequelize.define('Ocupacion', {
  id_ocupacion: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  tableName: 'ocupacion',
  timestamps: false
});

const Municipio = sequelize.define('Municipio', {
  municipio_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING(50),
    allowNull: false
  },activo:{
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  departamento_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'municipio',
  timestamps: false
});

const Lugar = sequelize.define('Lugar', {
  id_lugar: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  id_pais:
  {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'lugar',
  timestamps: false
});

const Telefono = sequelize.define('Telefono',
  {
    id_telefono:
    {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pais:
    {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_persona:
    {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    telefono:
    {
      type: Sequelize.STRING(15),
      allowNull: false
    }
  },{
    tableName: 'telefono',
    timestamps: false
  });

Persona.belongsTo(Ocupacion, { foreignKey: 'id_ocupacion' });
Persona.belongsTo(Lugar, { foreignKey: 'id_lugar' });
Telefono.belongsTo(Persona,{foreignKey: 'id_persona'});
Telefono.belongsTo(Pais,{foreignKey: 'id_pais'});
Lugar.belongsTo(Pais,{foreignKey: 'id_pais'});
Municipio.belongsTo(Departamento,{foreignKey: 'departamento_id'});
Persona.belongsTo(Municipio, { foreignKey: 'municipio_id' });

Ocupacion.hasMany(Persona, { foreignKey: 'id_ocupacion' });
Lugar.hasMany(Persona, { foreignKey: 'id_lugar' });
Persona.hasMany(Telefono,{foreignKey: 'id_persona'});
Pais.hasMany(Telefono,{foreignKey: 'id_persona'});
Pais.hasMany(Lugar, {foreignKey: 'id_pais'});
Departamento.hasMany(Municipio,{foreignKey: 'departamento_id'});
Municipio.hasMany(Persona, { foreignKey: 'municipio_id' });

module.exports = { Persona, Ocupacion, Municipio, Lugar, Telefono};