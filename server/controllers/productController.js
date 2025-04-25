const productService = require("../services/productService");
const express = require("express");
const router = express.Router();

exports.createPago = async (req, res) => {
  try {
    const { id_pago, id_reservacion, saldo_pendiente, fecha } = req.body;
    const pago = await productService.createPago(req.body);
    res.status(201).json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getpagoById = async (req, res) => {
  try {
    const pago = await productService.getPagoById(req.params.id);
    if (pago) {
      res.status(201).json(pago);
    } else {
      res
        .status(404)
        .json({ message: "Esta pago no existe en registro" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getpagosByFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFinal } = req.query;
    const pagos = await productService.getPagosByFecha(fechaInicio, fechaFinal);
    if(pagoe){
      res.status(201).json({pagos, message: 'pago obtenida con exito.'});
    }else{
      res.status(404).json({ message: 'Esta pago no existe en registro' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRegla = async (req, res) => {
  try {
    const { id_regla, numero_regla, descripcion_regla } = req.body;
    const reglas = await productService.createRegla(req.body);
    res.status(201).json(reglas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReglaById = async (req, res) => {
  try {
    const regla = await productService.getReglaById(req.params.id);
    if (regla) {
      res.status(200).json({ regla, message: "Regla encontrada" });
    } else {
      res.status(404).json({ message: "Regla no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReglamento = async (req, res) => {
  try {
    const reglamento = await productService.getReglamento();
    res.status(200).json(reglamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editRegla = async (req, res) => {
  try {
    const { numero_regla, descripcion_regla } = req.body;
    await productService.editRegla(
      req.params.id,
      numero_regla,
      descripcion_regla
    );
    res.status(200).json({ message: "Regla modificada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createHospital = async (req, res) => {
  try {
    const { id_hospital, nombre, direccion } = req.body;
    const hospital = await productService.createHospital(req.body);
    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await productService.getHospitalById(req.params.id);
    if (hospital) {
      res.status(200).json(hospital);
    } else {
      res.status(404).json({ message: "Hospital no encontrado en registro" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHospitales = async (req, res) => {
  try {
    const hospitales = await productService.getHospitales();
    res.status(200).json(hospitales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHospitalById = async (req, res) => {
  try {
    await productService.deleteHospitalById(req.params.id);
    res.status(200).json({ message: "Hospital eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPiso = async (req, res) => {
  try {
    const { id_piso, id_hospital, nombre_piso } = req.body;
    const piso = await productService.createPiso(req.body);
    res.status(201).json(piso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPisoById = async (req, res) => {
  try {
    const piso = await productService.getPisoById(req.params.id);
    if (piso) {
      res.status(200).json(piso);
    } else {
      res.status(404).json({ message: "Piso no encontrado en registro" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPisos = async (req, res) => {
  try {
    const pisos = await productService.getAllPisos();
    res.status(200).json(pisos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPisosByHospital = async (req, res) => {
  try {
    const pisos = await productService.getPisosByHospital(req.params.id);
    if (pisos) {
      res.status(200).json(pisos);
    } else {
      res.status(404).json({ message: "Pisos no encontrados en registro" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSala = async (req, res) => {
  try {
    const { id_sala, id_piso, nombre_sala } = req.body;
    const sala = await productService.createSala(req.body);
    res.status(201).json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSalaById = async (req, res) => {
  try {
    const sala = await productService.getSalaById(req.params.id);
    if (sala) {
      res.status(200).json(sala);
    } else {
      res.status(404).json({ message: "Sala no encontrada en registro" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSalas = async (req, res) => {
  try {
    const salas = await productService.getAllSalas();
    res.status(200).json(salas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSalasByPiso = async (req, res) => {
  try {
    const salas = await productService.getSalasByPiso(req.params.id);
    if (salas) {
      res.status(200).json(salas);
    } else {
      res.status(404).json({ message: "Salas no encontradas en registro" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
