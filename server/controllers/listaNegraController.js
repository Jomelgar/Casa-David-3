const listaNegraService = require("../services/listaNegraService");

exports.getList = async (req, res) => {
  try {
    const people = await listaNegraService.getAllLista();
    res.status(201).json(people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPersonaInListByPersonaId = async (req, res) => {
  try {
    const personaID = req.params.id;
    const person = await listaNegraService.getPersonaInListByPersonaId(
      personaID
    );
    if (person) {
      res.status(201).json(person);
    } else {
      res.status(404).json({ message: "Persona no encontrada," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPersonaInList = async (req, res) => {
  try {
    const personaID = req.params.id;
    const person = await listaNegraService.getPersonaInList(personaID);
    if (person) {
      res.status(201).json(person);
    } else {
      res.status(404).json({ message: "Persona no encontrada," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addPersonToList = async (req, res) => {
  try {
    const { id_persona, id_regla, observacion } = req.body;
    const nuevaPersona = await listaNegraService.addToList(req.body);
    res.status(201).json(nuevaPersona);
  } catch (error) {
    console.error("Error al añadir persona:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.sacarDeLista = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPersona = await listaNegraService.deletePersonFromList(id);
    if (deletedPersona) {
      res.status(201).json({ message: "Persona fuera de la lista" });
    } else {
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editarPersonaInList = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const listEditado = await listaNegraService.editarPersonaInList(
      id,
      updated
    );
    if (listEditado) {
      res.status(201).json({ message: "Lista Negra editada con exito" });
    } else {
      res.status(404).json({ message: "Error al editar Lista Negra" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateObservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { observacion } = req.body;

    const result = await listaNegraService.updateObservacion(id, observacion);
    if (result) {
      res.status(200).json({ message: "Observación actualizada correctamente" });
    } else {
      res.status(404).json({ message: "No se encontró el registro" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
