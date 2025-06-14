const Sequelize = require("../db");

const { Op } = require("@sequelize/core");
const { ListaSolicitud } = require("../models/lista");
const {
  AfiliadoReservacion,
  Reservacion,
  Habitacion,
  Cama,
} = require("../models/reservaciones");
const { PacienteHuesped, Huesped } = require("../models/huesped");

const { Persona, Ocupacion, Municipio, Lugar } = require("../models/persona");
const Paciente = require("../models/paciente");

const { Hospital } = require("../models/hospital");

const roomService = require("../services/roomService");

// Eliminar cualquier importación duplicada de Municipio
// const Municipio = require("../models/municipio"); // Esta línea debe ser eliminada si ya se importa en persona.js

exports.createReservacion = async (idSolicitud, idCama) => {
  const t = await Sequelize.transaction();

  try {
    console.log(idSolicitud, idCama);

    const solicitud = await ListaSolicitud.findByPk(idSolicitud, {
      include: [
        {
          model: PacienteHuesped,
          include: Paciente,
        },
      ],
    });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    const cama = await Cama.findByPk(idCama);

    if (!cama) {
      throw new Error("Cama no encontrada");
    }

    cama.set({ disponible: false }, { transaction: t });

    console.log(cama);

    await cama
      .save({ transaction: t })
      .then(
        roomService.checkearDisponibilidadHabitacion(cama.id_habitacion, cama)
      );

    console.log("paso checkear disponibilidad");

    const nuevaReservacion = {
      id_paciente_huesped: solicitud.id_paciente_huesped,
      id_cama: idCama,
      id_hospital: solicitud.PacienteHuesped.Paciente.id_hospital,
      fecha_entrada: solicitud.fecha_entrada,
      fecha_salida: solicitud.fecha_salida,
      becado: solicitud.becada,
    };

    const reservacion = await Reservacion.create(nuevaReservacion, {
      transaction: t,
    });

    if (solicitud.id_afiliado) {
      await AfiliadoReservacion.create(
        {
          id_afiliado: solicitud.id_afiliado,
          id_reservacion: reservacion.id_reservacion,
        },
        { transaction: t }
      );
    }

    console.log("paso crear reservacion");

    await solicitud.destroy({ transaction: t });

    console.log("paso destruir solicitud");

    await t.commit();

    return reservacion;
  } catch (error) {
    await t.rollback();

    console.log(error);
    throw new Error("Error al crear reservación: " + error.message);
  }
};

exports.switchCama = async (id, idCama) => {
  const t = await Sequelize.transaction();

  try {
    const reservacion = await Reservacion.findByPk(id);

    const oldCama = await Cama.findByPk(reservacion.id_cama);

    if (!oldCama) {
      throw new Error("Cama no encontrada");
    }

    await oldCama.update({ disponible: true }, { transaction: t });

    if (!reservacion) {
      throw new Error("Reservación no encontrada");
    }

    const newCama = await Cama.findByPk(idCama);

    if (!newCama) {
      throw new Error("Cama no encontrada");
    }

    await newCama.update({ disponible: false }, { transaction: t });

    await reservacion.update({ id_cama: idCama }, { transaction: t });

    await t.commit();

    await roomService.checkearDisponibilidadHabitacion(
      oldCama.id_habitacion,
      oldCama
    );

    await roomService.checkearDisponibilidadHabitacion(
      newCama.id_habitacion,
      newCama
    );

    return reservacion;
  } catch (error) {
    await t.rollback();
    throw new Error("Error al cambiar cama: " + error.message);
  }
};

exports.darAltaServie = async (id) => {
  const t = await Sequelize.transaction();

  try {
    const reservacion = await Reservacion.findByPk(id);

    if (!reservacion) {
      throw new Error("Reservación no encontrada");
    }

    await reservacion.update(
      { fecha_salida: new Date(), activa: false },
      { transaction: t }
    );

    const cama = await Cama.findByPk(reservacion.id_cama);

    if (!cama) {
      throw new Error("Cama no encontrada");
    }

    await cama.update({ disponible: true }, { transaction: t });

    await t.commit();

    await roomService.checkearDisponibilidadHabitacion(
      cama.id_habitacion,
      cama
    );

    return reservacion;
  } catch (error) {
    await t.rollback();
    throw new Error("Error al dar de alta: " + error.message);
  }
};

exports.getReservacionActivaByIdCama = async (idCama) => {
  try {
    return Reservacion.findOne({
      where: { id_cama: idCama, activa: true },
    });
  } catch (error) {
    throw new Error("Error al obtener reservación: " + error.message);
  }
};

exports.getAcompañanteHuesped = async (idReservacion) => {
  const t = await Sequelize.transaction();

  try {
    const resHuesped = await Reservacion.findByPk(
      idReservacion,
      {
        include: [
          {
            model: PacienteHuesped,
            include: Huesped,
          },
        ],
      },
      { transaction: t }
    );

    if (!resHuesped) {
      throw new Error("Reservacion no encontrada");
    }

    const acompanantePaciente = await PacienteHuesped.findOne(
      {
        where: {
          id_paciente: resHuesped.PacienteHuesped.id_paciente,
          id_huesped: {
            [Op.ne]: resHuesped.PacienteHuesped.id_huesped,
          },
        },
      },
      { transaction: t }
    );

    if (!acompanantePaciente) {
      return null;
    }

    const acompanante = await Reservacion.findOne(
      {
        where: {
          id_paciente_huesped: acompanantePaciente.id_paciente_huesped,
          activa: true,
        },
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
      },
      { transaction: t }
    );

    await t.commit();

    return acompanante;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener acompanante", error);
  }
};

exports.getReservacionesActivas = async () => {
  try {
    return Reservacion.findAll({
      where: { activa: true },
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
  } catch (error) {
    throw new Error("Error al obtener reservaciones activas", error);
  }
};