import axiosInstance from './axiosInstance';

const getPrivilegioRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`privilegio/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPrivilegiosRequest = async () => {
  try {
    const response = await axiosInstance.get(`privilegios`);

    return response;
  } catch (error) {
    return null;
  }
};

const putPrivilegioRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `privilegio/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postPatronoRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `privilegio/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deletePatronoRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`privilegio/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getPrivilegioRequest,
    getPrivilegiosRequest,
    putPrivilegioRequest,
    postPatronoRequest,
    deletePatronoRequest,
};
