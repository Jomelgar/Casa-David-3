import axiosInstance from './axiosInstance';

const getDepartamentos = async () => {
  try {
    const response = await axiosInstance.get('/departamento');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching departamentos');
  }
};

const setDepartamentoMunicipio = async (data) => {
  try {
    const response = await axiosInstance.post('/departamento-municipio', data);
    return response.data;
  } catch (error) {
    throw new Error('Error creating departamento');
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

const getDepartamentoByPais= async(id_pais) => {
  try
  {
    const response = await axiosInstance.get(`/departamento/pais/${id_pais}`);
    return response.data;
  }catch(error)
  {
    throw new Error('Error fetching departamento by Pais ID');
  }
};

const setDepartamento = async(data) => 
{
  try
  {
    const response = await axiosInstance.post(`/departamento`,data);
    return response.status;
  }
  catch(error)
  {
    throw new Error('Error creatinf Departamento');
  }
};

const deleteDepartamento = async(id) =>
{
  try {
    const response = await axiosInstance.delete(`/departamento/${id}`);
    return response;
  } catch (error) {
    throw new Error('Error deleting departamento');
  }
};
export { getDepartamentos, getDepartamentoById, 
  getDepartamentoByMunicipioId, setDepartamentoMunicipio, getDepartamentoByPais,setDepartamento,deleteDepartamento};
