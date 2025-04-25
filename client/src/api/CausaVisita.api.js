import axiosInstance from './axiosInstance';

const baseUrl = "causaVisita";

const getAllCausas = async () => {
  try {
    const response = await axiosInstance.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const createCausa = async (newObject) => {
  try {
    const response = await axiosInstance.post(baseUrl, newObject);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const updateCausa = async (id, newObject) => {
  try {
    const response = await axiosInstance.put(`${baseUrl}/${id}`, newObject);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const deleteCausa = async (id) => {
  try {
    const response = await axiosInstance.delete(`${baseUrl}/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getCausa = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default {
  createCausa,
  updateCausa,
  deleteCausa,
  getCausa,
};

export  {
  getAllCausas,
};
