const municipioService = require('../services/municipioService');


exports.getAllMunicipio = async (req, res) => {
    try {
        const municipios = await municipioService.getAllMunicipio();
        res.status(201).json(municipios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getMunicipioById = async (req, res) => {
    try {
        const idMunicipio = req.params.id;
        const municipio = await municipioService.getMunicipioById(idMunicipio);
        res.status(201).json(municipio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllMunicipiosByDepartamentoId = async (req, res) => {
    try {
        const idDepartamento = req.params.id;
        const municipios = await municipioService.getAllMunicipiosByDepartamentoId(idDepartamento);
        res.status(201).json(municipios);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
