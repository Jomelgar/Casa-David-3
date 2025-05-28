const {Pais} = require('../models/pais');
const {Hospital} = require('../models/hospital');
const {Lugar,Municipio} = require('../models/persona');
const {Departamento} = require('../models/departamento');
const Sequelize = require('sequelize');

exports.getDepartamentosConMunicipiosPorPais = async (id_pais) => {
  
  if (!id_pais || isNaN(id_pais)) {
    throw new Error('ID de país inválido');
  }

  const data = await Departamento.findAll({
    where: { 
      id_pais: id_pais,
      activo: true
    },
    attributes: ['id_departamento', 'nombre', 'activo'],
    include: [
      {
        model: Municipio,
        where: { activo: true },
        attributes: ['id_municipio', 'nombre', 'activo']
      }
    ]
  });

  return data;
};


exports.getPaisById = async (id) => { 
    const pais = await Pais.findByPk(id);
    return pais;
};

exports.createPais = async (paisData) => {
    const pais = await Pais.create(paisData);
    return pais;
};

exports.deletePais = async (id) => {
    const pais = await Pais.findByPk(id);
    if (!pais) {
        throw new Error('Pais not found');
    }
    await pais.destroy();
    return pais;
}

exports.getAllPaisesForTable = async () => {
  const paises = await Pais.findAll({
    where: {
      activo: true
    },
    attributes: [
      'id_pais',
      'nombre',
      'divisa',
      'codigo_iso',
      'referencia_telefonica',
      'formato_dni',
      [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "Hospitals"."id_hospital"')), 'num_hospitales'],
      [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "Lugars"."id_lugar"')), 'num_casas'],
    ],
    include: [
      {
        model: Hospital,
        attributes: [],
        required: false,
      },
      {
        model: Lugar,
        attributes: [],
        required: false,
      }
    ],
    group: ['Pais.id_pais', 'Pais.nombre', 'Pais.divisa']
  });

  return paises;
};
