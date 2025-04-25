import axiosInstance from './axiosInstance';

const getDepartamentos = async () => {
  try {
    const response = await axiosInstance.get('/departamento');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching departamentos');
  }
};

const getDepartamentoById = async (departamentoId) => {
  try {
    const response = await axiosInstance.get(`/departamento/${departamentoId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching departamento by ID');
  }
};

const getDepartamentoByMunicipioId = async (municipio_id) => {
  try {
    const response = await axiosInstance.get(`/departamento/municipio/${municipio_id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching departamento by municipio ID');
  }
};

export { getDepartamentos, getDepartamentoById, getDepartamentoByMunicipioId };
