import axiosInstance from './axiosInstance';

const getPacienteRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`paciente/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPacientesRequest = async () => {
  try {
    const response = await axiosInstance.get(`pacientes`);

    return response;
  } catch (error) {
    return null;
  }
};

const putPacienteRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `paciente/${id}`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const postPacienteRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `paciente/create`,
      data
    );

    return response;
  } catch (error) {
    return null;
  }
};

const deletePacienteRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`paciente/${id}`);

    return response;
  } catch (error) {
    return null;
  }
};

const getPacienteAndPersonaForTabla = async () => {
  try {
    const response = await axiosInstance.get('pacientes2');

    const flattenedData = response.data.map((item) => ({
      causa: item.causa,
      nombre: item.Persona.nombre,
      id: item.Persona.id,
      genero: item.Persona.genero,
      //   ocupacion: item.Persona.Ocupacion.ocupacion,
      apellido: item.Persona.apellido,
    }));

    return flattenedData;
  } catch (error) {
    console.error('There was an error fetching the data!', error);
    return null;
  }
};

export default {
  getPacientesRequest,
  putPacienteRequest,
  postPacienteRequest,
  deletePacienteRequest,
  getPacienteAndPersonaForTabla,
};
export {
  getPacienteRequest,
}
