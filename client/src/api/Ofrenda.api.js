import axiosInstance from './axiosInstance';

const getOfrendaRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`ofrendas/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getOfrendasRequest = async () => {
  try {
    const response = await axiosInstance.get(`ofrendas`);

    return response;
  } catch (error) {
    return null;
  }
};

const getOfrendasByReservacionRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `ofrendas/reservacion/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const putOfrendaRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `ofrendas/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postOfrendaRequest = async (data) => {
  try {
    const response = await axiosInstance.post(`ofrendas`, data);

    return response;
  } catch (error) {
    throw error;
  }
};

const getOfrendasDonaciones = async (fechaInicio, fechaFinal) => {
  try {
    const response = await axiosInstance.get(
      `pago/donaciones/ofrendas`,
      {
        params: {
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
        },
      }
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getOfrendasBecados = async (fechaInicio, fechaFinal) => {
  try {
    const response = await axiosInstance.get(
      `pago/becados/ofrendas`,
      {
        params: {
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
        },
      }
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deleteOfrenda = async (id) => {
  try {
    const response = await axiosInstance.delete(`ofrendas/${id}`);
    return response;
  } catch (error) {
    return null;
  }
}

export default {
  getOfrendaRequest,
  getOfrendasRequest,
  getOfrendasByReservacionRequest,
  putOfrendaRequest,
  postOfrendaRequest,
  getOfrendasBecados,
  getOfrendasDonaciones,
  deleteOfrenda,
};
