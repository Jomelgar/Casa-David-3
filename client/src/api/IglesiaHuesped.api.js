import axiosInstance from './axiosInstance';

const getIHRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`iglesiaHuesped/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getIHsRequest = async () => {
  try {
    const response = await axiosInstance.get(`iglesiaHuesped`);

    return response;
  } catch (error) {
    return null;
  }
};

const putIHRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `iglesiaHuesped/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postIHRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `iglesiaHuesped`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteIHRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`iglesiaHuesped/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getIHRequest,
    getIHsRequest,
    putIHRequest,
    postIHRequest,
    deleteIHRequest,
};
