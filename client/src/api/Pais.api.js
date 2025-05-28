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

export default {
    getPaisForTable,
    setPais
};