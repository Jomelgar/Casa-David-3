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
    const data = req.body;
    const lugar= await lugarService.crearLugar(data);
     res.status(201).json(lugar);
    } catch (error){
      res.status(500).json({ error: error.message });
    }    
}

exports.getlugarByPais = async (req,res) =>{
  try {
    const { id_pais } = req.params;
    const lugares = await lugarService.getlugaresByPais(id_pais);
    if(!lugares) return res.status(404).json({message: 'No existen lugares para este pais'})
    res.status(201).json(lugares)
  } catch (error) {
    res.status(500).json({error:error.message});
  } 
};

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

exports.getLugarWithPais = async(req,res) =>
{
  try {
    const lugares = await lugarService.getLugarWithPais(req);
     res.status(200).json(lugares); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaisByLugar = async(req,res) =>
  {
    try {
      const pais = await lugarService.getPaisByLugar(req.params.id);
      res.status(200).json(pais);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }