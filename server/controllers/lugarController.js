const lugarService = require('../services/lugarService');
 
 exports.getAllLugar = async (req,res) =>{
  
  try{
    const lugar = await lugarService.getAllLugar()
    res.status(201).json(lugar)
    } catch (error){
      res.status(500).json({ error: error.message });
    }
}

exports.crearlugar = async (req,res) =>{
  try{
    const lugar= await lugarService.crearlugar(req)
    console.log ("creando lugar")
     res.status(201).json(lugar);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
    
}
exports.getlugar = async (req,res) =>{
  try {
    const lugar = await lugarService.getlugar(req)
    if(!lugar) return res.status(404).json({message: 'lugar no existe'})
    res.status(201).json(lugar)
  } catch (error) {
    res.status(500).json({error:error.message});
  }
  
}
exports.editarlugar = async (req,res) =>{

try {
  const editar = await lugarService.editarlugar(req); 
  res.status(201).json(editar)
  
} catch (error) {
  res.status(500).json({ error: error.message });
}


}


exports.eliminarlugar = async (req,res) =>{
  try {
     await lugarService.eliminarlugar(req);
     res.status(201).json({ ok: "Si funciona" }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  

}
