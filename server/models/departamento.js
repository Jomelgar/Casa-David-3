const sequelize = require("../db");
const Sequelize = require("sequelize");
const {Pais} = require("./pais");

const Departamento = sequelize.define('Departamento', {
    departamento_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING,
        unique: false
    },
    activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    id_pais: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
    {
        tableName: 'departamento',
        fields: ['nombre'],
        timestamps: false
    }
);

Departamento.belongsTo(Pais,{foreignKey: "id_pais"});
Pais.hasMany(Departamento,{foreignKey: "id_pais"});
module.exports = {Departamento};