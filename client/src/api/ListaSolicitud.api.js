import axiosInstance from "./axiosInstance";

const getListaSolicitudRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `listaSolicitud/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getListaSolicitudTotalRequest = async (id_lugar) => {
  try {
    const response = await axiosInstance.get(
      `listaSolicitud`,
      {
        id_lugar,
      }
    );

    return response;
  } catch (error) {
    return null;
  }
};

const putListaSolicitudRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `listaSolicitud/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postListaSolicitudRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `listaSolicitud`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteListaSolicitudRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `listaSolicitud/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  getListaSolicitudRequest,
  getListaSolicitudTotalRequest,
  putListaSolicitudRequest,
  postListaSolicitudRequest,
  deleteListaSolicitudRequest,
};
