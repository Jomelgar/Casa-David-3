const {Lugar}= require('../models/persona');
const {Pais} = require('../models/pais');

exports.crearLugar = async (data) => {
  try {
    const nuevoLugar = await Lugar.create(data);
    return nuevoLugar;
  } catch (error) {
    console.error('Error al crear lugar:', error);
    throw new Error('No se pudo crear el lugar');
  }
};

exports.getlugaresByPais = async (id_pais) => {
   try {
      const lugares = await Lugar.findAll({
         where: {
         id_pais: id_pais,
         activo: true
         }
      });
      return lugares;
   } catch (error) {
      console.error('Error al obtener lugares por país:', error);
      throw new Error('No se pudieron obtener los lugares');
   }
};
 
 exports.getAllLugar = async()=>{
    const lugar = await Lugar.findAll({where:{activo: true}});
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
 
exports.eliminarlugar = async(req,res)=>{
   const {id} = req.params;
   await Lugar.update({activo: false},{where: {id_lugar: id}})
 
}

exports.getLugarWithPais = async() =>
{
   const lugares = await Lugar.findAll({where: {activo: true},
      include: [{model: Pais, 
         where:{activo: true}}]});
   return lugares;
}

exports.getPaisByLugar = async(id) => 
   {
      const lugar = await Lugar.findByPk(id);
      const pais = await Pais.findOne({where:{id_pais: lugar.id_pais}});
      return pais;
   }