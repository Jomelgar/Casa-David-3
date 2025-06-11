const {Router} = require('express')

const procedenciaController = require('../controllers/procedenciaController');
const departamentoController = require('../controllers/departamentoController');
const ocupacionController = require('../controllers/ocupacionController');
const ListaSolicitudController = require('../controllers/listaSolicitudController');
const iglesiaController = require('../controllers/iglesiaController');
const iglesiaHuespedController = require('../controllers/iglesiaHuespedController');
const causaVisitaController = require('../controllers/causaVisitaController')
const municipioController = require('../controllers/municipioController');
const paisController = require('../controllers/paisController');
const lugarController = require('../controllers/lugarController');


const router = Router();


//procedencia
router.get('/procedencia', procedenciaController.getAllProcedencia);
router.post('/procedencia', procedenciaController.crearProcedencia);
router.put('/procedencia/:id',procedenciaController.editarProcedencia);
router.delete('/procedencia/:id',procedenciaController.eliminarProcedencia);
router.get('/procedencia/:id',procedenciaController.getProcedencia);


//ocupacion
router.get('/ocupacion', ocupacionController.getAllOcupacion);
router.post('/ocupacion', ocupacionController.crearOcupacion);
router.put('/ocupacion/:id',ocupacionController.editarOcupacion);
router.delete('/ocupacion/:id',ocupacionController.eliminarOcupacion);
router.get('/ocupacion/:id',ocupacionController.getOcupacion);

//lista de solicitud
router.get('/listaSolicitud', ListaSolicitudController.getSolicitudes);
router.post('/listaSolicitud', ListaSolicitudController.crearSolicitudes);
router.put('/listaSolicitud/:id',ListaSolicitudController.editarSolicitud);
router.delete('/listaSolicitud/:id',ListaSolicitudController.eliminarSolicitud);
router.get('/listaSolicitud/:id',ListaSolicitudController.getListaSolicitud);

//iglesia
router.get('/iglesia', iglesiaController.getAllIglesia);
router.post('/iglesia', iglesiaController.crearIglesia);
router.put('/iglesia/:id',iglesiaController.editarIglesia);
router.delete('/iglesia/:id',iglesiaController.eliminarIglesia);
router.get('/iglesia/:id',iglesiaController.getIglesia);

//iglesia huesped
router.get('/iglesiaHuesped', iglesiaHuespedController.getAllIglesiaH);
router.post('/iglesiaHuesped', iglesiaHuespedController.crearIglesiaH);
router.put('/iglesiaHuesped/:id',iglesiaHuespedController.editarIglesiaH);
router.delete('/iglesiaHuesped/:id',iglesiaHuespedController.eliminarIglesiaH);
router.get('/iglesiaHuesped/:id',iglesiaHuespedController.getIglesiaH);

//Causa Visita
router.get('/causaVisita',causaVisitaController.getAllCausas);
router.post('/causaVisita',causaVisitaController.createCausaVisita);
router.put('/causaVisita/:id',causaVisitaController.editarCausa);
router.delete('/causaVisita/:id',causaVisitaController.deleteCausaVisita);
router.get('/causaVisita/:id',causaVisitaController.getCausaById);

//departamento
router.delete('/departamento/:id', departamentoController.deleteDepartamento);
router.get('/departamento', departamentoController.getAllDepartamento);
router.get('/departamento/:id', departamentoController.getDepartamentoById);
router.get('/departamento/municipio/:id', departamentoController.getDepartamentoByMunicipioId);
router.post('/departamento',departamentoController.setDepartamento);
router.post('/departamento-municipio', departamentoController.setDepartamentoMunicipio);
router.get('/departamento/pais/:id', departamentoController.getDepartamentoByPais);

//municipio
router.delete('/municipio/:id',municipioController.deleteMunicipio);
router.post('/municipio',municipioController.setMunicipio);
router.get('/municipio', municipioController.getAllMunicipio);
router.get('/municipio/:id', municipioController.getMunicipioById);
router.get('/municipios/departamento/:id', municipioController.getAllMunicipiosByDepartamentoId);

//lugar
router.post('/lugares', lugarController.crearlugar);
router.get('/lugares/pais/:id_pais', lugarController.getlugarByPais);
router.delete('/lugares/:id', lugarController.eliminarlugar);
router.get('/lugares/paises',lugarController.getLugarWithPais);
router.get('/paises/lugares/:id',lugarController.getPaisByLugar);

//pais
router.put('/pais/:id', paisController.updatePais);
router.get('/paisForTable', paisController.getAllPaisesForTable);
router.get('/pais/:id',paisController.getPaisById);
router.get('/pais-todo/:id', paisController.getAllPais);
router.post('/pais', paisController.createPais);
router.delete('/pais/:id', paisController.deletePais);
router.get('/pais/:id/iso', paisController.getCodigoIso)
module.exports = router;