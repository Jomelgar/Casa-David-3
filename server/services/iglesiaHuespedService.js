const {IglesiaHuesped} = require('../models/huesped')


exports.crearIglesiaH = async (req) =>{
   const {id_iglesia_huesped,id_iglesia, id_huesped} = req.body;
   const nuevoIglesiaH = await IglesiaHuesped.create({
       id_iglesia_huesped,   
       id_iglesia,
       id_huesped,
   })

   return nuevoIglesiaH
}

exports.getAllIglesiaH = async()=>{
   const iglesiasH = await IglesiaHuesped.findAll();
   return iglesiasH
}

exports.getIglesiaH = async(req,res)=>{
   const {id} = req.params
   const iglesiaH = await IglesiaHuesped.findOne({
      where:{
         id_iglesia_huesped:id
      }
   })
   return iglesiaH
}

exports.editarIglesiaH = async(req)=>{
   const {id} = req.params;
   const {id_iglesia,id_huesped} = req.body
   const unIglesiaH = await IglesiaHuesped.findByPk(id)
   unIglesiaH.id_iglesia= id_iglesia;
   unIglesiaH.id_huesped=id_huesped;
   await unIglesiaH.save()
   return unIglesiaH  
 }

 exports.eliminarIglesiaH = async(req,res)=>{
   const {id} = req.params;
    await IglesiaHuesped.destroy({
      where:{
         id_iglesia_huesped:id,
      }
   })
 
 }