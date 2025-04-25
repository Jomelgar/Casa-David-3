const causaVisitaService = require ('../services/causaVisitaService');


exports.getAllCausas = async (req, res) => {
    try{
    const causasVisita = await causaVisitaService.getAllCausaVisita();
    res.status(201).json(causasVisita);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getCausaById = async (req, res) => {

  try{
    const causaID = req.params.id;
    const causaVisita = await causaVisitaService.getCausaById(causaID);
    if(causaVisita){
      res.status(201).json(causaVisita);
    }else{
      res.status(404).json({message:'No se encontro la causa'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

exports.createCausaVisita= async (req, res) => {
  try {
    const nuevaCausa = await causaVisitaService.crearCausa(req.body);
    res.status(201).json(nuevaCausa);
  } catch (error) {
    console.error('Error al crear causa:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteCausaVisita = async (req, res) => {
  try {
      const { id } = req.params;
      const deleteCausa = await causaVisitaService.deleteCausa(id);
      if (deleteCausa) {
          res.status(201).json({ message: 'Causa eliminada' });
      } else {
          res.status(404).json({ message: 'Causa no encontrada' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.editarCausa= async(req, res)=>{
  try{
    const {id} = req.params;
    const updated = req.body;
    const causaVisita = await causaVisitaService.editarCausa(id, updated);
    if(causaVisita){
      res.status(201).json({message: 'Causa de visita editada'});
    }else{
      res.status(404).json({message: 'Error al editar la causa.'});
    }
  }catch (error){
    res.status(500).json({error: error.message});
  }
};