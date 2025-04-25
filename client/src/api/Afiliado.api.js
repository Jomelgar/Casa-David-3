import axiosInstance from './axiosInstance';

const getAfiliadoRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`afiliado/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getAfiliadosRequest = async () => {
  try {
    const response = await axiosInstance.get(`afiliados`);

    return response;
  } catch (error) {
    return null;
  }
};

const putAfiliadoRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `afiliado/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postAfiliadoRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `afiliado/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteAfiliadoRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`afiliado/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getAfiliadoRequest,
    getAfiliadosRequest,
    putAfiliadoRequest,
    postAfiliadoRequest,
    deleteAfiliadoRequest,
};
