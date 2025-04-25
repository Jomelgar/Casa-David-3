import axiosInstance from './axiosInstance';

const getAHRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`afiliadoHuesped/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getAHsRequest = async () => {
  try {
    const response = await axiosInstance.get(`afiliadoHuesped`);

    return response;
  } catch (error) {
    return null;
  }
};

const putAHRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `afiliadoHuesped/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postAHRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `afiliadoHuesped/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteAHRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`afiliadoHuesped/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getAHRequest,
    getAHsRequest,
    putAHRequest,
    postAHRequest,
    deleteAHRequest,
};
