const { Router } = require('express');

const rutasV = require('./routesV');
const rutasF = require('./routesF');
const rutasL = require('./productRoutes');
const rutasA = require('./roomRoutes');
const rutasD = require('./routesD');
const rutasExcel = require("./excelRoutes")
const rutasM = require('./MiscelanousRoutes');

const router = Router();

//rutas D = Ocupacion, Procedencia, Iglesia, Iglesia Huesped, Lista de Espera
router.use("/api/",rutasD);

//rutasV = Users, Auth, Persona, Paciente, Paciente Huesped, Huesped, Lista Negra
router.use("/api/",rutasV);

//rutas F = Privilegios, Usuario_Privilegio, Patrono, Afiliado, Afiliado Huesped, Patrono Huesped
router.use("/api/",rutasF);

//rutasA = Habitacion, Cama, Reservacion
router.use("/api/",rutasA);

// rutasL = Transaccion, Reglamento, Hospital, Piso, Sala
router.use("/api/",rutasL);

router.use("/api/",rutasExcel)
//rutasM = Miscelanous Routes
router.use("/api/",rutasM);

module.exports = router;
//Depende de cuantas request vamos a necesitar, es más para tener ese orden por si por ejemplo
//Nelson o Kelvin quierenn revisar el back-end, asi les salva tiempo de andar chequeando cada archivo
