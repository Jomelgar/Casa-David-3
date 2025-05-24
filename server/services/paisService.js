const {Pais} = require('../models/pais');
const {Hospital} = require('../models/hospital');
const {Lugar} = require('../models/persona');
const Sequelize = require('sequelize');

exports.getAllPais = async () => {
    const paises = await Pais.findAll();
    return paises;
};

exports.getPaisById = async (id) => { 
    const pais = await Pais.findByPk(id);
    return pais;
};

exports.createPais = async (paisData) => {
    const pais = await Pais.create(paisData);
    return pais;
};

exports.getAllPaisesForTable = async () => {
  const paises = await Pais.findAll({
    attributes: [
      'id_pais',
      'nombre',
      'divisa',
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
