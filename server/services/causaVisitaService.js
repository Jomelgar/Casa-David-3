const sequelize = require("../Db");
const CausaVisita = require("../models/causaVisita");

exports.getAllCausaVisita = async () => {
  const causas = await CausaVisita.findAll();
  return causas;
};

exports.getCausaById = async (id) => {
  const causa = await CausaVisita.findByPk(id);
  return causa;
};

exports.crearCausa = async (data) => {
  const nuevaCausa = await CausaVisita.create(data);
  return nuevaCausa;
};

exports.deleteCausa = async (id) => {
  const borrar = await CausaVisita.destroy({
    where: {
      id_causa_visita: id,
    },
  });
  return borrar;
};

exports.editarCausa = async (id, causa) => {
  const causaEdit = await CausaVisita.update(causa, {
    where: { id_causa_visita: id },
  });

  if (causaEdit) {
    const edited = await Afiliado.findOne({
      where: { id_causa_visita: id },
    });
    return edited;
  }
};
