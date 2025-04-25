const { DataTypes } = require('sequelize');
const sequelize = require('../Db');

const Persona = sequelize.define('Persona', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_ocupacion: {
    type: DataTypes.INTEGER,
  },
  municipio_id: {
    type: DataTypes.INTEGER,
  },
  id_lugar: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING(20),
    unique: true,
  },
  primer_nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  segundo_nombre: {
    type: DataTypes.STRING(30),
  },
  primer_apellido: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  segundo_apellido: {
    type: DataTypes.STRING(30),
  },
  direccion: {
    type: DataTypes.TEXT,
  },
  telefono: {
    type: DataTypes.STRING(15),
  },
  genero: {
    type: DataTypes.ENUM('MASCULINO', 'FEMENINO', 'OTRO'),
    allowNull: false,
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  compartio_evangelio: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  acepto_a_cristo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  iglesia: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reconcilio: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'persona',
  timestamps: false,
});

const Ocupacion = sequelize.define('Ocupacion', {
  id_ocupacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'ocupacion',
  timestamps: false
});

const Municipio = sequelize.define('Municipio', {
  municipio_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  departamento_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'municipio',
  timestamps: false
});

const Lugar = sequelize.define('Lugar', {
  id_lugar: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
}, {
  tableName: 'lugar',
  timestamps: false
});

Persona.belongsTo(Ocupacion, { foreignKey: 'id_ocupacion' });
Persona.belongsTo(Municipio, { foreignKey: 'municipio_id' });
Persona.belongsTo(Lugar, { foreignKey: 'id_lugar' });

Ocupacion.hasMany(Persona, { foreignKey: 'id_ocupacion' });
Municipio.hasMany(Persona, { foreignKey: 'municipio_id' });
Lugar.hasMany(Persona, { foreignKey: 'id_lugar' });

module.exports = { Persona, Ocupacion, Municipio, Lugar };