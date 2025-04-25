const express = require("express");
const router = express.Router();
const solicitudController = require("../controllers/listaSolicitudController");
const MiscelanousController = require("../controllers/MiscelanousController")
router.get("/solicitudes", solicitudController.getSolicitudes);
router.post("/solicitudes", solicitudController.crearSolicitud);
router.get('/getSalidas', MiscelanousController.getReservaciones);
router.get('/active-huespedes', MiscelanousController.getActiveHuespedes);
router.get('/personas-beneficiadas', MiscelanousController.getPersonasBeneficiadas);
router.get('/camas-disponibles', MiscelanousController.getCamasDisponibles);
router.get('/numero-camas', MiscelanousController.getNumeroCamas);
router.get('/top3-salidas', MiscelanousController.getTop3Closest);
router.get('/departamentos-registrados', MiscelanousController.getDepartamentosRegistrados);


module.exports = router;
