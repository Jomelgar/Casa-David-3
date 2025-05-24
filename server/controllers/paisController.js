const pService = require('../services/paisService');

exports.getAllPais = async (req, res) => {
    try {
        const paises = await pService.getAllPais();
        res.status(200).json(paises);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving countries', error });
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
    const { nombre, divisa } = req.body;
    try {
        const pais = await pService.createPais({ nombre, divisa });
        res.status(201).json(pais);
    } catch (error) {
        res.status(500).json({ message: 'Error creating country', error });
    }
}

exports.getAllPaisesForTable = async (req, res) => {
    try {
        const paises = await pService.getAllPaisesForTable();
        res.status(200).json(paises);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving countries for table', error });
    }
};
