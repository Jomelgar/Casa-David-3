const userService = require("../services/userService");
const crypto = require("../cripto/crypto");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado," });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const name = req.params.username;
    const user = await userService.getUserByUsername(name);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserByIdPersona = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserByIdPersona(id);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { contrasena } = req.body;
    const values = req.body;

    const passwordCrypt = crypto.encrpyt(contrasena);

    values.contrasena = passwordCrypt;

    const newUser = await userService.createUser(values);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.createUserAndPersona = async (req, res) => {
  try {
    const { user, persona } = req.body;

    const passwordCrypt = crypto.encrpyt(user.contrasena);

    user.contrasena = passwordCrypt;

    const result = await userService.createUserAndPersona(user, persona);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (user) {
      await userService.deleteUserById(id);
      res.status(201).json({ user, message: "Usuario eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.editarUser = async (req, res) => {
  try {
    const { id } = req.params;
    let updated = req.body;

    const { contrasena } = updated;

    if (contrasena) {
      const passwordCrypt = crypto.encrpyt(contrasena);

      updated = { ...updated, ...{ contrasena: passwordCrypt } };
    }

    const userEditado = await userService.editarUser(id, updated);

    if (userEditado) {
      res.status(201).json({ message: "User editado con exito" });
    } else {
      res.status(404).json({ message: "Error al editar usuario" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
