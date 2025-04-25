const ofrendaServ = require("../services/ofrendas.services");

exports.getAllOfrendas = async (req, res) => {
  try {
    const ofrendas = await ofrendaServ.getAllOfrendas();
    res.json(ofrendas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOfrendaById = async (req, res) => {
  try {
    const ofrenda = await ofrendaServ.getOfrendaById(req.params.id);
    res.json(ofrenda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOfrenda = async (req, res) => {
  try {
    const nuevaOfrenda = await ofrendaServ.createOfrenda(req.body);
    res.json(nuevaOfrenda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOfrendasByFecha = async (req, res) => {
  try {
    const {fecha_inicio, fecha_final} = req.params;
    const ofrendas = await ofrendaServ.getOfrendasByFecha(fecha_inicio, fecha_final);
    res.json(ofrendas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOfrenda = async (req, res) => {
  try {
    const ofrenda = await ofrendaServ.updateOfrenda(req.params.id, req.body);
    res.json(ofrenda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOfrenda = async (req, res) => {
  try {
    const ofrenda = await ofrendaServ.deleteOfrenda(req.params.id);
    res.json(ofrenda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOfrendasByReservacion = async (req, res) => {
  try {
    const ofrendas = await ofrendaServ.getOfrendasByReservacion(
      req.params.id_reservacion
    );
    res.json(ofrendas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
