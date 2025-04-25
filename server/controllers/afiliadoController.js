const afiliadoService = require('../services/afiliadoService')

//Afiliados
exports.getAllAfiliados = async (req, res) => {
    try{
    const allAfiliados = await afiliadoService.getAllAfiliado();
    res.status(201).json(allAfiliados);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getAfiliadoById = async (req, res) => {

  try{
    const ID = req.params.id;
    const afiliado = await afiliadoService.getAfiliadoById(ID);
    if(afiliado){
      res.status(201).json(afiliado);
    }else{
      res.status(404).json({message:'Afiliado no encontrado.'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

exports.createAfiliado = async (req, res) => {
  try {
    const {id_persona, condicion } = req.body;
    const nuevoAfiliado = await afiliadoService.crearAfiliado(req.body);

    res.status(201).json(nuevoAfiliado);
  } catch (error) {
    console.error('Error al crear afiliado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteAfiliadoById = async (req, res) => {
  try {
      const { id } = req.params;
      const deleteAfiliado = await afiliadoService.deleteAfiliadoById(id);
      if (deleteAfiliado) {
          res.status(201).json({ message: 'Afiliado eliminado exitosamente' });
      } else {
          res.status(404).json({ message: 'Afiliado no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.editarAfiliado= async(req, res)=>{
  try{
    const {id} = req.params;
    const updated = req.body;
    const afiliadoEditado = await afiliadoService.editarAfiliado(id, updated);
    if(afiliadoEditado){
      res.status(201).json({message: 'Afiliado editado con exito'});
    }else{
      res.status(404).json({message: 'Error al editar afiliado.'});
    }
  }catch (error){
    res.status(500).json({error: error.message});
  }
};
//Patrono
exports.getAllPatrono = async (req, res) => {
    try{
    const allPatrono = await afiliadoService.getAllPatrono();
    res.status(201).json(allPatrono);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getPatronoById = async (req, res) => {

  try{
    const ID = req.params.id;
    const patrono = await afiliadoService.getPatronoById(ID);
    if(patrono){
      res.status(201).json(patrono);
    }else{
      res.status(404).json({message:'Patrono no encontrado.'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

exports.createPatrono = async (req, res) => {
  try {
    const {nombre } = req.body;
    const nuevoPatrono = await afiliadoService.crearPatrono(req.body);

    res.status(201).json(nuevoPatrono);
  } catch (error) {
    console.error('Error al crear patrono:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deletePatronoById = async (req, res) => {
  try {
      const { id } = req.params;
      const deletePatrono = await afiliadoService.deletePatronoById(id);
      if (deletePatrono) {
          res.status(201).json({ message: 'Patrono eliminado exitosamente' });
      } else {
          res.status(404).json({ message: 'Patrono no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.editarPatrono= async(req, res)=>{
  try{
    const {id} = req.params;
    const updated = req.body;
    const patronoEditado = await afiliadoService.editarPatrono(id, updated);
    if(patronoEditado){
      res.status(201).json({message: 'Patrono editado con exito'});
    }else{
      res.status(404).json({message: 'Error al editar patrono.'});
    }
  }catch (error){
    res.status(500).json({error: error.message});
  }
};
//PatronoAfiliado
exports.getAllPatronoAfiliado = async (req, res) => {
    try{
    const allPatronoAfiliado = await afiliadoService.getAllPatronoAfiliado();
    res.status(201).json(allPatronoAfiliado);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getPatronoAfiliadoById = async (req, res) => {

  try{
    const ID = req.params.id;
    const patronoAfiliado = await afiliadoService.getPatronoAfiliadoById(ID);
    if(patronoAfiliado){
      res.status(201).json(patronoAfiliado);
    }else{
      res.status(404).json({message:'Patrono Afiliado no encontrado.'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

exports.createPatronoAfiliado = async (req, res) => {
  try {
    const {id_patrono, id_afiliado } = req.body;
    const nuevoPatronoAfiliado = await afiliadoService.crearPatronoAfiliado(req.body);

    res.status(201).json(nuevoPatronoAfiliado);
  } catch (error) {
    console.error('Error al crear patrono afiliado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deletePatronoAfiliadoById = async (req, res) => {
  try {
      const { id } = req.params;
      const deletePatronoAfiliado = await afiliadoService.deletePatronoAfiliadoById(id);
      if (deletePatronoAfiliado) {
          res.status(201).json({ message: 'Patrono eliminado exitosamente' });
      } else {
          res.status(404).json({ message: 'Patrono Afiliado no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.editarPatronoAfiliado= async(req, res)=>{
  try{
    const {id} = req.params;
    const updated = req.body;
    const patronoAfiliadoEditado = await afiliadoService.editarPatronoAfiliado(id, updated);
    if(patronoAfiliadoEditado){
      res.status(201).json({message: 'Patrono Afiliado editado con exito'});
    }else{
      res.status(404).json({message: 'Error al editar patrono afiliado.'});
    }
  }catch (error){
    res.status(500).json({error: error.message});
  }
};