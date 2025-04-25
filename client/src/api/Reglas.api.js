import axiosInstance from './axiosInstance';

const getReglasRequest = async () => {
  try {
    const response = await axiosInstance.get(`reglamento`);

    return response;
  } catch (error) {
    return null;
  }
};

const getReglaRequest = async (id, data) => {
    try {
        const response = await axiosInstance.get(`reglas/${id}`);
    
        return response;
      } catch (error) {
        return null;
      }
};

const postReglasRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `reglas`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const putReglasRequest = async (id, data) => {
    try {
        const response = await axiosInstance.put(
            `reglas/${id}`,
            data
          );
  
      return response;
    } catch (error) {
      return null;
    }
  };

export default {
    getReglaRequest,
    getReglasRequest,
    postReglasRequest,
    putReglasRequest,
};
