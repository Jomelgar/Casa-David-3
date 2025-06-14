const {Departamento} = require('../models/departamento')
const {Municipio} = require('../models/persona');
const sequelize = require('../db');

exports.getAllDepartamento = async () => {
    const departamentos = await Departamento.findAll();
    return departamentos;
}

exports.getDepartamentoById = async (id) => {
    const departamento = await Departamento.findByPk(id);
    return departamento;
};

exports.setDepartamentoMunicipio = async (data) => {
    try {
        const idPais = data.ID;

        for (const departamentoNombre of Object.keys(data)) {
            if (departamentoNombre === "ID") continue;

            const departamento = await Departamento.create({
                nombre: departamentoNombre,
                id_pais: idPais
            });

            const departamentoId = departamento.dataValues.departamento_id;

            for (const municipioNombre of data[departamentoNombre]) {
                await Municipio.create({
                nombre: municipioNombre,
                departamento_id: departamentoId
                });
            }
        }

        return { success: true, message: "Departamentos y municipios insertados correctamente." };
  } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "Error al insertar datos.", error };
  }
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

exports.getDepartamentoByPais = async(id) => 
{
    const departamentos = await Departamento.findAll({
        where: { id_pais : id, activo : true}
    });
    return departamentos;
}

exports.setDepartamento = async(data)=>
{
    const departamento = await Departamento.create(
    {
            nombre: data.nombre,
            id_pais: data.id_pais
    })
    return departamento;
}

exports.deleteDepartamento = async(id) => 
{
  try {
    await sequelize.query('CALL public.eliminarDepto(:ID);', {
      replacements: { ID: Number(id) },
    });
    return true;
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    throw error;
  }
}