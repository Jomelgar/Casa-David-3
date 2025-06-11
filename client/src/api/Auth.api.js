import axiosInstance from './axiosInstance';
import Cookies from 'js-cookie';

const signInRequest = async (username, password, encrypt = false) => {
  try {
    const response = await axiosInstance.post('auth/login', {
      username,
      password,
      encrypt
    });

    if (response.data.token) {
      Cookies.set('token', response.data.token);
      Cookies.set('userId', response.data.userId);
    }

    return response;
  } catch (error) {
    return error.response;
  }
};

export default { signInRequest };
