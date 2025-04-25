const Iglesia= require('../models/iglesia')


exports.crearIglesia = async (req) =>{
   const { id_iglesia, nombre} = req.body;
   const nuevaIglesia = await Iglesia.create({
       id_iglesia,
       nombre,
   })

   return nuevaIglesia
}

exports.getAllIglesia = async()=>{
   const iglesias = await Iglesia.findAll();
   return iglesias
}

exports.getIglesia = async(req,res)=>{
   const {id} = req.params
   const iglesia = await Iglesia.findOne({
      where:{
         id_iglesia:id
      }
   })
   return iglesia
}

exports.editarIglesia = async(req)=>{
   const {id} = req.params;
   const {nombre} = req.body
   const unaIglesia = await Iglesia.findByPk(id)
   unaIglesia.nombre= nombre;
   await unaIglesia.save()
   return unaIglesia  
 }

 exports.eliminarIglesia = async(req,res)=>{
   const {id} = req.params;
    await Iglesia.destroy({
      where:{
         id_iglesia:id,
      }
   })

 }