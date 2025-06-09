const pService = require('../services/paisService');

exports.getAllPais = async (req, res) => {
    const id_pais = req.params.id;
    try {
        const paises = await pService.getDepartamentosConMunicipiosPorPais(id_pais);
        res.status(200).json(paises);
        return res;
    } catch (error) {
        res.status(500).json({
            message: 'Error to obtains departments and municipalities by country',
            error: error.message
        });
        return res;
    }
};

exports.getPaisById = async (req, res) => {
    const { id } = req.params;
    try {
        const pais = await pService.getPaisById(id);
        if (!pais) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.status(200).json(pais);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving country', error });
    }
};

exports.createPais = async (req, res) => {
    const { nombre, divisa,codigo_iso,formato_dni,referencia_telefonica } = req.body;
    try {
        const pais = await pService.createPais({ nombre, divisa,codigo_iso,formato_dni,referencia_telefonica});
        res.status(201).json(pais);
    } catch (error) {
        res.status(500).json({ message: 'Error creating country', error });
    }
}

exports.deletePais = async (req, res) => {
  const { id } = req.params;

  try {
    await pService.deletePais(id);
    return res.status(200).json({ message: 'País eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error eliminando el país.',
      error: error.message || error,
    });
  }
};


exports.getAllPaisesForTable = async (req, res) => {
    try {
        const paises = await pService.getAllPaisesForTable();
        res.status(200).json(paises);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving countries for table', error });
    }
};

exports.updatePais = async(req,res) => 
{
    try {
        const id = req.params.id;
        const data = req.body;
        const pais = await pService.updatePais(id,data);
        res.status(200).json(pais);
    } catch (error) {
        res.status(500).json({message: 'Error updating country',error})
    }        
}

exports.getCodigoIso = async(req, res) =>
{
    const { id } = req.params;
    try {
        const codigo_iso = await pService.getCodigoIso(id);
        if (!codigo_iso) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.status(200).json(codigo_iso);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving country', error });
    }
}