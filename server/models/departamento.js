const sequelize = require("../Db");
const Sequelize = require("sequelize");


const Departamento = sequelize.define('Departamento', {
    departamento_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING,
        unique: true
    }
},
    {
        tableName: 'departamento',
        timestamps: false
    });

module.exports = Departamento;