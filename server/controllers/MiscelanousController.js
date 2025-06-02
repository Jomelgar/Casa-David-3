const MiscelanousService = require('../services/Miscelanous');

async function getPersonsInListaEspera(req, res) {
  try {
    const listaEsperaEntries = await MiscelanousService.getPersonsInListaEsperaService();
    const formattedEntries = listaEsperaEntries.map(entry => ({
      id_lista_espera: entry.id_lista_espera,
      fecha_entrada: entry.fecha_entrada,
      id_persona: entry.Persona.id_persona,
      nombre: `${entry.Persona.primer_nombre} ${entry.Persona.primer_apellido}`,
      telefono: entry.Persona.telefono,
      genero: entry.Persona.genero,
      causa_visita: entry.Persona.Pacientes.map(paciente => paciente.causa_visita).join(', ')
    }));
    res.json(formattedEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getReservaciones = async (req, res) => {
  const { startDate, endDate, id_lugar } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Faltan parametros de fechas.' });
  }

  try {
    const reservaciones = await MiscelanousService.getReservaciones(startDate, endDate, id_lugar);
    res.json(reservaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener salidas de huespedes.' });
  }
};
const getActiveHuespedes = async (req, res) => {
  try {
    const { id_lugar } = req.query;
    const activeHuespedesCount = await MiscelanousService.countActiveHuespedes(id_lugar);
    res.json({ activeHuespedesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al contar huespedes activos.' });
  }
};


const getPersonasBeneficiadas = async (req, res) => {
  try {
    const { id_lugar } = req.query;
    const personasBeneficiadasCount = await MiscelanousService.countPersonasBeneficiadas(id_lugar);
    res.json({ personasBeneficiadasCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al contar los beneficiados.' });
  }
};

const getCamasDisponibles = async (req, res) => {
  try {
   const { id_lugar } = req.query;
    const camasDisponiblesCount = await MiscelanousService.countCamasDisponibles(id_lugar);
    res.json({ camasDisponiblesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al contar camas disponibles.' });
  }
};

const getNumeroCamas = async (req, res) => {
  try {
    const { id_lugar } = req.query;
    const numeroCamasCount = await MiscelanousService.countNumeroCamas(id_lugar);
    res.json({ numeroCamasCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al contar camas' });
  }
};
const getTop3Closest = async (req, res) => {
  try {
    const top3ClosestFechaSalida = await MiscelanousService.getTop3ClosestFechaSalida();
    res.json(top3ClosestFechaSalida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las 3 personas' });
  }
};

const getDepartamentosRegistrados = async (req, res) => {
  try {
    const id_pais = req.params.id_pais;
    const countDepartamentos = await MiscelanousService.countDepartamentosRegistrados(id_pais);
    res.json(countDepartamentos);
  }catch(error){
    console.error(error);
    res.status(500).json({ error : 'Error al obtener los departamentos'})
  }
};


module.exports = {
  getPersonsInListaEspera,
  getReservaciones,
  getActiveHuespedes,
  getPersonasBeneficiadas,
  getCamasDisponibles,
  getNumeroCamas,
  getTop3Closest,
  getDepartamentosRegistrados
};

