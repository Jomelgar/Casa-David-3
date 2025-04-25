import axiosInstance from './axiosInstance';

const getPARequest = async (id) => {
  try {
    const response = await axiosInstance.get(`patronoAfiliado/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPAsRequest = async () => {
  try {
    const response = await axiosInstance.get(`patronosAfiliado`);

    return response;
  } catch (error) {
    return null;
  }
};

const putPARequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `patronoAfiliado/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postPARequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `patronoAfiliado/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deletePARequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`patronoAfiliado/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getPARequest,
    getPAsRequest,
    putPARequest,
    postPARequest,
    deletePARequest,
};
