import axiosInstance from './axiosInstance';

const getCamaRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`camas/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getCamasRequest = async () => {
  try {
    const response = await axiosInstance.get(`camas`);

    return response;
  } catch (error) {
    return null;
  }
};

const getCamaRequestbyRoom = async (id) => {
  try {
    const response = await axiosInstance.get(`camasbyroom/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const putCamaRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(`camas/${id}`, data);

    return response;
  } catch (error) {
    return null;
  }
};

const postCamaRequest = async (data) => {
  try {
    const response = await axiosInstance.post(`camas`, data);

    return response;
  } catch (error) {
    return null;
  }
};

const getCamasByDisponibleRequest = async () => {
  try {
    const response = await axiosInstance.get(`camasDisp`);

    return response;
  } catch (error) {
    return null;
  }
};

const deleteCamaRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`camas/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getCamaHuespedByRoom = async (id) => {
  try {
    const response = await axiosInstance.get(`getreservacion/${id}`);

    return response;
  } catch (error) {
    return null;
  }
}

const getCamaByGender = async(genero) => {
  try{
  const response = await axiosInstance.get('camasByGender', genero)

  return response;
  } catch (error) {
    return null;
  }
}

export default {
  getCamaRequest,
  putCamaRequest,
  postCamaRequest,
  getCamaRequestbyRoom,
  getCamasByDisponibleRequest,
  deleteCamaRequest,
  getCamasRequest,
  getCamaHuespedByRoom,
  getCamaByGender
};
