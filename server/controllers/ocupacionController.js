const ocupacionService = require('../services/ocupacionService');
 
 exports.getAllOcupacion = async (req,res) =>{
  
  try{
    const ocupaciones = await ocupacionService.getAllOcupacion()
    res.status(201).json(ocupaciones)
    } catch (error){
      res.status(500).json({ error: error.message });
    }
}

exports.crearOcupacion = async (req,res) =>{
  try{
    const ocupacion= await ocupacionService.crearOcupacion(req)
    console.log ("creando ocupacion")
     res.status(201).json(ocupacion);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
    
}
exports.getOcupacion = async (req,res) =>{
  try {
    const ocupacion = await ocupacionService.getOcupacion(req)
    if(!ocupacion) return res.status(404).json({message: 'No existe esa ocupacion'})
    res.status(201).json(ocupacion)
  } catch (error) {
    res.status(500).json({error:error.message});
  }
  
}
exports.editarOcupacion = async (req,res) =>{

try {
  const editar = await ocupacionService.editarOcupacion(req);
  
  res.json(editar)
  
} catch (error) {
  res.status(500).json({ error: error.message });
}


}


exports.eliminarOcupacion = async (req,res) =>{
  try {
     await ocupacionService.eliminarOcupacion(req);
     res.status(201).json({ ok: "Si funciona" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  

}


