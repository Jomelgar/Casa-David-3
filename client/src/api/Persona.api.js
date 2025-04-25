import axiosInstance from './axiosInstance';

const getPersonaRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`persona/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPersonasRequest = async () => {
  try {
    const response = await axiosInstance.get(`personas`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPersonaByDniRequest = async (dni) => {
  try {
    const response = await axiosInstance.get(`persona/dni/${dni}`);

    return response;
  } catch (error) {
    return null;
  }
}

const putPersonaRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `persona/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postPersonaRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `persona/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deletePersonaRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`persona/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  getPersonaRequest,
  getPersonasRequest,
  putPersonaRequest,
  postPersonaRequest,
  deletePersonaRequest,
  getPersonaByDniRequest,
};
