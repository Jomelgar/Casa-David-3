import axiosInstance from './axiosInstance';

const getHuespedRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`huesped/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getHuespedesRequest = async () => {
  try {
    const response = await axiosInstance.get(`huespedes`);

    return response;
  } catch (error) {
    return null;
  }
};

const getHuespedesName = async () => {
  try {
    const response = await axiosInstance(`reservaciones/`);
    return response;
  } catch (error) {
    return error.response;
  }
};

const putHuespedRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `huesped/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postHuespedRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `huesped/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteHuespedRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`huesped/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getVisitasHuesped = async (id) => {
  try {
    const response = await axiosInstance(`getHuesped/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

export default {
  getHuespedRequest,
  getHuespedesRequest,
  putHuespedRequest,
  postHuespedRequest,
  deleteHuespedRequest,
  getHuespedesName,
  getVisitasHuesped,
};
