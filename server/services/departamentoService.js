const Departamento = require('../models/departamento')
const Municipio = require('../models/municipio');

exports.getAllDepartamento = async () => {
    const departamentos = await Departamento.findAll();
    return departamentos;
}

exports.getDepartamentoById = async (id) => {
    const departamento = await Departamento.findByPk(id);
    return departamento;
};

exports.getDepartamentoByMunicipioId = async (municipio_id) => {
    const municipio = await Municipio.findByPk(municipio_id);
    if (!municipio) {
        throw new Error('Municipio not found');
    }
    console.log("Se encontro el municipio: ", municipio);
    const departamento = await Departamento.findByPk(municipio.departamento_id);
    return departamento;
};
