//Copiandole la idea a Raise
const {Router} = require('express')
const router = Router();

const afiliadoController = require('../controllers/afiliadoController');
const afiliadoHuespedController = require('../controllers/afiliadoHuespedController');
const privilegioController = require('../controllers/privilegioController');

//Rutas de Afiliado
router.get('/afiliado/:id', afiliadoController.getAfiliadoById); //Funciona
router.post('/afiliado/create', afiliadoController.createAfiliado); //Funciona
router.delete('/afiliado/:id', afiliadoController.deleteAfiliadoById); //Funciona
router.get('/', afiliadoController.getAllAfiliados);  //Funciona
router.put('/afiliado/:id', afiliadoController.editarAfiliado); 

//Rutas de Patrono
router.get('/patrono/:id', afiliadoController.getPatronoById );//Funciona
router.post('/patrono/create', afiliadoController.createPatrono);//Funciona
router.delete('/patrono/:id', afiliadoController.deletePatronoById); //Funciona
router.get('/patronos', afiliadoController.getAllPatrono); //Funciona
router.put('/patrono/:id', afiliadoController.editarPatrono );

//Rutas de Patrono Afiliado
router.get('/patronoAfiliado/:id', afiliadoController.getPatronoAfiliadoById );
router.post('/patronoAfiliado/create', afiliadoController.createPatronoAfiliado);
router.delete('/patronoAfiliado/:id', afiliadoController.deletePatronoAfiliadoById); 
router.get('/patronosAfiliado', afiliadoController.getAllPatronoAfiliado); //Funciona
router.put('/patronoAfiliado/:id', afiliadoController.editarPatronoAfiliado); 

//Rutas de Afiliado Huesped
router.get('/afiliadoHuesped/:id', afiliadoHuespedController.getAfiliadoHuespedById );
router.post('/afiliadoHuesped/create', afiliadoHuespedController.createAfiliadoHuesped);
router.delete('/afiliadoHuesped/:id', afiliadoHuespedController.deleteHuespedById); 
router.get('/afiliadoHuesped', afiliadoHuespedController.getAllAfiliadoHuespedes); //Funciona
router.put('/afiliadoHuesped/:id', afiliadoHuespedController.editarAfiliadoHuesped );

//Rutas de Privilegio
router.get('/privilegio/:id', privilegioController.getPrivilegioByID);
router.post('/privilegio/create', privilegioController.createPrivilegio);
router.delete('/privilegio/:id', privilegioController.deletePrivilegioById); 
router.get('/privilegios', privilegioController.getAllPrivilegios); 
router.put('/privilegio/:id', privilegioController.editarPrivilegio);

//Rutas de Privilegio Usuario
router.get('/privilegioUsuario/:id', privilegioController.getPrivilegioByID);
router.post('/privilegioUsuario/asignar', privilegioController.asignarPrivilegio);
router.delete('/privilegioUsuario/:id', privilegioController.deleteUsuarioPrivilegioById); 
router.get('/privilegiosUsuario', privilegioController.getAllUsuariosPrivilegios); 
router.get('/privilegios/usuario/:id_usuario/privilegio/:id_privilegio', privilegioController.getUsuarioPrivilegioByUsername);
router.get('/privilegios/usuario/:id', privilegioController.getPrivilegiosByUserId);
router.put('/privilegioUsuario/:id', privilegioController.editarUsuarioPrivilegio);
router.delete('/privilegiosUsuarioId/:id',privilegioController.deleteUsuarioPrivilegioByUserId)

module.exports = router;