const {Lugar}= require('../models/persona');

exports.crearLugar = async (data) => {
  try {
    const nuevoLugar = await Lugar.create(data);
    return nuevoLugar;
  } catch (error) {
    console.error('Error al crear lugar:', error);
    throw new Error('No se pudo crear el lugar');
  }
};

 
 exports.getAllLugar = async()=>{
    const lugar = await Lugar.findAll();
    return lugar
 }
 
 exports.getLugar = async(req,res)=>{
    const {id} = req.params
    const Lugar = await Lugar.findOne({
       where:{
          id_Lugar:id
       }
    })
    return Lugar
 }
 
 exports.editarLugar = async(req)=>{
    const {id} = req.params;
    const {codigo} = req.body
    const unaLugar = await Lugar.findByPk(id)
    unaLugar.codigo= codigo;
    await unaLugar.save()
    return unaLugar  
  }
 
  exports.eliminarLugar = async(req,res)=>{
    const {id} = req.params;
     await Lugar.destroy({
       where:{
          id_Lugar:id,
       }
    })
 
  }