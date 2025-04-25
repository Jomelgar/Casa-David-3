const sequelize = require("../Db");
const { Huesped, PacienteHuesped } = require("../models/huesped");
const { Persona } = require("../models/persona");
const { Reservacion, Cama, Habitacion } = require("../models/reservaciones");

exports.getAllHuespedes = async () => {
  const huespedes = await Huesped.findAll({ include: "Persona" });
  return huespedes;
};

exports.getHuespedById = async (id) => {
  const huesped = await Huesped.findByPk(id);
  return huesped;
};
exports.getAllHuespedesName = async () => {
  const huespedes = await Huesped.findAll({
    include: [
      {
        model: Reservacion,
        attributes: ["fecha_entrada", "fecha_salida"],
        include: [
          {
            model: Cama,
            attributes: ["nomre"],
            include: [
              {
                model: Habitacion,
                attributes: ["nombre"],
              },
            ],
          },
        ],
      },
      {
        model: Persona,
        attributes: ["primer_nombre", "primer_apellido"],
      },
    ],
  });
  return huespedes;
};

exports.crearHuesped = async (huespedData) => {
  const nuevoHuesped = await Huesped.create(huespedData);
  return nuevoHuesped;
};


exports.deleteHuespedById = async (id) => {
  const borrar = await Huesped.destroy({
    where: {
      id_huesped: id,
    },
  });
  return borrar;
};

exports.getHuespedByDNI = async (dni) => {
  const probar = await sequelize.transaction();
  console.log(dni);
  try {
    const persona = await Persona.findOne({
      where: { dni: dni },
      probar
    });
    console.log(persona);

    if (!persona) {
      throw new Error('No se encontró ninguna persona con el DNI proporcionado.');
    }
    const huesped = await Huesped.findOne({
      where: { id_persona: persona.id_persona },
      probar
    });

    console.log(huesped);
    if (!huesped) {
      throw new Error('No se encontró ningún huésped asociado con la persona proporcionada.');
    }

    await probar.commit();
    return huesped;
  } catch (error) {
    await probar.rollback();
    throw new Error('Error al obtener el huésped: ' + error.message);
  }
};

exports.editarHuesped = async (id, huespedUpdate) => {
  const huespedEditado = await Huesped.update(huespedUpdate, {
    where: { id_huesped: id },
  });

  if (huespedEditado) {
    const edited = await Huesped.findOne({
      where: { id_huesped: id },
    });
    return edited;
  }
};

exports.getHuesped = async(id) => {
  const huesped = await Reservacion.findAll({
    required: true,
    include: [{
      model: PacienteHuesped ,  
      required: true,
        include: [{
          model: Huesped ,  
          required: true,
          include: [Persona],
          where: {
            id_persona: id,
          }
        }]
    }]
  });
  return huesped;
}
exports.getMujeres = async () => {
  const mujeres = await Huesped.count({
    include: [
      {
        model: Persona,
        as: 'Persona',
        where: {
          genero: "FEMENINO"
        }
      }
    ]
  });
  return mujeres;
}

exports.getHombre = async () => {
  const hombres = await Huesped.count({
    include: [
      {
        model: Persona,
        as: 'Persona',
        where: {
          genero: "MASCULINO"
        }
      }
    ]
  });
  return hombres;
}