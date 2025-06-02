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

const setMunicipio = async(data) => 
{
  try
  {
    const response = await axiosInstance.post(`/municipio`,data);
    return response.data;
  }
  catch(error)
  {
    throw new Error('Error creating municipio');
  }
};

export { getMunicipiosByDepartamentoId, getMunicipioById,setMunicipio};