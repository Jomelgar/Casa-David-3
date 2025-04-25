const { ListaSolicitud } = require("../models/lista");
const { Persona, Ocupacion, Procedencia, Lugar } = require("../models/persona");
const {
  Huesped,
  PacienteHuesped,
  AfiliadoHuesped,
} = require("../models/huesped");
const sequelize = require("../Db");
const Paciente = require("../models/paciente");
const { Hospital } = require("../models/hospital");
const { Patrono, PatronoAfiliado, Afiliado } = require("../models/afiliado");
const Municipio = require("../models/municipio")
const { Reservacion } = require("../models/reservaciones")
const { Usuario } = require("../models/usuario")
const handlePersona = async (personaData) => {
  const persona = await Persona.findOne({
    where: { dni: personaData.dni },
  });

  if (persona) {
    // Existe esa persona en la base de datos
    // Tons lo que vamos hacer es actualizarla

    await persona.update(personaData);

    return persona;
  }

  return await Persona.create(personaData);
};

const handleHuesped = async (personaHuesped) => {
  const huesped = await Huesped.findOne({
    where: { id_persona: personaHuesped.id_persona },
  });

  if (huesped) {
    // Existe esa persona en la base de datos
    // Tons lo que vamos hacer es actualizarla

    await huesped.update({ activo: true, reingreso: true });

    return huesped;
  }

  return await Huesped.create({
    id_persona: personaHuesped.id_persona,
    activo: true,
    reingreso: false,
  });
};

const handlePatrono = async (patronoData) => {
  const patrono = await Patrono.findOne({
    where: { id_patrono: patronoData.id_patrono },
  });

  if (patrono) return patrono;

  throw new Error("No existe el patrono");
};

const handleAfiliado = async (afiliadoData) => {
  const afiliado = await Afiliado.findOne({
    where: { dni: afiliadoData.dni },
  });

  if (afiliado) {
    // Existe esa persona en la base de datos
    // Tons lo que vamos hacer es actualizarla

    await afiliado.update({
      nombre: afiliadoData.nombre,
      condicion: afiliadoData.condicion,
    });

    return afiliado;
  } else {
    return await Afiliado.create(afiliadoData);
  }
};

const handlePatronoAfiliado = async (patronoAfiliadoData) => {
  const patronoAfiliado = await PatronoAfiliado.findOne({
    where: {
      id_patrono: patronoAfiliadoData.id_patrono,
      id_afiliado: patronoAfiliadoData.id_afiliado,
    },
  });

  if (patronoAfiliado) return patronoAfiliado;

  return await PatronoAfiliado.create(patronoAfiliadoData);
};

const handleAfiliadoHuesped = async (afiliadoHuespedData) => {
  const afiliadoHuesped = await AfiliadoHuesped.findOne({
    where: {
      id_afiliado: afiliadoHuespedData.id_afiliado,
      id_huesped: afiliadoHuespedData.id_huesped,
    },
  });

  if (afiliadoHuesped) return afiliadoHuesped;

  return await AfiliadoHuesped.create(afiliadoHuespedData);
};

const handleAddAfiliadoHuesped = async (
  patronoData,
  idAcompanante,
  idHuesped
) => {
  const patrono = await handlePatrono(patronoData);
  const afiliado = await handleAfiliado({
    dni: patronoData.dni_afiliado,
    nombre: patronoData.nombre_afiliado,
  });

  const patronoAfiliado = await handlePatronoAfiliado({
    id_patrono: patrono.id_patrono,
    id_afiliado: afiliado.id_afiliado,
  });

  return afiliado;
};

exports.crearListaSolicitud = async (data) => {
  console.log(data);
  const {
    huespedData,
    pacienteData,
    acompananteData,
    solicitudData,
    patronoData,
    userId,
  } = data;

  const probar = await sequelize.transaction();
  try {

    //  Obtener permisos del usuario que registra.

    const user = await Usuario.findOne({
      where: {
        id_usuario: userId
      }
    })

    // Huespedes nuevos son aquellos huespedes que no son el paciente

    const huespedesNuevos = (acompananteData)
      ?
      (acompananteData.dni === pacienteData.dni) ? 1 : 2
      : 1;

    // Antes de empezar a crear personas, chequear que ese paciente solo 
    // tenga 2 personas diferentes en solicitudes y/o reservaciones activas.

    // Es decir, puede existir 2 solicitudes hacia el mismo paciente dado el caso que el paciente
    // sea un acompañante (una solicitud donde el paciente es tambien acompañante y una solicitud sin acompañante extra). 
    // Pero no puede existir 2 o más personas para el mismo paciente.

    // NOTA: Obviamos el caso del que el acompañante/huesped ya exista para ese paciente ya que eso se revisa antes de enviar la solicitud.

    // 1. Obtener las solicitudes activas para el paciente.

    const solicitudesActivas = await ListaSolicitud.findAll({
      include: [
        {
          model: PacienteHuesped,
          include: [
            {
              model: Paciente,
            },
            {
              model: Huesped,
            }
          ]
        },
      ]
    });

    console.log("Solicitudes Activas: ", solicitudesActivas);
    console.log("Rol Usuario: ", user.rol)
    // Encontrar el id_persona del paciente
    const pacienteAsPersona = await Persona.findAll({
      where: {
        dni: pacienteData.dni
      }
    })

    // Si no tengo esa persona registrada, entonces no hay necesidad de chequear
    // Tampoco hay necesidad de chequear si el user que quiere registrar es administrador
    if (pacienteAsPersona.length > 0 && user.rol !== "admin") {
      const pacienteAsPersonaId = pacienteAsPersona[0].id_persona;

      const pacienteInDb = await Paciente.findOne({
        where: {
          id_person: pacienteAsPersonaId,
          id_sala: pacienteData.id_sala,
          id_causa_visita: pacienteData.id_causa_visita
        }
      })

      // Si el paciente como tal no existe, significa que es primera vez que registro esta persona como paciente.
      // por ende, no es necesario chequear si tiene más de 2 personas diferentes en solicitudes/reservaciones activas
      if (pacienteInDb) {

        let personasDiferentes = 0;
        for (const solicitud of solicitudesActivas) {

          // Contar aquellas reservaciones donde esté nuestro paciente
          if (solicitud.PacienteHuesped.Paciente.id_person !== pacienteAsPersonaId) {
            console.log("Hay una solicitud que no pertenece al paciente")
            console.log("id_persona del paciente en la soli", solicitud.PacienteHuesped.Paciente.id_person)
            console.log("id_persona del paciente", pacienteAsPersonaId)
            console.log(solicitud)
            continue
          }

          // Si el huesped es diferente del paciente entonces sumar 1
          // Obtener persona id del huesped

          if (solicitud.PacienteHuesped.Huesped.id_persona !== pacienteAsPersonaId) personasDiferentes++;
        }

        const reservacionesActivas = await Reservacion.findAll({
          where: {
            activa: true,
          },
          include: [
            {
              model: PacienteHuesped,
              include: [
                {
                  model: Huesped,
                },
                {
                  model: Paciente,
                }
              ]
            }
          ]
        })

        for (const reservacion of reservacionesActivas) {

          // Contar aquellas reservaciones donde este nuestro paciente
          if (reservacion.PacienteHuesped.Paciente.id_person !== pacienteAsPersonaId) {
            console.log("Hay una reservacion que no pertenece al paciente")
            continue
          }

          // Si el huesped es diferente del paciente entonces sumar 1
          if (reservacion.PacienteHuesped.Huesped.id_persona !== pacienteAsPersonaId) personasDiferentes++;
        }

        const nuevoPersonaTotal = personasDiferentes + huespedesNuevos;
        if (nuevoPersonaTotal > 2) {
          console.log("Personas diferentes: ", personasDiferentes)
          console.log("Nuevo Persona Total", nuevoPersonaTotal)
          console.log("El paciente tiene más de 2 personas diferentes en solicitudes/reservaciones activas")
          throw new Error("people_max_reached") // leer el catch mas abajo del porque de este error
        }
        console.log("Personas diferentes: ", personasDiferentes)
      } else console.log("[crearListaSolicitud] Paciente no existe en la base de datos")

    }

    const personaHuesped = await handlePersona(huespedData);

    const personaPaciente = await handlePersona(pacienteData);

    const huesped = await handleHuesped(personaHuesped);

    const paciente = await Paciente.create(
      {
        id_person: personaPaciente.id_persona,
        ...pacienteData,
      },
      { transaction: probar }
    );

    const pacienteHuesped = await PacienteHuesped.create(
      {
        id_paciente: paciente.id_paciente,
        id_huesped: huesped.id_huesped,
        parentesco_paciente: pacienteData.parentesco,
      },
      { transaction: probar }
    );
    if (acompananteData) {
      const personaAcompanante = await handlePersona(acompananteData);
      const huespedAcompanante = await handleHuesped(personaAcompanante);

      const pacienteAcompanante = await PacienteHuesped.create(
        {
          id_paciente: paciente.id_paciente,
          id_huesped: huespedAcompanante.id_huesped,
          parentesco_paciente: pacienteData.parentesco,
        },
        { transaction: probar }
      );

      if (patronoData) {
        const afiliado = await handleAddAfiliadoHuesped(
          patronoData,
          huespedAcompanante.id_huesped,
          huesped.id_huesped
        );

        const soli = await ListaSolicitud.create(
          {
            id_paciente_huesped: pacienteAcompanante.id_paciente_huesped,
            id_afiliado: afiliado.id_afiliado,
            ...solicitudData,
          },
          { transaction: probar }
        );
      } else {
        const solicitud = await ListaSolicitud.create(
          {
            id_paciente_huesped: pacienteAcompanante.id_paciente_huesped,
            ...solicitudData,
          },
          { transaction: probar }
        );
      }
    } else {
      if (patronoData) {
        const afiliado = await handleAddAfiliadoHuesped(
          patronoData,
          null,
          huesped.id_huesped
        );

        const soli = await ListaSolicitud.create(
          {
            id_paciente_huesped: pacienteHuesped.id_paciente_huesped,
            id_afiliado: afiliado.id_afiliado,
            ...solicitudData,
          },
          { transaction: probar }
        );

        await probar.commit();
        return soli;
      }
    }

    const solicitud = await ListaSolicitud.create(
      {
        id_paciente_huesped: pacienteHuesped.id_paciente_huesped,
        ...solicitudData,
      },
      { transaction: probar }
    );
    await probar.commit();

    return solicitud;
  } catch (error) {
    console.log("[crearSolicitud] Error: ", error)
    await probar.rollback();

    // Se hace de esta manera para que el controller retorne un http 401 y el frontend muestre un error acorde
    if (error.message === "people_max_reached") throw new Error("people_max_reached")
    else throw new Error("Error al crear usuario y persona: " + error.message);
  }
};

exports.getSolicitudes = async () => {
  try {
    const solicitudes = await ListaSolicitud.findAll({
      include: {
        model: PacienteHuesped,
        attributes: ["id_paciente_huesped"],
        include: [
          {
            model: Huesped,
            include: {
              model: Persona,
              include: [
                { model: Ocupacion },
                { model: Municipio },
                { model: Lugar },
              ],
            },
          },
          {
            model: Paciente,
            include: [
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Municipio },
                  { model: Lugar },
                ],
              },
              {
                model: Hospital,
              },
            ],
          },
        ],
      },
    });
    return solicitudes;
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    throw error;
  }
};

exports.getAllListaSolicitud = async () => {
  const esperas = await ListaSolicitud.findAll();
  return esperas;
};

exports.getSolicitud = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const espera = await ListaSolicitud.findOne({
    where: { id_lista_solicitud: id },
    include: {
      model: PacienteHuesped,
      attributes: ["id_paciente_huesped"],
      include: [
        {
          model: Huesped,
          include: {
            model: Persona,
            include: [
              { model: Ocupacion },
              { model: Municipio },
              { model: Lugar },
            ],
          },
        },
        {
          model: Paciente,
          include: [
            {
              model: Persona,
              include: [
                { model: Ocupacion },
                { model: Municipio },
                { model: Lugar },
              ],
            },
            {
              model: Hospital,
            },
          ],
        },
      ],
    },
  });

  return espera;
};

exports.editarListaSolicitud = async (req) => {
  const { id } = req.params;
  const { id_persona, observacion } = req.body;
  const unaEspera = await ListaSolicitud.findByPk(id);
  unaEspera.id_persona = id_persona;
  unaEspera.observacion = observacion;
  await unaEspera.save();
  return unaEspera;
};

exports.eliminarSolicitud = async (req, res) => {
  const { id } = req.params;
  await ListaSolicitud.destroy({
    where: {
      id_lista_solicitud: id,
    },
  });
};
