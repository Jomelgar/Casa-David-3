const departamentoService = require('../services/departamentoService');


exports.getAllDepartamento = async (req, res) => {
    try {
        const departamentos = await departamentoService.getAllDepartamento();
        res.status(200).json(departamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getDepartamentoById = async (req, res) => {
    try {
        const idDepartamento = req.params.id;
        const departamento = await departamentoService.getDepartamentoById(idDepartamento);
        res.status(200).json(departamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.setDepartamentoMunicipio = async (req, res) => {
    try {
        const data = req.body;
        const result = await departamentoService.setDepartamentoMunicipio(data);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getDepartamentoByMunicipioId = async (req, res) => {
    try {
        const municipio_id = req.params.id;
        const departamento = await departamentoService.getDepartamentoByMunicipioId(municipio_id);
        res.status(200).json(departamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getDepartamentoByPais = async(req,res)=>
{
    try {
        const id_pais = req.params.id;
        const departamento = await departamentoService.getDepartamentoByPais(id_pais);
        res.status(200).json(departamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.setDepartamento = async(req,res)=>
{
    try {
        const data = req.body;
        const departamento = await departamentoService.setDepartamento(data);
        res.status(200).json(departamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteDepartamento= async(req,res) => 
{
    try {
        const id = req.params.id;
        const isOkey =await departamentoService.deleteDepartamento(id);
        if(isOkey) res.status(200).json({message: `Great delete on ${id}`});
        else res.status(501).json({message: `Error at deleting on ${id}`});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}