const sequelize = require('../Db');
const { Pais } = require('../models/pais'); // Asegúrate de tener el modelo de Pais definido
const { Persona, Lugar } = require('../models/persona');

exports.getAllPersonas = async () => {
    const people = await Persona.findAll();
    return people;
};

exports.getPersonaById = async (id) => {
    const person = await Persona.findByPk(id);
    return person;
};

exports.createPersona = async (personaData) => {
    const nuevaPer = await Persona.create(personaData);
    return nuevaPer;
};

exports.deletePersonaById = async (id) => {
    const borrar = await Persona.destroy({
        where: {
            id_persona: id
        }
    });
    return borrar;
};

exports.editarPersona = async (id, personaUpdate) => {

    if (personaUpdate.observacion === "") personaUpdate.observacion = null;

    const personaEditada = await Persona.update(personaUpdate, {
        where: { id_persona: id }
    });

    if (personaEditada) {
        const edited = await Persona.findOne({
            where: { id_persona: id }
        });
        return edited;
    }
};

exports.getPersonaByDni = async (dni) => {
    const person = await Persona.findOne({
        where: { dni: dni }
    });
    return person;
}
exports.getEvangelizacionById = async (id) => {
    const persona = await Persona.findByPk(id);
    return persona ? {
        compartio_evangelio: persona.compartio_evangelio,
        acepto_a_cristo: persona.acepto_a_cristo,
        reconcilio: persona.reconcilio,
    } : null;
};

exports.updateEvangelizacionById = async (id, data) => {
    const persona = await Persona.findByPk(id);
    if (persona) {
        persona.compartio_evangelio = data.compartio_evangelio || persona.compartio_evangelio;
        persona.acepto_a_cristo = data.acepto_a_cristo || persona.acepto_a_cristo;
        persona.reconcilio = data.reconcilio || persona.reconcilio;
        await persona.save();
        return persona;
    }
    return null;
}

exports.getObservacion = async (id) => {
    const person = await Persona.findByPk(id)
    if (!person) throw new Error("Person not found");

    return person.get("observacion");
}

exports.setObservacion = async (id, observacion) => {
    const person = await Persona.findByPk(id)
    if (!person) throw new Error("Person not found");

    person.set({
        observacion
    });

    await person.save();

    return true;
}

exports.getIdPais = async (id) => {
  const persona = await Persona.findByPk(id, {
    include: {
      model: Lugar,
      attributes: ['id_pais'], 
    },
  });

  if (!persona) throw new Error("Persona no encontrada");

  console.log('Lugar:', persona.Lugar?.id_pais);

  const idPais = persona.Lugar?.id_pais;
  if (!idPais) throw new Error("País no encontrado");

  return idPais; 
};


exports.getFormatoDniByPaisId = async (id_pais) => {
  const pais = await Pais.findByPk(id_pais, {
    attributes: ['formato_dni']
  });

  if (!pais) throw new Error("País no encontrado");

  return pais.formato_dni;
};



