import axiosInstance from './axiosInstance';

const getPatronoRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`patrono/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPatronosRequest = async () => {
  try {
    const response = await axiosInstance.get(`patronos`);

    return response;
  } catch (error) {
    return null;
  }
};

const putPatronoRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `patrono/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postPatronoRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `patrono/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deletePatronoRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`patrono/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getPatronoRequest,
    getPatronosRequest,
    putPatronoRequest,
    postPatronoRequest,
    deletePatronoRequest,
};
