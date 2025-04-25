const { DataTypes } = require("sequelize");
const sequelize = require("../Db");
const { Persona } = require("./persona");
const { Afiliado } = require("./afiliado");
const Paciente = require("./paciente");
const { Iglesia } = require("./iglesia");
// const {Transaccion} = require("./reservaciones");

const Huesped = sequelize.define(
  "Huesped",
  {
    id_huesped: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
    },
    reingreso: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "huesped",
    timestamps: false,
  }
);

const PacienteHuesped = sequelize.define(
  "PacienteHuesped",
  {
    id_paciente_huesped: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_huesped: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentesco_paciente: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: "paciente_huesped",
    timestamps: false,
  }
);

const IglesiaHuesped = sequelize.define(
  "IglesiaHuesped",
  {
    id_iglesia_huesped: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_iglesia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_huesped: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "iglesia_huesped",
    timestamps: false,
  }
);

Huesped.belongsTo(Persona, { foreignKey: "id_persona" });
// Huesped.hasMany(Transaccion, {foreignKey: 'id_transaccion'});

// Transaccion.belongsTo(Huesped, {foreignKey: "id_huesped"});


IglesiaHuesped.belongsTo(Huesped, { foreignKey: "id_huesped" });
IglesiaHuesped.belongsTo(Iglesia, { foreignKey: "id_iglesia" });
Iglesia.hasMany(IglesiaHuesped, { foreignKey: "id_iglesia" });
Huesped.hasMany(IglesiaHuesped, { foreignKey: "id_huesped" });

PacienteHuesped.belongsTo(Huesped, { foreignKey: "id_huesped" });
PacienteHuesped.belongsTo(Paciente, { foreignKey: "id_paciente" });

Paciente.hasMany(PacienteHuesped, { foreignKey: "id_paciente" });
Huesped.hasMany(PacienteHuesped, { foreignKey: "id_huesped" });
PacienteHuesped.belongsTo(Huesped, { foreignKey: "id_huesped" });
Huesped.belongsTo(Persona, { foreignKey: "id_persona" });

module.exports = {
  Huesped,
  PacienteHuesped,
  IglesiaHuesped,
};
