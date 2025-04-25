import axiosInstance from './axiosInstance';

const getTransaccionRequest = async (id, data) => {
  try {
    const response = await axiosInstance.get(`pisos/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPisosRequest = async () => {
  try {
    const response = await axiosInstance.get(`pisos`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPisosByHospitalRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `pisos/hospital/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postTransaccionRequest = async (data) => {
  try {
    const response = await axiosInstance.post(`pisos`, data);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
  postTransaccionRequest,
  getTransaccionRequest,
  getPisosByHospitalRequest,
  getPisosRequest,
};
