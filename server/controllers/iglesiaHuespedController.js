const iglesiaHService = require('../services/iglesiaHuespedService');
 
 exports.getAllIglesiaH = async (req,res) =>{
  
  try{
    const iglesiasH = await iglesiaHService.getAllIglesiaH();
    res.status(201).json(iglesiasH)
    } catch (error){
      res.status(500).json({ error: error.message });
    }
}

exports.crearIglesiaH = async (req,res) =>{
  try{
    const iglesia= await iglesiaHService.crearIglesiaH(req)
    console.log ("creando iglesia")
     res.status(201).json(iglesia);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
    
}
exports.getIglesiaH = async (req,res) =>{
  try {
    const iglesiaH = await iglesiaHService.getIglesiaH(req)
    if(!iglesiaH) return res.status(404).json({message: 'No existe Huesped Iglesia'})
    res.status(201).json(iglesiaH)
  } catch (error) {
    res.status(500).json({error:error.message});
  }
  
}
exports.editarIglesiaH = async (req,res) =>{

try {
  const editar = await iglesiaHService.editarIglesiaH(req); 
  res.status(201).json(editar)
  
} catch (error) {
  res.status(500).json({ error: error.message });
}


}


exports.eliminarIglesiaH = async (req,res) =>{
  try {
   await iglesiaHService.eliminarIglesiaH(req);
    res.status(201).json({ ok: "Si funciona" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  

}
