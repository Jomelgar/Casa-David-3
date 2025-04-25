const Sequelize = require("sequelize");
const sequelize = require("../Db");


const Municipio = sequelize.define('Municipio', {
    municipio_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departamento_id: {
        type: Sequelize.INTEGER,
        nullable: false
    },
    nombre: {
        type: Sequelize.STRING,
    }
},
    {
        tableName: 'municipio',
        timestamps: false
    });

module.exports = Municipio;