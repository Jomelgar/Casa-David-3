const privilegioService = require("../services/privilegiosService");

//Privilegios
exports.getAllPrivilegios = async (req, res) => {
  try {
    const privilegios = await privilegioService.getAllPrivilegios();
    res.status(201).json(privilegios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrivilegioByID = async (req, res) => {
  try {
    const privilegioID = req.params.id;
    const privilegio = await privilegioService.getPrivilegioById(privilegioID);
    if (privilegio) {
      res.status(201).json(privilegio);
    } else {
      res.status(404).json({ message: "Privilegio no encontrado," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPrivilegio = async (req, res) => {
  try {
    const { id_privilegio, descripcion } = req.body;
    const nuevoPrivilegio = await privilegioService.crearPrivilegio(req.body);
    res.status(201).json(nuevoPrivilegio);
  } catch (error) {
    console.error("Error al crear privilegio:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deletePrivilegioById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletePrivilegio = await privilegioService.deletePrivilegioById(id);
    if (deletePrivilegio) {
      res.status(201).json({ message: "Privilegio eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Privilegio no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.editarPrivilegio = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const privilegioEditado = await privilegioService.editarPrivilegio(
      id,
      updated
    );
    if (privilegioEditado) {
      res.status(201).json({ message: "Privilegio editado con exito" });
    } else {
      res.status(404).json({ message: "Error al editar privilegio." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//UsuarioPrivilegio
exports.getAllUsuariosPrivilegios = async (req, res) => {
  try {
    const privilegios = await privilegioService.getAllUsuarioPrivilegios();
    res.status(201).json(privilegios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsuarioPrivilegioByID = async (req, res) => {
  try {
    const privilegioID = req.params.id;
    const privilegio = await privilegioService.getUsuarioPrivilegioById(
      privilegioID
    );
    if (privilegio) {
      res.status(201).json(privilegio);
    } else {
      res.status(404).json({ message: "Privilegio no encontrado," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsuarioPrivilegioByUsername = async (req, res) => {
  try {
    const { id_usuario, id_privilegio } = req.params;
    const descripcion = await privilegioService.getUsuarioPrivilegioByUsername(
      id_usuario,
      id_privilegio
    );
    res.status(201).json({ descripcion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrivilegiosByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const privilegios = await privilegioService.getPrivilegiosByUser(id);
    res.status(201).json(privilegios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.asignarPrivilegio = async (req, res) => {
  try {
    const { id_usuario_privilegio, id_usuario, id_privilegio } = req.body;
    const nuevoPrivilegio = await privilegioService.crearUsuarioPrivilegio(
      req.body
    );
    res.status(201).json(nuevoPrivilegio);
  } catch (error) {
    console.error("Error al crear privilegio:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deleteUsuarioPrivilegioById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletePrivilegio =
      await privilegioService.deleteUsuarioPrivilegioById(id);
    if (deletePrivilegio) {
      res.status(201).json({ message: "Privilegio eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Privilegio no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteUsuarioPrivilegioByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const privilegios = await privilegioService.getPrivilegiosByUser(id);

    if (privilegios.length === 0) {
      return res.status(201).json({ message: "Usuario no tiene privilegios" });
    }

    const deletePrivilegio =
      await privilegioService.deleteUsuarioPrivilegioByUserId(id);
    if (deletePrivilegio) {
      res.status(201).json({ message: "Privilegio eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Privilegio no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.editarUsuarioPrivilegio = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const privilegioEditado = await privilegioService.editarUsuarioPrivilegio(
      id,
      updated
    );
    if (privilegioEditado) {
      res.status(201).json({ message: "Privilegio editado con exito" });
    } else {
      res.status(404).json({ message: "Error al editar privilegio." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
