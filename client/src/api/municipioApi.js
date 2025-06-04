import axiosInstance from './axiosInstance';

const getMunicipiosByDepartamentoId = async (departamentoId) => {
  try {
    console.log("departamentoId Func", departamentoId) 
    const response = await axiosInstance.get(`/municipios/departamento/${departamentoId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching municipios');
  }
};

const getMunicipioById = async (municipioId) => {
  try {
    const response = await axiosInstance.get(`/municipio/${municipioId}`);
    return response.data;
    } catch (error) {
    throw new Error('Error fetching municipio');
    }
};

const setMunicipio = async (data) => {
  try {
    const response = await axiosInstance.post(`/municipio`, data);
    return response.status;
  } catch (error) {
    console.error("Error al crear municipio:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear municipio');
  }
};

const deleteMunicipio = async(id) => 
{
  try {
    const response = await axiosInstance.delete(`/municipio/${id}`);
    return response;
  } catch (error) {
    console.error("Error al crear municipio:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar municipio');
  }
}

export { getMunicipiosByDepartamentoId, getMunicipioById,setMunicipio,deleteMunicipio};