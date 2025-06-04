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

exports.setMunicipio = async(req,res) =>
{
    try {
        const data = req.body;
        const municipio = await municipioService.setMunicipio(data);
        res.status(200).json(municipio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMunicipio = async(req,res) => 
{
    try {
        const id = req.params.id;
        const value = await municipioService.deleteMunicipio(id);
        if(value) res.status(200).json({message: "Succesful elimination of municipio."});
    } catch (error) {
        
    }
}