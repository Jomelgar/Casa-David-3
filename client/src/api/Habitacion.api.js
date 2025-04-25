import axiosInstance from './axiosInstance';

const getHabitacionRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `habitaciones/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getAllHabitacionesRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`habitaciones/`);

    return response;
  } catch (error) {
    return null;
  }
};

const putHabitacionRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `habitaciones/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postHabitacionRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `habitaciones`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteHabitacionRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`habitaciones/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const verificarCamas  = async (id) => {
  try {
    const response = await axiosInstance.delete(`${id}/verificar-disponibilidad`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getHabitacionRequest,
    putHabitacionRequest,
    postHabitacionRequest,
    getAllHabitacionesRequest,
    deleteHabitacionRequest,
    verificarCamas
};
