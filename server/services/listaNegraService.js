const sequelize = require("../Db");
const { ListaNegra, Reglamento } = require("../models/lista");
const { Persona, Lugar } = require("../models/persona");
const { Pais } = require("../models/pais")

exports.getAllLista = async () => {
  const list = await ListaNegra.findAll({
    include: [{ model: Persona, include: [
          {
            model: Lugar,
            include: [Pais],
          }
        ] 
      }, { model: Reglamento }],
  });
  return list;
};

exports.getPersonaInList = async (id) => {
  const person = await ListaNegra.findByPk(id, {
    include: [{ model: Persona }, { model: Reglamento }],
  });
  return person;
};

exports.getPersonaInListByPersonaId = async (id) => {
  const person = await ListaNegra.findOne({
    where: {
      id_persona: id,
    },
    include: [
      { model: Persona}, { model: Reglamento }],
  });
  return person;
};

exports.addToList = async (personData) => {
  const nueva = await ListaNegra.create(personData);
  return nueva;
};

exports.deletePersonFromList = async (id) => {
  const borrar = await ListaNegra.destroy({
    where: {
      id_lista_negra: id,
    },
  });
  return borrar;
};

exports.editarPersonaInList = async (id, listUpdate) => {
  const personaLista = await ListaNegra.update(listUpdate, {
    where: { id_lista_negra: id },
  });

  if (personaLista) {
    const edited = await ListaNegra.findOne({
      where: { id_lista_negra: id },
    });
    return edited;
  }
};

// Método para actualizar la observación de una persona en la lista negra
exports.updateObservacion = async (id_lista_negra, observacion) => {
  const result = await ListaNegra.update(
    { observacion },
    { where: { id_lista_negra } }
  );
  return result;
};