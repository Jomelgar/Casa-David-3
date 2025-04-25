const sequelize = require('../Db');
const {AfiliadoHuesped} = require('../models/huesped');

exports.getAllAfiliadoHuespedes = async () =>{
    const huespedes = await AfiliadoHuesped.findAll();
    return huespedes;
};

exports.getAfiliadoHuespedById = async (id) =>{
    const huesped = await AfiliadoHuesped.findByPk(id);
    return huesped;
};

exports.crearAfiliadoHuesped = async (afiliadoData) =>{
    const nuevoHuesped = await AfiliadoHuesped.create(afiliadoData);
    return nuevoHuesped;
};

exports.deleteAfiliadoHuespedById = async (id) =>{
    const borrar = await AfiliadoHuesped.destroy({
        where:{
            id_huesped:id
        }
    });
    return borrar;
};

exports.editarAfiliadoHuesped = async (id, afiliadoHuespedUpdate) =>{
    const afiliadoHuespedEditado = await AfiliadoHuesped.update(afiliadoHuespedUpdate, {
        where:{id_afiliado_huesped:id}
    });
  
    if(afiliadoHuespedEditado){
        const edited = await AfiliadoHuesped.findOne({ 
            where: {id_afiliado_huesped:id}
        });
        return edited;
    }
  };