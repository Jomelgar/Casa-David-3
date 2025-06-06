import axiosInstance from './axiosInstance';

const getHospitalRequest = async () => {
  try {
    const response = await axiosInstance.get(`hospitales`);

    return response;
  } catch (error) {
    return error.response;
  }
};

const getHospitalesRequest = async (id, data) => {
    try {
        const response = await axiosInstance.get(`hospitales/${id}`);
    
        return response;
      } catch (error) {
        return null;
      }
};

const postHospitalesRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `hospitales`,
      data
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

const deleteHospitalesRequest = async (id) => {
    try {
      const response = await axiosInstance.delete(`hospitales/${id}`);
  
      return response;
    } catch (error) {
      return null;
    }
  };

const getHospitalByPais = async (id_pais) => {
    try {
        console.log("ID PAIS: ", id_pais);
        const response = await axiosInstance.get(`hospitales/pais/${id_pais}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export default {
    getHospitalRequest,
    getHospitalesRequest,
    postHospitalesRequest,
    deleteHospitalesRequest,
    getHospitalByPais
};
