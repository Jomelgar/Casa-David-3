const {Ocupacion} = require('../models/persona')

exports.crearOcupacion = async (req) =>{
   const {id_ocupacion, descripcion} = req.body;
   const nuevaOcupacion = await Ocupacion.create({
       id_ocupacion,
       descripcion
   })

   return nuevaOcupacion
}

exports.getAllOcupacion = async()=>{
   const ocupaciones = await Ocupacion.findAll();
   return ocupaciones
}

exports.getOcupacion = async(req,res)=>{
   const {id} = req.params
   const ocupacion = await Ocupacion.findOne({
      where:{
         id_ocupacion:id
      }
   })
   return ocupacion
}

exports.editarOcupacion = async(req)=>{
   const {id} = req.params;
   const {descripcion} = req.body
   const unaOcupacion = await Ocupacion.findByPk(id)
   unaOcupacion.descripcion= descripcion;
   await unaOcupacion.save()
   return unaOcupacion   
 }

 exports.eliminarOcupacion = async(req,res)=>{
   const {id} = req.params;
    await Ocupacion.destroy({
      where:{
         id_ocupacion:id,
      }
   })
   
 }