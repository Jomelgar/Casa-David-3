const { Router } = require("express");

//rutas de Valeria por mientras decidimos lo de los archivos
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const personaController = require("../controllers/personaController");
const huespedController = require("../controllers/huespedController");
const pacienteController = require("../controllers/pacienteController");
const paciente_huespedController = require("../controllers/pacienteHuespedController");
const listaNegraController = require("../controllers/listaNegraController");
const router = Router();

router.put("/listaNegra/observacion/:id", listaNegraController.updateObservacion);


//usuerios
router.post("/auth/login", authController.login); //Funciona
router.get("/usuarios/:id", userController.getUserById); //Funciona
router.get("/usuario/:username", userController.getUserByUsername); //fumiselaneos nciona
router.get("/usuarios/persona/:id", userController.getUserByIdPersona); //funciona
router.post("/usuarios/create", userController.createUser); // Funciona
router.delete("/usuarios/:id", userController.deleteUserById); //Funciona
router.get("/usuarios", userController.getAllUsers); // Funciona
router.post("/crearUsuario*Persona", userController.createUserAndPersona);
router.put("/usuarios/:id", userController.editarUser); //funciona

//rutas de personas
router.get("/persona/:id", personaController.getPersonaById); //funciona
router.post("/persona/create", personaController.createPersona); //funciona
router.delete("/persona/:id", personaController.deletePersonaById); //funciona
router.get("/personas", personaController.getAllPersonas); //funciona
router.put("/persona/:id", personaController.editarPersona);
router.get("/persona/dni/:dni", personaController.getPersonaByDni); //funciona
router.get("/persona/observacion/:id", personaController.getObservacion);
router.put("/persona/observacion/:id", personaController.setObservacion);
router.get("/personas/:id/pais", personaController.getIdPais);

 // Rutas para evangelización
 router.get('/persona/:id/evangelizacion', personaController.getEvangelizacion); // GET
 router.put('/persona/:id/evangelizacion', personaController.updateEvangelizacion); // PUT
 

//rutas de pacientes
router.get("/paciente/:id", pacienteController.getPacienteById); //funciona
router.post("/paciente/create", pacienteController.createPaciente); //funciona
router.delete("/paciente/:id", pacienteController.deletePacienteById); //funciona
router.get("/pacientes", pacienteController.getAllPacientes); //funciona
router.put("/paciente/:id", pacienteController.editarPaciente); //funciona
router.get("/pacientes2", pacienteController.getAllPacientesWithPersona);
router.get("/paciente/dni/:dni", pacienteController.getPacienteByDNI);

//rutas de lista negra
router.get("/lista-negra/:id", listaNegraController.getPersonaInList); //funciona
router.post("/lista-negra/create", listaNegraController.addPersonToList); //funciona
router.delete("/lista-negra/:id", listaNegraController.sacarDeLista); //funciona
router.get("/lista-negra", listaNegraController.getList); //funciona
router.put("/lista-negra/:id", listaNegraController.editarPersonaInList); //funciona
router.get("/lista-negra/persona/:id", listaNegraController.getPersonaInListByPersonaId); //funciona

//rutas de huesped
router.get("/huesped/:id", huespedController.getHuespedById); //funciona
router.get("/huespedesName", huespedController.getAllHuespedesName); //funciona
router.post("/huesped/create", huespedController.createHuesped); //funciona
router.delete("/huesped/:id", huespedController.deleteHuespedById); //funciona
router.get("/huespedes", huespedController.getAllHuespedes); //funciona
router.put("/huesped/:id", huespedController.editarHuesped); //funciona
router.get("/huesped/dni/:dni", huespedController.getHuespedByDNI);
router.get("/getHuesped/:id", huespedController.getHuespedVisitas);

router.get("/paciente-huesped/:id", paciente_huespedController.getOnePH); //funciona
router.post("/paciente-huesped/create", paciente_huespedController.createPH); //funciona
router.delete("/paciente-huesped/:id", paciente_huespedController.deletePHById); //funciona
router.get("/paciente-huespedes", paciente_huespedController.getAllPH); //funciona
router.put("/paciente-huesped/:id", paciente_huespedController.editarPH); //funciona
router.get(
  "/paciente-huesped/huesped/:id",
  paciente_huespedController.getPHbyHuesped
); //funciona


module.exports = router;
