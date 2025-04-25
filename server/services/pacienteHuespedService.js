const sequelize = require('../Db');
const {PacienteHuesped} = require('../models/huesped');

exports.getAllPH = async () =>{
    const pahu = await PacienteHuesped.findAll();
    return pahu;
};

exports.getOnePH = async (id) =>{
    const pahu1 = await PacienteHuesped.findByPk(id);
    return pahu1;
};

exports.getPHbyHuesped = async (id) =>{
    const pahu2 = await PacienteHuesped.findOne({
        where:{
            id_huesped:id
        }
    });
    return pahu2;
}

exports.createPH = async (phData)=>{
    const nuevoPH = await PacienteHuesped.create(phData);
    return nuevoPH;
};

exports.deletePHById = async (id)=>{
    const borrar = await PacienteHuesped.destroy({
        where:{
            id_paciente_huesped:id
        }
    });
};

exports.editarPH = async (id, phUpdate) =>{
    const phEditado = await PacienteHuesped.update(phUpdate, {
        where:{id_paciente_huesped:id}
    });

    if(phEditado){
        const edited = await PacienteHuesped.findOne({ 
            where: {id_paciente_huesped:id}
        });
        return edited;
    }
};