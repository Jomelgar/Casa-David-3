const { DataTypes } = require("sequelize");
const sequelize = require("../Db");

const CausaVisita = sequelize.define(
  "CausaVisita",
  {
    id_causa_visita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    causa: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    tableName: "causa_visita",
    timestamps: false,
  }
);

module.exports = CausaVisita;
