const {Pais} = require('../models/pais');
const {Hospital} = require('../models/hospital');
const {Lugar,Municipio} = require('../models/persona');
const {Departamento} = require('../models/departamento');
const sequelize = require('../Db');


exports.getDepartamentosConMunicipiosPorPais = async (id_pais) => {
  
  if (!id_pais || isNaN(id_pais)) {
    throw new Error('ID de país inválido');
  }

  const data = await Departamento.findAll({
    where: { 
      id_pais: id_pais,
      activo: true
    },
    attributes: ['departamento_id', 'nombre', 'activo'],
    include: [
      {
        model: Municipio,
        where: { activo: true },
        attributes: ['municipio_id', 'nombre', 'activo']
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
  try {
    await sequelize.query('CALL public.eliminarpais(:ID)', {
      replacements: { ID: id },
    });
    return true;
  } catch (error) {
    console.error('Error al eliminar país:', error);
    throw error;
  }
};


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
      'total_departamentos',
      [sequelize.fn('COUNT', sequelize.literal('DISTINCT "Hospitals"."id_hospital"')), 'num_hospitales'],
      [sequelize.fn('COUNT', sequelize.literal('DISTINCT "Lugars"."id_lugar"')), 'num_casas'],
      [sequelize.fn('COUNT', sequelize.literal('DISTINCT "Departamentos->Municipios"."municipio_id"')), 'num_municipios'],
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
      },
      {
        model: Departamento,
        attributes: [],
        required: false,
        include: [
          {
            model: Municipio,
            attributes: [],
            required: false,
          }
        ]
      }
    ],
    group: [
      'Pais.id_pais',
      'Pais.nombre',
      'Pais.divisa',
      'Pais.codigo_iso',
      'Pais.referencia_telefonica',
      'Pais.formato_dni',
      'Pais.total_departamentos'
    ]
  });

  return paises;
};
