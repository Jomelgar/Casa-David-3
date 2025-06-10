import axiosInstance from "./axiosInstance";

export const getAllPacientesWithPersona = async () => {
  const res = await axiosInstance.get("/pacientes2");
  return res.data; // Asegúrate que esto devuelve directamente el array de pacientes
};



// Obtener UN paciente por ID
export const getPacienteRequest = async (id) => {
  try {
    const response = await axiosInstance.get(`paciente/${id}`);
    return response;
  } catch (error) {
    return null;
  }
};

// Obtener TODOS los pacientes
export const getPacientesRequest = async () => {
  try {
    const response = await axiosInstance.get(`pacientes`);
    return response;
  } catch (error) {
    return null;
  }
};

export const putPacienteRequest = async (id, data) => {
  try {
    const response = await axiosInstance.put(`paciente/${id}`, data);
    return response;
  } catch (error) {
    return null;
  }
};

export const postPacienteRequest = async (data) => {
  try {
    const response = await axiosInstance.post(`paciente/create`, data);
    return response;
  } catch (error) {
    return null;
  }
};

export const deletePacienteRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`paciente/${id}`);
    return response;
  } catch (error) {
    return null;
  }
};

export const getPacienteAndPersonaForTabla = async () => {
  try {
    const response = await axiosInstance.get('pacientes2');
    const flattenedData = response.data.map((item) => ({
      causa: item.causa,
      nombre: item.Persona.nombre,
      id: item.Persona.id,
      genero: item.Persona.genero,
      apellido: item.Persona.apellido,
    }));

    return flattenedData;
  } catch (error) {
    console.error('There was an error fetching the data!', error);
    return null;
  }
};
