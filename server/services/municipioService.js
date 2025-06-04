const {Municipio} = require('../models/persona')

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

exports.setMunicipio = async(data) => 
{
    const municipio = await Municipio.create({
        nombre: data.nombre,
        departamento_id: data.departamento_id
    });
    return municipio;
}

exports.deleteMunicipio = async(id) => 
{
    const value = Municipio.update({activo: false},{where: {municipio_id: id}});
    return value;
} 