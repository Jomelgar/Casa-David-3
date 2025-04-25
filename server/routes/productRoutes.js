const { Router } = require("express");

const Product = require("../controllers/productController");
const ProductRouter = Router();
//pago
ProductRouter.post('/pago', Product.createPago);//funciona
ProductRouter.get('/pago/:id', Product.getpagoById);//funciona
ProductRouter.get('/pago', Product.getpagosByFecha);//funciona


//reglas
ProductRouter.post("/reglas", Product.createRegla); //funciona
ProductRouter.get("/reglas/:id", Product.getReglaById); //funciona
ProductRouter.get("/reglamento", Product.getReglamento); //funciona
ProductRouter.put("/reglas/:id", Product.editRegla); //funciona

//hospitales
ProductRouter.post("/hospitales", Product.createHospital); //funciona
ProductRouter.get("/hospitales/:id", Product.getHospitalById); //funciona
ProductRouter.get("/hospitales", Product.getHospitales); //funciona
ProductRouter.delete("/hospitales/:id", Product.deleteHospitalById); //funciona

//pisos
ProductRouter.post("/pisos", Product.createPiso); //funciona
ProductRouter.get("/pisos/:id", Product.getPisoById); //funciona
ProductRouter.get("/pisos", Product.getAllPisos); //funciona
ProductRouter.get("/pisos/hospital/:id", Product.getPisosByHospital); //funciona

//salas
ProductRouter.post("/salas", Product.createSala); //funciona
ProductRouter.get("/salas/:id", Product.getSalaById); //funciona
ProductRouter.get("/salas", Product.getAllSalas); //funciona
ProductRouter.get("/salas/piso/:id", Product.getSalasByPiso); //funciona

module.exports = ProductRouter;
