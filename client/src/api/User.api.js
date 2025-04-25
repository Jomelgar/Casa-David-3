import axiosInstance from './axiosInstance';

const ruta = 'usuarios/';

const getUserRequest = async (id) => {
  try {
    const response = await axiosInstance.get(ruta + id);

    return response;
  } catch (error) {
    return null;
  }
};

const getUsersRequest = async () => {
  try {
    const response = await axiosInstance.get(`usuarios`);

    return response;
  } catch (error) {
    return null;
  }
};

const getUserByNicknameRequest = async (nickname) => {
  try {
    const response = await axiosInstance.get(
      'usuario/' + nickname
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

const getUserByIdPersonaRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      "usuarios/persona/" + id
    );

    return response;
  } catch (error) {
    return error.response;
  }
}

const postUserRequest = async (data) => {
  try {
    const response = await axiosInstance.post(ruta + 'create', data);

    return response;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
};

const postUserPersonaRequest = async (user, persona) => {
  {
    try {
      const response = await axiosInstance.post(
        "crearUsuario*Persona",
        { user, persona }
      );

      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  }
};

const deleteUserRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(ruta + id);

    return response;
  } catch (error) {
    if (error.response) return error.response;
  }
};

const putUserRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(ruta + id, data);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  getUserRequest,
  getUsersRequest,
  getUserByNicknameRequest,
  getUserByIdPersonaRequest,
  postUserRequest,
  deleteUserRequest,
  putUserRequest,
  postUserPersonaRequest
};
