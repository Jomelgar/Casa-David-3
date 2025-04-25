import axiosInstance from './axiosInstance';

const getPURequest = async (id) => {
  try {
    const response = await axiosInstance.get(`privilegioUsuario/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPUsRequest = async () => {
  try {
    const response = await axiosInstance.get(`privilegiosUsuario`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPUByUserPrivilegioRequest = async(user, privilegio)=>{
    try{
        const response = await axiosInstance.get(`privilegios/usuario/${user}/privilegio/${privilegio}`);

        return response;
    }catch(error){
        return null;
    }
};

const getAllPUByUserRequest = async(user)=>{
    try{
        const response = await axiosInstance.get(`privilegios/usuario/${user}`);

        return response;
    }catch(error){
        return null;
    }
}

const putPURequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `privilegioUsuario/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postPURequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `privilegioUsuario/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deletePURequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`privilegioUsuario/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

export default {
    getPURequest,
    getPUsRequest,
    putPURequest,
    postPURequest,
    deletePURequest,
    getPUByUserPrivilegioRequest,
    getAllPUByUserRequest,
};
