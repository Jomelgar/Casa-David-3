import axiosInstance from './axiosInstance';

const setLugar = async (data) => {
    try {
        const response = await axiosInstance.post(`lugares`, data);
        return response;
    } catch (error) {
        return error.response;
    }
}


export default {
    setLugar,
};