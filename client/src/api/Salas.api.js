import axiosInstance from './axiosInstance';

const getSalaRequest = async (id, data) => {
  try {
    const response = await axiosInstance.get(`salas/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getSalasRequest = async () => {
  try {
    const response = await axiosInstance.get(`salas`);

    return response;
  } catch (error) {
    return null;
  }
};

const getSalasByPisoRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`salas/piso/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const postSalasRequest = async (data) => {
  try {
    const response = await axiosInstance.post(`salas`, data);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  getSalasRequest,
  getSalaRequest,
  getSalasByPisoRequest,
  postSalasRequest,
};
