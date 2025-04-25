const { DataTypes } = require("sequelize");
const sequelize = require("../Db");
const { Persona } = require("./persona");
const { PacienteHuesped } = require("./huesped");
const { Afiliado } = require("./afiliado");

const ListaNegra = sequelize.define(
  "ListaNegra",
  {
    id_lista_negra: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_regla: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    observacion: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "lista_negra",
    timestamps: false,
  }
);

const Reglamento = sequelize.define(
  "Reglamento",
  {
    id_regla: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion_regla: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "reglamento",
    timestamps: false,
  }
);

const ListaSolicitud = sequelize.define(
  "ListaSolicitud",
  {
    id_lista_solicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_paciente_huesped: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    observacion: {
      type: DataTypes.TEXT,
    },
    fecha_entrada: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_salida: {
      type: DataTypes.DATEONLY,
    },
    becada: {
      type: DataTypes.BOOLEAN,
    },

    id_afiliado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "lista_solicitud",
    timestamps: false,
  }
);

ListaSolicitud.belongsTo(Afiliado, { foreignKey: "id_afiliado" });
Afiliado.hasMany(ListaSolicitud, { foreignKey: "id_afiliado" });

ListaNegra.belongsTo(Persona, { foreignKey: "id_persona" });
ListaNegra.belongsTo(Reglamento, { foreignKey: "id_regla" });
PacienteHuesped.hasMany(ListaSolicitud, { foreignKey: "id_paciente_huesped" });
ListaSolicitud.belongsTo(PacienteHuesped, {
  foreignKey: "id_paciente_huesped",
});

module.exports = { ListaNegra, Reglamento, ListaSolicitud };
