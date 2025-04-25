import axiosInstance from './axiosInstance';

const ruta = 'procedencia/';

const getProcedenciasRequest = async () => {
  try {
    const response = await axiosInstance.get(ruta);

    return response;
  } catch (error) {
    return null;
  }
};

const getProcedenciaRequest = async (id) => {
  try {
    const response = await axiosInstance.get(ruta + id);

    return response;
  } catch (error) {
    return null;
  }
};

const postProcedenciaRequest = async (data) => {
  try {
    const response = await axiosInstance.post(ruta, data);

    return response;
  } catch (error) {
    return null;
  }
};

const putProcedenciaRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(ruta + id, data);

    return response;
  } catch (error) {
    return null;
  }
};

const deleteProcedenciaRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(ruta + id);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  getProcedenciasRequest,
  getProcedenciaRequest,
  postProcedenciaRequest,
  putProcedenciaRequest,
  deleteProcedenciaRequest,
};
