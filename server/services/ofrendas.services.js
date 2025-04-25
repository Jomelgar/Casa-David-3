const { Ofrenda } = require("../models/reservaciones");

exports.getAllOfrendas = async () => {
  const ofrendas = await Ofrenda.findAll();
  return ofrendas;
};

exports.getOfrendaById = async (id) => {
  const ofrenda = await Ofrenda.findByPk(id);
  return ofrenda;
};

exports.getOfrendasByFecha = async (fecha_inicio, fecha_final) => {
  const ofrendas = await Ofrenda.findAll({
    where: {
      fecha: {
        [Op.between]: [fecha_inicio, fecha_final],
      },
    },
  });
  return ofrendas;
};

exports.createOfrenda = async (ofrendaData) => {
  const nuevaOfrenda = await Ofrenda.create(ofrendaData);
  return nuevaOfrenda;
};

exports.updateOfrenda = async (id, ofrendaData) => {
  const ofrenda = await Ofrenda.findByPk(id);
  ofrenda.set(ofrendaData);
  await ofrenda.save();
  return ofrenda;
};

exports.deleteOfrenda = async (id) => {
  const ofrenda = await Ofrenda.findByPk(id);
  await ofrenda.destroy();
  return ofrenda;
};

exports.getOfrendasByReservacion = async (id_reservacion) => {
  const ofrendas = await Ofrenda.findAll({
    where: {
      id_reservacion,
    },
  });
  return ofrendas;
};
