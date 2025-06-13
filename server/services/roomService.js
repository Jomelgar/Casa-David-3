const { PacienteHuesped, Huesped } = require("../models/huesped");
const { Persona, Ocupacion, Municipio, Lugar } = require("../models/persona");
const Paciente = require("../models/paciente");
const { Hospital } = require("../models/hospital");
const {
  Habitacion,
  Cama,
  Reservacion,
  AfiliadoReservacion,
  Ofrenda,
} = require("../models/reservaciones");
const { Sequelize } = require("../Db");

const { Afiliado, Patrono, PatronoAfiliado } = require("../models/afiliado");
const { where } = require("sequelize");
const { Pais } = require("../models/pais");
const {Departamento} = require("../models/departamento");
//const Municipio = require("../models/municipio");

exports.createHabitacion = async (habitacionData) => {
  const habitacion = await Habitacion.create(habitacionData);
  return habitacion;
};

exports.getHabitacionById = async (id) => {
  const habitacion = await Habitacion.findByPk(id);
  return habitacion;
};

exports.getAllHabitaciones = async () => {
  try {
    const habitaciones = await Habitacion.findAll();
    return habitaciones;
  } catch (error) {
    throw Error("Error al obtener las habitaciones: " + error.message);
  }
};

exports.getHabitacionesPorLugar = async (id_lugar) => {
  const habitacion = await Habitacion.findAll({
    where: {
      id_lugar: id_lugar,
    },
  });
  return habitacion;
};

exports.checkearDisponibilidadHabitacion = async (id, newCama) => {
  try {
    const camas = await Cama.findAll({
      where: { id_habitacion: id },
    });

    console.log(camas);
    let camasDisponibles = false;
    camas.forEach((cama) => {
      if (cama.id_cama === newCama.id_cama) {
        if (newCama.disponible) {
          camasDisponibles = true;
          return;
        }
      } else {
        if (cama.disponible) {
          camasDisponibles = true;
          return;
        }
      }
    });

    const habitacion = await Habitacion.findByPk(id);
    await habitacion.update({ disponible: camasDisponibles });
  } catch (error) {
    console.log(error);

    throw new Error(
      "Error al verificar disponibilidad de la habitación: " + error.message
    );
  }
};

exports.deleteHabitacionById = async (id) => {
  const borrar = await Habitacion.destroy({
    where: {
      id_habitacion: id,
    },
  });
  return borrar;
};

exports.editHabitacion = async (id, habitacionData) => {
  await Habitacion.update(habitacionData, { where: { id_habitacion: id } });
};

exports.getAllCamas = async () => {
  const camas = await Cama.findAll({ include: "Habitacion" });
  return camas;
};

exports.getCamasByRoom = async (habitacionId) => {
  try {
    const camas = await Cama.findAll({
      where: { id_habitacion: habitacionId },
    });
    return camas;
  } catch (error) {
    throw new Error(
      "Error al obtener las camas de la habitación: " + error.message
    );
  }
};

exports.getCamasByDisponible = async () => {
  try {
    const camas = await Cama.findAll({
      where: { disponible: true },
      include: Habitacion,
    });
    return camas;
  } catch (error) {
    throw new Error("Error al obtener las camas disponibles: " + error.message);
  }
};
exports.deleteCamaById = async (id) => {
  const borrar = await Cama.destroy({
    where: {
      id_cama: id,
    },
  });
  return borrar;
};

exports.createCama = async (camaData) => {
  const cama = await Cama.create(camaData);
  console.log(cama.dataValues);
  const habitacion = await Habitacion.findByPk(cama.dataValues.id_habitacion);
  await habitacion.update({ disponible: true });
  return cama;
};

exports.getCamaById = async (id) => {
  const cama = await Cama.findByPk(id, { include: Habitacion });
  return cama;
};

exports.getCamas = async () => {
  const camas = await Cama.findAll({ include: Habitacion });
  return camas;
};

exports.editCama = async (id, camaData) => {
  await Cama.update(camaData, { where: { id_cama: id } });
};

exports.getCamaByGender = async (genero) => {
  if (genero != "MASCULINO" && genero != "FEMENINO") {
    return null;
  }
  //FinaAndCountAll te devuelve un objeto que cuenta el total de filas y te devuelve los objetos tambien.
  const Camas = await Cama.findAndCountAll({
    include: {
      model: Habitacion,
      where: { genero: genero },
    },
  });

  //En el JSON se devuelven como rows and count. Rows son los objetos y count el numero
  //Para el componente, usare count.
  return Camas;
};

exports.createReservacion = async (reservacionData) => {
  const reservacion = await Reservacion.create(reservacionData);
  return reservacion;
};

exports.getReservacionById = async (id) => {
  const reservacion = await Reservacion.findByPk(id, {
    include: [
      {
        required: false,
        model: AfiliadoReservacion,
        include: {
          model: Afiliado,
          include: {
            model: PatronoAfiliado,
            include: { model: Patrono },
          },
        },
        where: { id_reservacion: id },
      },
      { model: Cama, include: Habitacion },
      {
        model: PacienteHuesped,
        include: [
          {
            model: Huesped,
            include: [
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Municipio},
                  { model: Lugar },
                ],
              },
            ],
          },
          {
            model: Paciente,
            include: [
              {
                model: Hospital,
              },
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Municipio },
                  { model: Lugar },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  return reservacion;
};

exports.getReservacionByIdHuespedActiva = async (id) => {
  const reservacion = await Reservacion.findOne({
    where: { id_huesped: id, activa: true },
  });
  return reservacion;
};

exports.getBecados = async (fechaInicio, fechaFinal) => {
  try {
    const becados = await Ofrenda.findAll({
      where: {
        fecha: {
          [Sequelize.Op.gte]: fechaInicio,
          [Sequelize.Op.lte]: fechaFinal,
        },
      },
      include: [
        {
          model: Reservacion,
          where: {
            becado: true,
          },
          include: [
            {
              model: PacienteHuesped,
              include: [
                {
                  model: Huesped,
                  include: Persona,
                },
              ],
            },
            {
              model: AfiliadoReservacion,
              include: {
                model: Afiliado,
                include: {
                  model: PatronoAfiliado,
                  include: { model: Patrono },
                },
              },
            },
            {
              model: Cama,
              include: Habitacion,
            },
          ],
        },
        {
          model:Pais
        }
      ],
    });

    return becados;
  } catch (error) {
    console.log(error);
  }
};

exports.getDonaciones = async (fechaInicio, fechaFinal) => {
try {
    const donaciones = await Ofrenda.findAll({
      where: {
        fecha: {
          [Sequelize.Op.gte]: fechaInicio,
          [Sequelize.Op.lte]: fechaFinal,
        },
      },
      include: [
        {
          model: Reservacion,
          where: {
            becado: false,
          },
          include: [
            {
              model: PacienteHuesped,
              include: [
                {
                  model: Huesped,
                  include: Persona,
                },
              ],
            },
            {
              model: AfiliadoReservacion,
              include: {
                model: Afiliado,
                include: {
                  model: PatronoAfiliado,
                  include: { model: Patrono },
                },
              },
            },
            {
              model: Cama,
              include: Habitacion,
            },
          ],
        },
        {
              model: Pais
        }
      ],
    });

    return donaciones;
  } catch (error) {
    console.log(error);
  }
};

exports.getHombres = async (fechaInicio, fechaFinal) => {
  const men = await Reservacion.findAndCountAll({
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
            model: Huesped,
            required: true,
            include: [
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
                  }
                ],
                where: {
                  genero: "MASCULINO",
                },
              },
            ],
          },
        ],
      },
      {
        model: AfiliadoReservacion,
        include: {
          model: Afiliado,
          include: {
            model: PatronoAfiliado,
            include: { model: Patrono },
          },
        },
      },
    ],
  });
  return men;
};

exports.getMujeres = async (fechaInicio, fechaFinal) => {
  console.log(fechaInicio, fechaFinal)
  const women = await Reservacion.findAndCountAll({
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
            model: Huesped,
            required: true,
            include: [
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
                  }
                ],
                where: {
                  genero: "FEMENINO",
                },
              },
            ],
          },
        ],
      },
      {
        model: AfiliadoReservacion,
        include: {
          model: Afiliado,
          include: {
            model: PatronoAfiliado,
            include: { model: Patrono },
          },
        },
      },
    ],
  });
  return women;
};

exports.editReservacion = async (id, reservacionData) => {
  await Reservacion.update(reservacionData, { where: { id_reservacion: id } });
};

exports.getReservacion = async () => {
  const reservacion = await Reservacion.findAll({
    include: [
      { model: Cama, include: Habitacion },
      {
        model: PacienteHuesped,
        include: [
          {
            model: Huesped,
            include: [
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Municipio },
                  { model: Lugar },
                ],
              },
            ],
          },
          {
            model: Paciente,
            include: [
              {
                model: Hospital,
              },
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Municipio },
                  { model: Lugar },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  return reservacion;
};

exports.getCamasHuesped = async (id) => {
  try {
    const reservacion = await Cama.findAll({
      where: {
        id_habitacion: id,
      },
      include: [
        {
          model: Reservacion,
          required: false,
          where: {
            activa: true,
          },
          include: [
            {
              model: PacienteHuesped,
              include: [
                {
                  model: Huesped,
                  include: [Persona],
                },
              ],
            },
          ],
        },
      ],
    });
    return reservacion;
  } catch (error) {
    throw Error("Error al obtener las reserevaciones: " + error.message);
  }
};
