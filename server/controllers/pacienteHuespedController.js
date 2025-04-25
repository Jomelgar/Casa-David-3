const phService = require('../services/pacienteHuespedService');

exports.getAllPH = async (req, res) =>{
    try{
        const phs = await phService.getAllPH();
        res.status(201).json(phs);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.getOnePH = async (req, res) => {
    try{
      const phID = req.params.id;
      const ph = await phService.getOnePH(phID);
      if(ph){
        res.status(201).json(ph);
      }else{
        res.status(404).json({message:'Paciente Huesped no encontrado,'});
      }
    }catch(error){
      res.status(500).json({error:error.message});
    }
  };

  exports.getPHbyHuesped = async (req, res) => {
    try{
      const phID = req.params.id;
      const ph = await phService.getPHbyHuesped(phID);
      if(ph){
        res.status(201).json(ph);
      }else{
        res.status(404).json({message:'Paciente Huesped no encontrado,'});
      }
    }catch(error){
      res.status(500).json({error:error.message});
    }
  }
  
exports.createPH = async (req, res) =>{
    try{
        const {id_paciente_huesped, id_paciente, id_huesped, parentesco_paciente} = req.body;
        const nuevoPH = await phService.createPH(req.body);
        res.status(201).json(nuevoPH);
    }catch(error){
        console.error('Error al crear huesped: ', error);
        res.status(500).json({message: 'Error interno del servidor'});
    }
};

exports.deletePHById = async (req, res)=>{
    try{
        const {id} = req.params;
        const deletePH = await phService.deletePHById(id);
        if(deletePH){
            res.status(201).json({message: 'Paciente Huesped eliminado exitosamente'});
        }else{
            res.status(404).json({message: 'Paciente Huesped no encontrado'});
        }
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.editarPH = async(req, res)=>{
    try{
      const {id} = req.params;
      const updated = req.body;
      const phEditado = await phService.editarPH(id, updated);
      if(phEditado){
        res.status(201).json({message: 'Paciente Huesped editada con exito'});
      }else{
        res.status(404).json({message: 'Error al editar Paciente Huesped'});
      }
    }catch (error){
      res.status(500).json({error: error.message});
    }
  };
  