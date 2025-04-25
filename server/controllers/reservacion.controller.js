const reservacionService = require("../services/reservacion.services");

exports.createReservacion = async (req, res) => {
  try {
    const { idSolicitud, idCama } = req.body;

    const reservacion = await reservacionService.createReservacion(
      idSolicitud,
      idCama
    );

    if (!reservacion) {
      return res.status(404).json({ message: "Reservacion no encontrada" });
    }

    return res.status(201).json(reservacion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.switchCama = async (req, res) => {
  try {
    const { id } = req.params;
    const { idCama } = req.body;

    const reservacion = await reservacionService.switchCama(id, idCama);

    if (!reservacion) {
      return res.status(404).json({ message: "Reservacion no encontrada" });
    }

    return res.status(200).json(reservacion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.darAltaService = async (req, res) => {
  try {
    const { id } = req.params;

    const reservacion = await reservacionService.darAltaServie(id);

    if (!reservacion) {
      return res.status(404).json({ message: "Reservacion no encontrada" });
    }

    return res.status(200).json(reservacion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getReservacionActivaByIdCama = async (req, res) => {
  try {
    const { id } = req.params;

    const reservacion = await reservacionService.getReservacionActivaByIdCama(
      id
    );

    if (!reservacion) {
      return res.status(404).json({ message: "Reservacion no encontrada" });
    }

    return res.status(200).json(reservacion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAcompanantesByReservacion = async (req, res) => {
  try {
    const { id } = req.params;

    const acompanantes = await reservacionService.getAcompañanteHuesped(id);

    if (!acompanantes) {
      return res.status(404).json({ message: "Acompañantes no encontrados" });
    }

    return res.status(200).json(acompanantes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getReservacionesActivas = async (req, res) => {
  try {
    const reservaciones = await reservacionService.getReservacionesActivas();

    return res.status(200).json(reservaciones);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
