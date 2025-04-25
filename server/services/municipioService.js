const Municipio = require('../models/municipio')

exports.getAllMunicipio = async () => {
    const municipios = await Municipio.findAll();
    return municipios;
}

exports.getMunicipioById = async (id) => {
    const municipio = await Municipio.findByPk(id);
    return municipio;
};

exports.getAllMunicipiosByDepartamentoId = async (id) => {
    const municipios = await Municipio.findAll({
        where: {
            departamento_id: id,
        },
    });
    return municipios;
};
