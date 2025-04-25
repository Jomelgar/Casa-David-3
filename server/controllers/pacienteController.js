const pacienteService = require('../services/pacienteService');

exports.getAllPacientes = async (req, res) => {
    try{
    const pacientes = await pacienteService.getAllPacientes();
    res.status(201).json(pacientes);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getPacienteById = async (req, res) => {

  try{
    const pacienteID = req.params.id;
    const paciente = await pacienteService.getPacienteById(pacienteID);
    if(paciente){
      res.status(201).json(paciente);
    }else{
      res.status(404).json({message:'Paciente no encontrado,'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};


exports.createPaciente = async (req, res) => {
  try {
    //probar si funciona
    const { id_paciente, id_person, id_hospital, id_piso, id_sala, causa_visita, observacion } = req.body;
    const nuevoPaciente = await pacienteService.createPaciente(req.body);
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deletePacienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await pacienteService.deletePacienteById(id);
    if(paciente){
      res.status(201).json({ message: 'Paciente eliminado exitosamente'});
    }else{
      res.status(404).json({message: 'Paciente no encontrado'});
    }
  } catch (error) {
    console.error('Error al eliminar al paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.editarPaciente = async(req, res)=>{
  try{
    const {id} = req.params;
    const updated = req.body;
    const pacienteEditado = await pacienteService.editarPaciente(id, updated);
    if(pacienteEditado){
      res.status(201).json({message: 'Paciente editada con exito'});
    }else{
      res.status(404).json({message: 'Error al editar Paciente'});
    }
  }catch (error){
    res.status(500).json({error: error.message});
  }
};


exports.getAllPacientesWithPersona = async (req, res) => {
  try{
  const pacientes = await pacienteService.getAllPacientesWithPersona();
  res.status(201).json(pacientes);
  } catch (error){
    res.status(500).json({ error: error.message });
  }
};

exports.getPacienteByDNI = async(req, res)=>{
  try{
    const dniH = req.params.dni;
    const paciente = await pacienteService.gePacienteByDNI(dniH);
    console.log("Error");
    if(paciente){
      res.status(201).json(paciente);
    }else{
      res.status(404).json({ message: "paciente no encontrado," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};