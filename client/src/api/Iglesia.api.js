import axiosInstance from './axiosInstance';

const getIglesiaRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`iglesia/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getIglesiasRequest = async () => {
  try {
    const response = await axiosInstance.get(`iglesia`);

    return response;
  } catch (error) {
    return null;
  }
};

const putIglesiaRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `iglesia/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postIglesiaRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `iglesia`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteIglesiaRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`iglesia/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getIglesiaRequest,
    getIglesiasRequest,
    putIglesiaRequest,
    postIglesiaRequest,
    deleteIglesiaRequest,
};
