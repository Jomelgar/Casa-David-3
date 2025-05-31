import axiosInstance from './axiosInstance';

const getPaisForTable = async() => {
    try {
        const response = await axiosInstance.get(`/paisForTable`);
        return response;
    } catch (error) {
        return null;
    }
};

const setPais = async (paisData) => {
    try {
        const response = await axiosInstance.post(`/pais`, paisData);
        return response;
    } catch (error) {
        return null;
    }
};

const deletePais = async (id) => {
    try {
        const response = await axiosInstance.delete(`/pais/${id}`);
        return response;
    } catch (error) {
        return null;
    }
};

const getDepartamentoMunicipio= async (id) => 
{
    try
    {
        const data = await axiosInstance.get(`/pais-todo/${id}`);
        return data;
    }catch(error)
    {
        return [];
    };
};

export default {
    getPaisForTable,
    setPais,
    deletePais,
    getDepartamentoMunicipio
};