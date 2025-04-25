import axiosInstance from './axiosInstance';

const getPersonRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`lista-negra/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getListaNegraByIdPerson = async (id) => {
  try {
    const response = await axiosInstance.get(
      `lista-negra/persona/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getListRequest = async () => {
  try {
    const response = await axiosInstance.get(`lista-negra`);

    return response;
  } catch (error) {
    return null;
  }
};

const putListRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `lista-negra/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postListRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `lista-negra/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteListRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`lista-negra/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  getPersonRequest,
  getListRequest,
  putListRequest,
  postListRequest,
  getListaNegraByIdPerson,
  deleteListRequest,
};
