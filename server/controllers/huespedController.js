const huespedService = require("../services/huespedService");

exports.getAllHuespedes = async (req, res) => {
  try {
    const huespedes = await huespedService.getAllHuespedes();
    res.status(201).json(huespedes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllHuespedesName = async (req, res) => {
  try {
    const huespedes = await huespedService.getAllHuespedesName();
    res.status(201).json(huespedes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHuespedById = async (req, res) => {
  try {
    const huespedID = req.params.id;
    const huesped = await huespedService.getHuespedById(huespedID);
    if (huesped) {
      res.status(201).json(huesped);
    } else {
      res.status(404).json({ message: "Huesped no encontrado," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHuespedByDNI = async(req, res)=>{
  try{
    const dniH = req.params.dni;
    const huesped = await huespedService.getHuespedByDNI(dniH);
    console.log("Error");
    if(huesped){
      res.status(201).json(huesped);
    }else{
      res.status(404).json({ message: "Huesped no encontrado," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createHuesped = async (req, res) => {
  try {
    const { id_huesped, id_persona, activo, reingreso } = req.body;
    const nuevaHuesped = await huespedService.crearHuesped(req.body);
    res.status(201).json(nuevaHuesped);
  } catch (error) {
    console.error("Error al crear huesped:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deleteHuespedById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteHuesped = await huespedService.deleteHuespedById(id);
    if (deleteHuesped) {
      res.status(201).json({ message: "Huesped eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Huesped no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editarHuesped = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const huespedEditado = await huespedService.editarHuesped(id, updated);
    if (huespedEditado) {
      res.status(201).json({ message: "Huesped editado con exito" });
    } else {
      res.status(404).json({ message: "Error al editar Huesped." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHuespedVisitas = async (req, res) => {
  try {
    const huespedID = req.params.id;
    const huesped = await huespedService.getHuesped(huespedID);
    if (huesped) {
      res.status(201).json(huesped);
    } else {
      res.status(404).json({ message: "Huesped no encontrado," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};