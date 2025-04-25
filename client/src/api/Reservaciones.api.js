import axiosInstance from "./axiosInstance";

const getReservacionRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `reservaciones/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getAcompananteByIdReservacionRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `reservaciones/acompanante/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getReservacionByIdHuespedActivoRequest = async (id) => {
  try {
    const response = await axiosInstance.get(
      `reservaciones/huesped/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const switchCamaRequest = async (id, idCama) => {
  try {
    const response = await axiosInstance.put(
      `reservaciones/switchCama/${id}`,
      { idCama }
    );

    return response;
  } catch (error) {
    return null;
  }
};

const getReservcionActivaByIdCama = async (id) => {
  try {
    const response = await axiosInstance.get(
      `reservaciones/activa/cama/${id}`
    );

    return response;
  } catch (error) {
    return null;
  }
};

const putReservacionRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `reservaciones/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postReservacionRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `reservaciones`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const darDeAltaReservacion = async (id) => {
  console.log("id", id);
  try {
    const response = await axiosInstance.put(
      `reservaciones/darAlta/${id}`
    );

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getReservacionesActivas = async () => {
  try {
    const response = await axiosInstance.get(
      `reservacionesActivas`
    );

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getReservacionesHombres = async (fechaInicio, fechaFinal) => {
  try {
    const respones = axiosInstance.get(
      `reservaciones/huespedPorGenero/hombres`,
      {
        params: {
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
        },
      }
    );

    return respones;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getReservacionesMujeres = async (fechaInicio, fechaFinal) => {
  try {
    const response = axiosInstance.get(
      `reservaciones/huespedPorGenero/mujeres`,
      {
        params: {
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default {
  getReservacionRequest,
  putReservacionRequest,
  postReservacionRequest,
  getReservacionByIdHuespedActivoRequest,
  switchCamaRequest,
  getReservcionActivaByIdCama,
  darDeAltaReservacion,
  getAcompananteByIdReservacionRequest,
  getReservacionesActivas,
  getReservacionesHombres,
  getReservacionesMujeres,
};
