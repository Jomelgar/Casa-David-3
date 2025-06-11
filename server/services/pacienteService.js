const sequelize = require('../Db');
const Paciente       = require('../models/paciente');
const CausaVisita    = require('../models/causaVisita');
const { Persona, Ocupacion, Municipio } = require('../models/persona');
const { Departamento } = require('../models/departamento');
const { Hospital }    = require('../models/hospital');
const { Pais } = require('../models/pais');
const { Reservacion } = require('../models/reservaciones');

exports.getAllPacientes = async () => {
  const causasRaw = await CausaVisita.findAll({
    attributes: ['id_causa_visita', 'causa'],
    raw: true
  });
  const causaMap = Object.fromEntries(
    causasRaw.map(c => [c.id_causa_visita, c.causa])
  );

  const pacientes = await Paciente.findAll({
    attributes: ['id_paciente', 'id_causa_visita'],
    include: [
      {
        model: Persona,
        attributes: [
          'primer_nombre',
          'segundo_nombre',
          'primer_apellido',
          'segundo_apellido',
          'genero',
          'fecha_nacimiento'
        ],
        include: [
          {
            model: Municipio,
            attributes: ['nombre'],
            include: [{ model: Departamento, attributes: ['nombre'] }]
          },
          { model: Ocupacion, attributes: ['descripcion'] },
        ]
      },
      { model: Hospital, attributes: ['nombre', 'id_pais'],
        include: [{ model: Pais, attributes: ['nombre'] }]
      }
    ],
    order: [['id_paciente', 'ASC']]
  });

  return pacientes.map(pac => {
    const p = pac.Persona;
    const nombre = [
      p.primer_nombre,
      p.segundo_nombre,
      p.primer_apellido,
      p.segundo_apellido
    ].filter(Boolean).join(' ');
    const edad = Math.floor(
      (Date.now() - new Date(p.fecha_nacimiento)) /
      (1000 * 60 * 60 * 24 * 365.25)
    );
    return {
      id: pac.id_paciente,
      nombre,
      id_pais: pac.Hospital.id_pais,
      pais: pac.Hospital.Pai.nombre,
      departamento: p.Municipio.Departamento.nombre,
      municipio: p.Municipio.nombre,
      ocupacion: p.Ocupacion.descripcion,
      genero: p.genero,
      hospital: pac.Hospital?.nombre ?? null,
      causa: causaMap[pac.id_causa_visita] ?? null,
      edad,
    };
  });
};



exports.getPacienteById = async id => {
  return Paciente.findByPk(id);
};

exports.createPaciente = async pacienteData => {
  return Paciente.create(pacienteData);
};

exports.deletePacienteById = async id => {
  return Paciente.destroy({ where: { id_paciente: id } });
};

exports.editarPaciente = async (id, pacienteUpdate) => {
  await Paciente.update(pacienteUpdate, { where: { id_paciente: id } });
  return Paciente.findOne({ where: { id_paciente: id } });
};

exports.getPacienteByDNI = async dni => {
  const tx = await sequelize.transaction();
  try {
    const persona  = await Persona.findOne({ where: { dni }, transaction: tx });
    if (!persona) throw new Error('No se encontró persona con ese DNI');

    const paciente = await Paciente.findOne({
      where: { id_person: persona.id_persona },
      transaction: tx
    });
    if (!paciente) throw new Error('No se encontró paciente para esa persona');

    await tx.commit();
    return paciente;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
};