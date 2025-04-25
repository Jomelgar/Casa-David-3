const departamentoService = require('../services/departamentoService');


exports.getAllDepartamento = async (req, res) => {
    try {
        const departamentos = await departamentoService.getAllDepartamento();
        res.status(201).json(departamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getDepartamentoById = async (req, res) => {
    try {
        const idDepartamento = req.params.id;
        const departamento = await departamentoService.getDepartamentoById(idDepartamento);
        res.status(201).json(departamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getDepartamentoByMunicipioId = async (req, res) => {
    try {
        const municipio_id = req.params.id;
        const departamento = await departamentoService.getDepartamentoByMunicipioId(municipio_id);
        res.status(201).json(departamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
