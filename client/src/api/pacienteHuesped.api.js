import axiosInstance from './axiosInstance';

const getPHRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `paciente-huesped/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getPHTotalRequest = async () => {
  try {
    const response = await axiosInstance.get(
      `paciente-huespedes`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getPHByHuespedRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `paciente-huesped/huesped/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const putPHRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `paciente-huesped/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postPHRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `paciente-huesped/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deletePHRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `paciente-huesped/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  getPHRequest,
  getPHTotalRequest,
  putPHRequest,
  postPHRequest,
  deletePHRequest,
  getPHByHuespedRequest,
};
