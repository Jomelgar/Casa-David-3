const sequelize = require("../Db");
const { Privilegio, UsuarioPrivilegio, Usuario } = require("../models/usuario");

//Privilegios
exports.getAllPrivilegios = async () => {
  const privilegios = await Privilegio.findAll();
  return privilegios;
};

exports.getPrivilegioById = async (id) => {
  const privilegio = await Privilegio.findByPk(id);
  return privilegio;
};

exports.crearPrivilegio = async (privilegioData) => {
  const nuevoPrivilegio = await Privilegio.create(privilegioData);
  return nuevoPrivilegio;
};

exports.deletePrivilegioById = async (id) => {
  const borrar = await Privilegio.destroy({
    where: {
      id_privilegio: id,
    },
  });
  return borrar;
};

exports.editarPrivilegio = async (id, privilegioUpdate) => {
  const privilegioEditado = await Privilegio.update(privilegioUpdate, {
    where: { id_privilegio: id },
  });

  if (privilegioEditado) {
    const edited = await Privilegio.findOne({
      where: { id_privilegio: id },
    });
    return edited;
  }
};

//UsuarioPrivilegio
exports.getAllUsuarioPrivilegios = async () => {
  const privilegios = await UsuarioPrivilegio.findAll();
  return privilegios;
};

exports.getUsuarioPrivilegioById = async (id) => {
  const usuarioPrivilegio = await UsuarioPrivilegio.findByPk(id);
  return usuarioPrivilegio;
};

exports.getUsuarioPrivilegioByUsername = async (user, privilege) => {
  const username = await UsuarioPrivilegio.findOne({
    where: {
      id_usuario: user,
      id_privilegio: privilege,
    },
    include: {
      model: Privilegio,
      attributes: ["descripcion"],
    },
  });

  if (!username) {
    throw new Error("Privilegio no encontrado para este usuario");
  }

  return username.Privilegio.descripcion;
};

exports.getPrivilegiosByUser = async (usuario) => {
  const privilegios = await UsuarioPrivilegio.findAll({
    where: { id_usuario: usuario },
    include: {
      model: Privilegio,
      attributes: ["descripcion"],
    },
  });

  if (!privilegios) {
    throw new Error("Usuario no encontrado");
  }

  return privilegios.map((up) => {
    const { id_usuario_privilegio, id_privilegio } = up;

    return { id_usuario_privilegio, id_privilegio };
  });
};

exports.crearUsuarioPrivilegio = async (usuarioPrivilegioData) => {
  const user = await UsuarioPrivilegio.create(usuarioPrivilegioData);
  return user;
};

exports.deleteUsuarioPrivilegioById = async (id) => {
  const borrar = await UsuarioPrivilegio.destroy({
    where: {
      id_usuario_privilegio: id,
    },
  });
  return borrar;
};
exports.editarUsuarioPrivilegio = async (id, privilegioUsuarioUpdate) => {
  const usuarioPrivilegioEditado = await UsuarioPrivilegio.update(
    privilegioUsuarioUpdate,
    {
      where: { id_usuario_privilegio: id },
    }
  );

  if (usuarioPrivilegioEditado) {
    const edited = await UsuarioPrivilegio.findOne({
      where: { id_usuario_privilegio: id },
    });
    return edited;
  }
};

exports.deleteUsuarioPrivilegioByUserId = async (id) => {
  const borrar = await UsuarioPrivilegio.destroy({
    where: {
      id_usuario: id,
    },
  });
  return borrar;
};
