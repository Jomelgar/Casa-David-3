const { Procedencia } = require('../models/persona')
const Municipio = require('../models/municipio')

/**@deprecated */
exports.crearProcedencia = async (req) => {
   const { id_procedencia, departamento, municipio } = req.body;
   const nuevaProcedencia = await Procedencia.create({
      id_procedencia,
      departamento,
      municipio,
   })

   return nuevaProcedencia
}

exports.getAllProcedencia = async () => {
   const procedencias = await Municipio.findAll();
   return procedencias
}

exports.getProcedencia = async (req) => {
   const { id } = req.params;
   const ocupacion = await Municipio.findOne({
      where: {
         id_municipio: id
      }
   })
   return ocupacion
}

/**
 * @deprecated
 */
exports.editarProcedencia = async (req) => {
   const { id } = req.params;
   const { departamento, municipio } = req.body
   const unaProcedencia = await Procedencia.findByPk(id)
   unaProcedencia.departamento = departamento;
   unaProcedencia.municipio = municipio;
   await unaProcedencia.save()
   return unaProcedencia
}

/** @deprecated */
exports.eliminarProcedencia = async (req, res) => {
   const { id } = req.params;
   await Procedencia.destroy({
      where: {
         id_procedencia: id,
      }
   })

}