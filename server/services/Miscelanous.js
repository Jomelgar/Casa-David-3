const { ListaEspera } = require('../models/lista');
const Paciente = require('../models/paciente');
const { Persona } = require('../models/persona');
const sequelize = require('../db');

async function getPersonsInListaEsperaService() {
  return await ListaEspera.findAll({
    include: [
      {
        model: Persona,
        attributes: ['primer_nombre', 'primer_apellido', 'telefono', 'genero'],
        include: [
          {
            model: Paciente,
            attributes: ['causa_visita']
          }
        ]
      }
    ],
    attributes: ['id_lista_espera', 'fecha_entrada', 'id_persona']
  });
}

const getReservaciones = async (startDate, endDate, id_lugar) => {
  const query = `
    SELECT 
      CONCAT(p.primer_nombre, ' ', p.primer_apellido) AS nombre,
      CONCAT(hab.nombre, ' - ', c.nomre) AS se_hospeda,
      r.fecha_salida
    FROM 
      reservacion r
    JOIN 
      paciente_huesped ph ON r.id_paciente_huesped = ph.id_paciente_huesped
    JOIN 
      huesped h ON ph.id_huesped = h.id_huesped
    JOIN 
      persona p ON h.id_persona = p.id_persona
    JOIN 
      cama c ON r.id_cama = c.id_cama
    JOIN 
      habitacion hab ON c.id_habitacion = hab.id_habitacion
    JOIN
      lugar l ON hab.id_lugar = l.id_lugar
    WHERE 
      r.fecha_salida BETWEEN :startDate AND :endDate
      AND r.activa = true
      AND hab.id_lugar = :id_lugar
    ORDER BY
      r.fecha_salida ASC;  
  `;
  const replacements = { startDate, endDate , id_lugar};
  const [results] = await sequelize.query(query, { replacements });
  return results;
};
const countActiveHuespedes = async (id_lugar) => {
  const query = `
    SELECT COUNT(*) AS activeHuespedesCount
    FROM reservacion r
    JOIN cama c ON r.id_cama = c.id_cama
    JOIN habitacion h ON c.id_habitacion = h.id_habitacion
    WHERE r.activa = true AND h.id_lugar = :id_lugar;
  `;
  const [results] = await sequelize.query(query, {
    replacements: { id_lugar }
  });
  return results[0].activehuespedescount;
};

const countPersonasBeneficiadas = async (id_lugar) => {
  const query = `
    SELECT COUNT(*) AS personasBeneficiadasCount
    FROM reservacion r
    INNER JOIN cama c ON r.id_cama = c.id_cama
    INNER JOIN habitacion h ON c.id_habitacion = h.id_habitacion
    WHERE h.id_lugar = :id_lugar;
  `;
  const [results] = await sequelize.query(query, {
    replacements: { id_lugar }
  });
  return results[0].personasbeneficiadascount;
};
const countCamasDisponibles = async (id_lugar) => {
  const query = `
    SELECT COUNT(*) AS camasDisponiblesCount
    FROM cama c
    INNER JOIN habitacion h ON c.id_habitacion = h.id_habitacion
    WHERE c.disponible = true AND h.id_lugar = :id_lugar;
  `;
  const [results] = await sequelize.query(query, {
    replacements: { id_lugar }
  });
  return results[0].camasdisponiblescount;
};

const countNumeroCamas = async (id_lugar) => {
  const query = `
    SELECT COUNT(*) AS numeroCamasCount
    FROM cama c
    INNER JOIN habitacion h ON c.id_habitacion = h.id_habitacion
    WHERE h.id_lugar = :id_lugar;
  `;
  const [results] = await sequelize.query(query, {
    replacements: { id_lugar }
  });
  return results[0].numerocamascount;
};

const getTop3ClosestFechaSalida = async (id) => {
  const query = `
    SELECT 
      CONCAT(p.primer_nombre, ' ', p.primer_apellido) AS nombre,
      r.fecha_salida
    FROM 
      reservacion r
    JOIN 
      paciente_huesped ph ON r.id_paciente_huesped = ph.id_paciente_huesped
    JOIN 
      huesped h ON ph.id_huesped = h.id_huesped
    JOIN 
      persona p ON h.id_persona = p.id_persona
    WHERE 
      r.activa = true AND p.id_lugar = :ID
    ORDER BY 
      r.fecha_salida ASC
    LIMIT 3;
  `;
  const [results] = await sequelize.query(query,{replacements: {ID: id}});
  return results;
};


const countDepartamentosRegistrados = async (id_pais) => {
  const query = `SELECT COUNT(DISTINCT TRIM(LOWER(d.nombre))) AS 
  total_departamentos_registrados 
  FROM 
  huesped JOIN persona ON persona.id_persona = huesped.id_persona 
  JOIN municipio ON municipio.municipio_id = persona.municipio_id JOIN 
  departamento d ON d.departamento_id = municipio.departamento_id 
  WHERE huesped.activo = true AND d.id_pais = :id_pais;`
  const [results] = await sequelize.query(query, {replacements: { id_pais },});
  return results[0].total_departamentos_registrados;
};



module.exports = {
  getPersonsInListaEsperaService,
  getReservaciones,
  countActiveHuespedes,
  countPersonasBeneficiadas,
  countCamasDisponibles,
  countNumeroCamas,
  getTop3ClosestFechaSalida,
  countDepartamentosRegistrados
};


