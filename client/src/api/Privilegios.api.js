import axiosInstance from './axiosInstance';

const getAllUserPrivilegios = async () => {
  try {
    const response = await axiosInstance.get(
      `privilegiosUsuario`
    );

    return response;
  } catch (error) {
    return null;
  }
};
const deleteUserPrivilegios = async (id) => {
  try {
    const response = await axiosInstance.delete(
      'privilegiosUsuarioId/' + id
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getPrivilegiosByUser = async (id) => {
  try {
    const response = await axiosInstance.get(
      `privilegios/usuario/${id}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const postPrivilegio = async (userId, privilegioId) => {
  try {
    const response = await axiosInstance.post(
      `privilegioUsuario/asignar`,
      { id_usuario: userId, id_privilegio: privilegioId }
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deletePrivilegio = async (usuarioPrivilegioId) => {
  try {
    const response = await axiosInstance.delete(
      `privilegioUsuario/${usuarioPrivilegioId}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default {
  getPrivilegiosByUser,
  postPrivilegio,
  deletePrivilegio,
  getAllUserPrivilegios,
  deleteUserPrivilegios,
};
