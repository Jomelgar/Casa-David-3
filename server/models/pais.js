const Sequelize = require("sequelize");
const sequelize = require("../Db");

const Pais = sequelize.define(
    "Pais",
    {
        id_pais:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre:
        {
            type: Sequelize.STRING(30),
            allowNule: false
        },
        departamentos_registrados:
        {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        total_departamentos:
        {
            type:Sequelize.INTEGER,
            defaultValue: 0
        },
        divisa:
        {
            type: Sequelize.STRING(5),
            allowNull: false
        },activo:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        referencia_telefonica:
        {
            type: Sequelize.STRING(4),
            allowNull: false
        },
        formato_dni:
        {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    },
    {
        tableName: 'pais',
        timestamps: false
    }
);


module.exports = {Pais};