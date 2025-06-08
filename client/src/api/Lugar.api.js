import axiosInstance from './axiosInstance';

const setLugar = async (data) => {
    try {
        const response = await axiosInstance.post(`lugares`, data);
        return response;
    } catch (error) {
        return error.response;
    }
}

const getLugarByPais = async (id_pais) => {
    try {
        const response = await axiosInstance.get(`lugares/pais/${id_pais}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

const deleteLugar = async (id) => {
    try {
        const response = await axiosInstance.delete(`lugares/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

const getLugarWithPais= async () => 
{
    try {
        const response = await axiosInstance.get(`lugares/paises`);
        return response;
    } catch (error) {
        return error.response;
    }
}
export default {
    setLugar,
    getLugarByPais,
    deleteLugar,
    getLugarWithPais
};