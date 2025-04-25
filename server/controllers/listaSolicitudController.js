const listaSolicitudService = require("../services/listaSolicitudService");

exports.getAllListaSolicitud = async (req, res) => {
  try {
    const lista = await listaSolicitudService.getAllListaSolicitud();
    res.status(201).json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await listaSolicitudService.getSolicitudes();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearSolicitud = async (req, res) => {
  try {
    const espera = await listaSolicitudService.crearListaSolicitud(req.body);
    res.status(201).json(espera);
  } catch (error) {
    console.log("controller", error.message)
    if (error.message === "people_max_reached") res.status(401).json({ error: "Se ha alcanzado el límite de personas por paciente. Contacte un administrador." })
    else res.status(500).json({ error: error.message });
  }
};
exports.getListaSolicitud = async (req, res) => {
  try {
    const espera = await listaSolicitudService.getSolicitud(req);
    if (!espera) return res.status(404).json({ message: "No existe espera" });
    res.status(201).json(espera);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.editarSolicitud = async (req, res) => {
  try {
    const editar = await listaSolicitudService.editarListaSolicitud(req);
    res.status(201).json(editar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarSolicitud = async (req, res) => {
  try {
    await listaSolicitudService.eliminarSolicitud(req);
    res.status(201).json({ ok: "Si funciona" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearSolicitudes = async (req, res) => {
  try {
    const solicitud = await listaSolicitudService.crearListaSolicitud(req);
    if (solicitud) {
      res.status(201).json(solicitud);
    } else {
      res.status(404).json({ ok: "No encuentra la solicitud" });
    }
  } catch (error) {
    console.log("controller", error.message)
    if (error.message === "people_max_reached") res.status(401).json({ error: "Se ha alcanzado el límite de personas por paciente. Contacte un administrador." })
    else res.status(500).json({ error: error.message });
  }
};
