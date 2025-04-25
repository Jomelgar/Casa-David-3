import axiosInstance from './axiosInstance';

const getTransaccionesRequest = async () => {
  try {
    const response = await axiosInstance.get(`transacciones`);

    return response;
  } catch (error) {
    return null;
  }
};

const getTransaccionRequest = async (id, data) => {
    try {
        const response = await axiosInstance.get(`transacciones/${id}`);
    
        return response;
      } catch (error) {
        return null;
      }
};

const postTransaccionRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `transacciones/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getTransaccionesRequest,
    getTransaccionRequest,
    postTransaccionRequest,
};
