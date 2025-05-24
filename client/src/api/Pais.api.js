import axiosInstance from './axiosInstance';

const getPaisForTable = async() => {
    try {
        const response = await axiosInstance.get(`/paisForTable`);
        return response;
    } catch (error) {
        return null;
    }
};

export default {
    getPaisForTable
};