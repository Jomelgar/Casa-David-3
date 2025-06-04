const perService = require('../services/personaService');

exports.getAllPersonas = async (req, res) => {
  try {
    const people = await perService.getAllPersonas();
    res.status(201).json(people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPersonaById = async (req, res) => {

  try {
    const personaID = req.params.id;
    const person = await perService.getPersonaById(personaID);
    if (person) {
      res.status(201).json(person);
    } else {
      res.status(404).json({ message: 'Persona no encontrado,' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPersonaByDni = async (req, res) => {
  try {
    const dni = req.params.dni;
    const person = await perService.getPersonaByDni(dni);
    if (person) {
      res.status(201).json(person);
    } else {
      res.status(404).json({ message: 'Persona no encontrado,' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPersona = async (req, res) => {
  try {
    const { id_persona, id_ocupacion, municipio_id, dni, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion, telefono, genero, fecha_nacimiento, iglesia } = req.body;
    const nuevaPersona = await perService.createPersona(req.body);
    res.status(201).json(nuevaPersona);
  } catch (error) {
    console.error('Error al crear persona:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deletePersonaById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPersona = await perService.deletePersonaById(id);
    if (deletedPersona) {
      res.status(201).json({ message: 'Persona eliminada exitosamente' });
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getEvangelizacion = async (req, res) => {
  try {
    const personaID = req.params.id;
    const persona = await perService.getPersonaById(personaID);
    if (persona) {
      res.status(200).json({
        compartio_evangelio: persona.compartio_evangelio,
        acepto_a_cristo: persona.acepto_a_cristo,
        reconcilio: persona.reconcilio,
      });
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvangelizacion = async (req, res) => {
  try {
    const personaID = req.params.id;
    const { compartio_evangelio, acepto_a_cristo, reconcilio } = req.body;
    const persona = await perService.getPersonaById(personaID);
    if (persona) {
      persona.compartio_evangelio = compartio_evangelio || persona.compartio_evangelio;
      persona.acepto_a_cristo = acepto_a_cristo || persona.acepto_a_cristo;
      persona.reconcilio = reconcilio || persona.reconcilio;

      await persona.save();
      res.status(200).json({ message: 'Datos de evangelización actualizados' });
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.editarPersona = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const personaEditado = await perService.editarPersona(id, updated);
    if (personaEditado) {
      res.status(201).json({ message: 'Persona editada con exito' });
    } else {
      res.status(404).json({ message: 'Error al editar persona' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getObservacion = async (req, res) => {
  try {
    const { id } = req.params;

    const observacion = await perService.getObservacion(id)
    return res.status(200).json({ observacion })
  } catch {
    return res.status(404).json({ error: "Persona no encontrada" })
  }
}

exports.setObservacion = async (req, res) => {
  try {

    const { id } = req.params;
    const { observacion } = req.body;

    await perService.setObservacion(id, observacion);
    return res.status(200).json({ message: "Observacion actualizada" })
  } catch {
    return res.status(404).json({ error: "Persona no encontrada" })
  }
}

exports.getPais = async (req, res) => {
  try {
    const idPersona = req.params.id;
    const Pais = await perService.getPais(idPersona);
    res.json(Pais.Lugar.Pai); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFormatoDniByPaisId = async (id_pais) => {
  const pais = await perService.getFormatoDniByPaisId(id_pais, {
    attributes: ['formato_dni']
  });

  if (!pais) throw new Error("País no encontrado");

  return pais.formato_dni;
};
