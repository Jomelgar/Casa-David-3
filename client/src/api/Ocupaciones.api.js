import axiosInstance from './axiosInstance';

const ruta = 'ocupacion/';

const getOcupacionesRequest = async () => {
  try {
    const response = await axiosInstance.get(ruta);

    return response;
  } catch (error) {
    return null;
  }
};

const getOcupacionRequest = async (id) => {
  try {
    const response = await axiosInstance.get(ruta + id);

    return response;
  } catch (error) {
    return null;
  }
};

const postOcupacionRequest = async (data) => {
  try {
    const response = await axiosInstance.post(ruta, data);

    return response;
  } catch (error) {
    return null;
  }
};

const putOcupacionRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(ruta + id, data);

    return response;
  } catch (error) {
    return null;
  }
};

const deleteOcupacionRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(ruta + id);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  getOcupacionesRequest,
  getOcupacionRequest,
  postOcupacionRequest,
  putOcupacionRequest,
  deleteOcupacionRequest,
};
