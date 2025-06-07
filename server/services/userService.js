const sequelize = require("../Db");
const { Usuario } = require("../models/usuario");
const { Persona } = require("../models/persona");

exports.getUserByUsername = async (username) => {
  try {
    const user = await Usuario.findOne({
      where: {
        nickname: username,
      },
      include: [
        {
          model: Persona,
          where: {activo: true},
          attributes: ["id_lugar"],
        },
      ],
    });



    return user;
  } catch (error) {
    console.error("Error retrieving user by username:", error);
    throw error;
  }
};

exports.login = async (username, password) => {
  const result = await Usuario.findOne({
    where: {
      nickname: username,
      contrasena: password,
    },
    include: [
      {
        model: Persona,
        attributes: ["id_lugar"],
      },
    ],
  });

  return result;
};

exports.getAllUsers = async () => {
  const users = await Usuario.findAll({ include: ["Hospital", "Persona"] });
  return users;
};

exports.getUserById = async (id) => {
  const result = await Usuario.findByPk(id);
  return result;
};

exports.getUserByUsername = async (username) => {
  const result = await Usuario.findOne({
    where: {
      nickname: username,
    },
  });
  return result;
};

exports.getUserByIdPersona = async (id) => {
  const result = await Usuario.findOne({
    where: {
      id_persona: id,
    },
  });
  return result;
};

exports.createUser = async (dataUsuario) => {
  const nuevoUser = await Usuario.create(dataUsuario);
  return nuevoUser;
};

exports.deleteUserById = async (id) => {
  await Usuario.destroy({
    where: {
      id_usuario: id,
    },
  });
};

exports.createUserAndPersona = async (userData, personaData) => {
  const probar = await sequelize.transaction();

  try {
    console.log(personaData);
    const nuevaP = await Persona.create(personaData, { probar });
    userData.id_persona = nuevaP.id_persona;
    const nuevoU = await Usuario.create(userData, { probar });

    await probar.commit();
    return nuevoU, nuevaP;
  } catch (error) {
    await probar.rollback();
    throw new Error("Error al crear usuario y persona: " + error.message);
  }
};

exports.authenticateUser = async (username, password) => {
  const result = await Usuario.findOne({
    where: {
      nickname: username,
      contrasena: password,
    },
  });

  return result != null;
};

exports.editarUser = async (id, userUpdate) => {
  const userEditado = await Usuario.update(userUpdate, {
    where: { id_usuario: id },
  });

  if (userEditado) {
    const edited = await Usuario.findOne({
      ehre: { id_usuario: id },
    });
    return edited;
  }
};
