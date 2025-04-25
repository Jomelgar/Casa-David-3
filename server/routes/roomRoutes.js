const { Router } = require("express");
const roomController = require("../controllers/roomController");
const lugarController = require("../controllers/lugarController");
const reservacionController = require("../controllers/reservacion.controller");

const Product = require("../controllers/productController");
const ofrendaController = require("../controllers/ofrendas.controller");
const roomRouter = Router();

roomRouter.post("/lugar", lugarController.crearlugar);
roomRouter.get("/lugar", lugarController.getAllLugar);
roomRouter.get("/lugar/:id", lugarController.getlugar);
roomRouter.put("/lugar/:id", lugarController.editarlugar);
roomRouter.delete("/lugar/:id", lugarController.eliminarlugar);

roomRouter.post("/habitaciones", roomController.createHabitacion);
roomRouter.get("/habitaciones", roomController.getAllHabitaciones);
roomRouter.get("/habitaciones/:id", roomController.getHabitacionById);
roomRouter.put("/habitaciones/:id", roomController.editHabitacion);
roomRouter.delete("/habitaciones/:id", roomController.deleteHabitacionById);

roomRouter.get("/camas", roomController.getAllCamas);
roomRouter.post("/camas", roomController.createCama);
roomRouter.get("/camasbyroom/:id", roomController.getCamasByRoom);
roomRouter.get("/camas/:id", roomController.getCamaById);
roomRouter.put("/camas/:id", roomController.editCama);
roomRouter.get("/camasDisp", roomController.getCamasByDisponibilidad);
roomRouter.delete("/camas/:id", roomController.deleteCamaById);
roomRouter.get("/camasByGender", roomController.getCamasByGender)

roomRouter.post("/ofrendas", ofrendaController.createOfrenda);
roomRouter.get("/ofrendas", ofrendaController.getAllOfrendas);
roomRouter.get("/ofrendas/:id", ofrendaController.getOfrendaById);
roomRouter.put("/ofrendas/:id", ofrendaController.updateOfrenda);
roomRouter.delete("/ofrendas/:id", ofrendaController.deleteOfrenda);
roomRouter.get(
  "/ofrendas/reservacion/:id_reservacion",
  ofrendaController.getOfrendasByReservacion
);

roomRouter.get('/pago/becados/ofrendas', roomController.getBecados);//funciona
roomRouter.get('/pago/donaciones/ofrendas', roomController.getDonaciones);//funciona

roomRouter.post("/reservaciones", reservacionController.createReservacion);
roomRouter.get("/reservaciones/:id", roomController.getReservacionById);
roomRouter.put("/reservaciones/:id", roomController.editReservacion);
roomRouter.get(
  "/reservaciones/huesped/:id",
  roomController.getReservacionByIdHuespedActiva
);
//roomRouter.get("/getreservacion", roomController.getReservaciones);

roomRouter.get('/habitacion/lugar/:id_lugar', roomController.getHabitacionPorLugar);
roomRouter.put("/reservaciones/switchCama/:id", reservacionController.switchCama);
roomRouter.put("/reservaciones/darAlta/:id", reservacionController.darAltaService);
roomRouter.get("/reservaciones/activa/cama/:id", reservacionController.getReservacionActivaByIdCama);
roomRouter.get("/reservaciones/acompanante/:id", reservacionController.getAcompanantesByReservacion);  
roomRouter.get("/reservacionesActivas/", reservacionController.getReservacionesActivas);

roomRouter.get('/reservaciones', roomController.getReservaciones);

roomRouter.get('/getreservacion/:id', roomController.getCamasHuesped);

//roomRouter.get('/huespedPorGenero/hombres', roomController.getGeneros);
roomRouter.get('/reservaciones/huespedPorGenero/hombres', roomController.getHombres);
roomRouter.get('/reservaciones/huespedPorGenero/mujeres', roomController.getMujeres);

module.exports = roomRouter;
