const procedenciaService = require('../services/procedenciaService');
 
 exports.getAllProcedencia = async (req,res) =>{
  
  try{
    const procedencias = await procedenciaService.getAllProcedencia()
    res.status(201).json(procedencias)
    } catch (error){
      res.status(500).json({ error: error.message });
    }
}

exports.crearProcedencia = async (req,res) =>{
  try{
    const procedencia= await procedenciaService.crearProcedencia(req)
    console.log ("creando procedencia")
     res.status(201).json(procedencia);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
    
}
exports.getProcedencia = async (req,res) =>{
  try {
    const ocupacion = await procedenciaService.getProcedencia(req)
    if(!ocupacion) return res.status(404).json({message: 'No existe esa procedencia'})
    res.status(201).json(ocupacion)
  } catch (error) {
    res.status(500).json({error:error.message});
  }
  
}
exports.editarProcedencia = async (req,res) =>{

try {
  const editar = await procedenciaService.editarProcedencia(req);
  
  res.status(201).json(editar)
  
} catch (error) {
  res.status(500).json({ error: error.message });
}


}


exports.eliminarProcedencia = async (req,res) =>{
  try {
    await procedenciaService.eliminarProcedencia(req);
    res.status(201).json({ ok: "Si funciona" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  

}


