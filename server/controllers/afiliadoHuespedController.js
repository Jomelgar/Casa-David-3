const afiliadoHuespedService = require ('../services/afiliadoHuespedService');


exports.getAllAfiliadoHuespedes = async (req, res) => {
    try{
    const afiliadoHuespedes = await afiliadoHuespedService.getAllAfiliadoHuespedes();
    res.status(201).json(afiliadoHuespedes);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getAfiliadoHuespedById = async (req, res) => {

  try{
    const huespedID = req.params.id;
    const afiliadoHuesped = await afiliadoHuespedService.getAfiliadoHuespedById(huespedID);
    if(afiliadoHuesped){
      res.status(201).json(afiliadoHuesped);
    }else{
      res.status(404).json({message:'Huesped no encontrado,'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

exports.createAfiliadoHuesped= async (req, res) => {
  try {
    const { id_afiliado_huesped, id_afiliado, id_huesped} = req.body;
    const nuevoAfiliadoHuesped = await afiliadoHuespedService.crearAfiliadoHuesped(req.body);
    res.status(201).json(nuevoAfiliadoHuesped);
  } catch (error) {
    console.error('Error al crear huesped afiliado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteHuespedById = async (req, res) => {
  try {
      const { id } = req.params;
      const deleteAfiliadoHuesped = await afiliadoHuespedService.deleteAfiliadoHuespedById(id);
      if (deleteAfiliadoHuesped) {
          res.status(201).json({ message: 'Huesped afiliado eliminado exitosamente' });
      } else {
          res.status(404).json({ message: 'Huesped afiliado no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.editarAfiliadoHuesped= async(req, res)=>{
  try{
    const {id} = req.params;
    const updated = req.body;
    const afiliadoHuespedEditado = await afiliadoHuespedService.editarAfiliadoHuesped(id, updated);
    if(afiliadoHuespedEditado){
      res.status(201).json({message: 'Huesped Afiliado editado con exito'});
    }else{
      res.status(404).json({message: 'Error al editar huesped afiliado.'});
    }
  }catch (error){
    res.status(500).json({error: error.message});
  }
};