const iglesiaService = require('../services/iglesiaService');
 
 exports.getAllIglesia = async (req,res) =>{
  
  try{
    const iglesias = await iglesiaService.getAllIglesia()
    res.status(201).json(iglesias)
    } catch (error){
      res.status(500).json({ error: error.message });
    }
}

exports.crearIglesia = async (req,res) =>{
  try{
    const iglesia= await iglesiaService.crearIglesia(req)
    console.log ("creando iglesia")
     res.status(201).json(iglesia);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
    
}
exports.getIglesia = async (req,res) =>{
  try {
    const iglesia = await iglesiaService.getIglesia(req)
    if(!iglesia) return res.status(404).json({message: 'Iglesia no existe'})
    res.status(201).json(iglesia)
  } catch (error) {
    res.status(500).json({error:error.message});
  }
  
}
exports.editarIglesia = async (req,res) =>{

try {
  const editar = await iglesiaService.editarIglesia(req); 
  res.status(201).json(editar)
  
} catch (error) {
  res.status(500).json({ error: error.message });
}


}


exports.eliminarIglesia = async (req,res) =>{
  try {
     await iglesiaService.eliminarIglesia(req);
     res.status(201).json({ ok: "Si funciona" }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  

}
