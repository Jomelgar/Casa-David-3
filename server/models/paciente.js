const { DataTypes } = require("sequelize");
const sequelize = require("../Db");
const { Piso, Sala, Hospital } = require("./hospital");
const { Persona } = require("./persona");
const CausaVisita = require("./causaVisita");

const Paciente = sequelize.define(
  "Paciente",
  {
    id_paciente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_person: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_hospital: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_piso: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_causa_visita: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "paciente",
    timestamps: false,
  }
);

Paciente.belongsTo(CausaVisita, { foreignKey: "id_causa_visita" });

Paciente.belongsTo(Persona, { foreignKey: "id_person" });
Paciente.belongsTo(Hospital, { foreignKey: "id_hospital" });
Paciente.belongsTo(Sala, { foreignKey: "id_sala" });
Paciente.belongsTo(Piso, { foreignKey: "id_piso" });

CausaVisita.hasMany(Paciente, { foreignKey: "id_causa_visita" });
Persona.hasMany(Paciente, { foreignKey: "id_person" });
Hospital.hasMany(Paciente, { foreignKey: "id_hospital" });
Sala.hasMany(Paciente, { foreignKey: "id_sala" });
Piso.hasMany(Paciente, { foreignKey: "id_piso" });

module.exports = Paciente;
