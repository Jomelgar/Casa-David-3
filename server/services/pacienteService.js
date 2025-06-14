
const Paciente = require('../models/paciente');
const { PacienteHuesped, Huesped } = require("../models/huesped");
const CausaVisita    = require('../models/causaVisita');
const { Persona, Ocupacion, Municipio,Lugar } = require('../models/persona');
const { Departamento } = require('../models/departamento');
const { Hospital }    = require('../models/hospital');
const { Pais } = require('../models/pais');
const { Reservacion } = require('../models/reservaciones');
const { Sequelize } = require("../db");

exports.getAllPacientes = async (fechaInicio,fechaFinal) => {
  const pacientes = await Reservacion.findAndCountAll({
      where: {
        fecha_entrada: {
          [Sequelize.Op.gte]: fechaInicio,
        },
        fecha_salida: {
          [Sequelize.Op.lte]: fechaFinal,
        },
      },
      include: [
        {
          model: PacienteHuesped,
          required: true,
          include: [
            {
              model: Paciente,
              required: true,
              include: [
                {
                  model: Hospital
                },
                {
                  model: Persona,
                  required: true,
                  include:
                  [
                    {model: Municipio,
                      required: true,
                      include:
                      [{
                        model: Departamento,
                        required: true,
                      }]
                    },
                    {
                      model: Lugar,
                      required: true,
                      include: [
                        {
                          model: Pais,
                          required: true,
                        }
                      ]
                    }
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  console.log(pacientes);
  return pacientes;
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
  const tx = await Sequelize.transaction();
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