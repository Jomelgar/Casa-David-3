const express = require('express');
const excelController = require('../controllers/excelController');
const router = express.Router();

//router.get('/download-excel', downloadExcel);'
router.get("/downloadExcel", excelController.generateExcelAllTables)
router.get("/getData", excelController.getDataExcel)
router.post("/reportesExcel", excelController.getReportesGenerales)
router.post("/excelPagosGenerales", excelController.excelPagosGenerales)
router.get('/downloadDonations/:idHuesped', excelController.generateDonationExcel);
module.exports = router;
