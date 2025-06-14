const ExcelJS = require("exceljs");
const { Persona, Ocupacion, Procedencia, Lugar } = require("../models/persona");
const {
  Huesped,
  PacienteHuesped,
  AfiliadoHuesped,
} = require("../models/huesped");
const sequelize = require("../db");
const Paciente = require("../models/paciente");


exports.getDataForExcel = async () => {
  try {
    const data = await sequelize.query("select * from data_excel order by fecha_entrada desc");

    return data;
  } catch (error) {
    console.error("Error fetching excel:", error);
    throw error;
  }
};

exports.getGuestInfoAndDonations = async (idHuesped) => {
  try {
    console.log("Consultando información del huésped y sus ofrendas para el ID:", idHuesped);

    const [guestInfo] = await sequelize.query(
      `SELECT p.primer_nombre, p.segundo_nombre, p.primer_apellido, p.segundo_apellido
       FROM persona p
       JOIN huesped h ON p.id_persona = h.id_persona
       JOIN paciente_huesped ph ON h.id_huesped = ph.id_huesped
       JOIN reservacion ON ph.id_paciente_huesped = reservacion.id_paciente_huesped
       WHERE reservacion.id_reservacion = :idHuesped
       LIMIT 1;`,
      {
        replacements: { idHuesped },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!guestInfo) {
      throw new Error(`No se encontró información para el huésped con ID: ${idHuesped}`);
    }

    const donations = await sequelize.query(
      `SELECT o.valor AS cantidad, o.fecha, o.recibo, o.observacion
       FROM ofrenda o
       JOIN reservacion r ON o.id_reservacion = r.id_reservacion
       WHERE r.id_reservacion = :idHuesped
       ORDER BY o.fecha DESC`,
      {
        replacements: { idHuesped },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log("Información del huésped y ofrendas obtenidas correctamente.");
    return { guestInfo, donations };
  } catch (error) {
    console.error("Error al obtener información del huésped y sus ofrendas:", error);
    throw error;
  }
};
