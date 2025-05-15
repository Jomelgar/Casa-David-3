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
        },
        extension_telefonica:
        {
            type: Sequelize.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'pais',
        timestamps: false
    }
);


module.exports = {Pais};