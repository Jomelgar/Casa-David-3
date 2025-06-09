const ExcelJS = require('exceljs');
const serviceExcel = require("../services/excelService");
const dayjs = require('dayjs'); 
const Departamento = require("../models/departamento");
const Paciente = require("../models/paciente");
const { Persona,Municipio } = require("../models/persona");

function _calculateAge(birthday) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // milliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function handleNull(value, customMessage = 'N/A') {
  return value === null || value === undefined ? customMessage : value;
}


exports.generateExcelAllTables = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    worksheet.columns = [
      { header: 'Marca Temporal', key: 'marca', width: 30 },
      { header: 'Nombre Completo del Huesped', key: 'nombre', width: 40 },
      { header: 'Numero de Identidad', key: 'dni', width: 30 },
      { header: 'Lugar de Procedencia', key: 'procedencia', width: 30 },
      { header: 'Telefono', key: 'telefono', width: 25 },
      { header: 'Sexo', key: 'genero', width: 20 },
      { header: 'Edad', key: 'edad', width: 20 },
      { header: 'Profesion u oficio', key: 'ocupacion', width: 30 },
      { header: 'Iglesia', key: 'iglesia', width: 40 },
      { header: 'Nombre Completo del Afiliado', key: 'nombreAfiliado', width: 40 },
      { header: 'Numero de Identidad del Afiliado', key: 'dniAfiliado', width: 30 },
      { header: 'Patrono', key: 'patrono', width: 30 },
      { header: 'Nombre del Paciente', key: 'nombrePaciente', width: 40 },
      { header: 'Hospital en el que se ubica', key: 'hospital', width: 40 },
      { header: 'Parentesco con el Paciente', key: 'parentesco', width: 30 },
      { header: 'Telefono del Paciente', key: 'telefonoPaciente', width: 25 },
      { header: 'Causa de visita al IHSS', key: 'causa', width: 40 },
      { header: 'Observaciones', key: 'observaciones', width: 40 }
    ];




    const response = await serviceExcel.getDataForExcel();

    const arrayData = response[0].map((item, index) => {
      console.log(item.fecha_nacimiento_huesped);

      return {
        marca: item.fecha_entrada,
        nombre: `${handleNull(item.primer_nombre_huesped)} ${handleNull(item.segundo_nombre_huesped)} ${handleNull(item.primer_apellido_huesped)} ${handleNull(item.segundo_apellido_huesped)}`,
        dni: item.dni_huesped,
        procedencia: item.departamento_huesped,
        telefono: handleNull(item.telefono_huesped, 'N/A'),
        genero: item.genero_huesped,
        edad: item.fecha_nacimiento_huesped ? _calculateAge(new Date(item.fecha_nacimiento_huesped)) : 'N/A',
        ocupacion: handleNull(item.ocupacion_huesped, 'N/A'),
        iglesia: handleNull(item.iglesia, 'N/A'),
        nombreAfiliado: handleNull(item.nombre_afiliado, 'N/A'),
        dniAfiliado: handleNull(item.dni_afiliado, 'N/A'),
        patrono: handleNull(item.nombre_patrono, 'N/A'),
        nombrePaciente: `${handleNull(item.primer_nombre_paciente)} ${handleNull(item.segundo_nombre_paciente)} ${handleNull(item.primer_apellido_paciente)} ${handleNull(item.segundo_apellido_paciente)}`,
        hospital: handleNull(item.hospital_nombre, 'N/A'),
        parentesco: handleNull(item.parentesco_paciente, 'N/A'),
        telefonoPaciente: handleNull(item.telefono_paciente, 'N/A'),
        causa: item.causa_visita,
        observaciones: handleNull(item.observaciones, 'N/A')
      };
    });


    worksheet.addRows(arrayData);

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: 'Roboto', size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: 'Roboto', size: 14, bold: true, color: { argb: 'FFFFFF' } };

    headerRow.eachCell((cell, colNumber) => {
      if (cell.value) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: "ff77d9a1" }
        };
      }
    });

    worksheet.views = [
      { state: 'frozen', ySplit: 1 }
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte.xlsx');
    await workbook.xlsx.write(res);
    res.end();

    console.log('File write done.');
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('Error generating Excel file');
  }
};

exports.getReportesGenerales = async (req, res) => {
  try {
    const { fechaInicio, fechaFinal, hombreInfo, mujerInfo, moneda, divisa, donaciones, primeraVez, hospedadosDia, camasCortesia } = req.body;
    console.log(req.body);

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hoja1');

    // Llenar las celdas superiores
    worksheet.getCell('A1').value = 'Huespedes';
    worksheet.getCell('B1').value = 'Donaciones';
    worksheet.getCell('C1').value = 'Camas Ocupadas';
    worksheet.getCell('D1').value = 'Camas Cortesía';
    worksheet.getCell('E1').value = 'Promedio de Hospedados/Dia';
    worksheet.getCell('F1').value = 'Primera Vez';

    worksheet.getCell('A2').value = hombreInfo.length + mujerInfo.length;
    worksheet.getCell('B2').value = `${divisa} ${donaciones}`;
    worksheet.getCell('C2').value = hombreInfo.length + mujerInfo.length;
    worksheet.getCell('D2').value = camasCortesia;
    worksheet.getCell('E2').value = hospedadosDia;
    worksheet.getCell('F2').value = primeraVez;

    // Set BG and bold font and 14 size
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'];
    headerCells.forEach(cell => {
      worksheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '77d9a1' }
      };
      worksheet.getCell(cell).font = { bold: true, size: 14 };
    });

    // Agregar fila vacía
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Encabezados para las filas dinámicas
    worksheet.addRow(['DNI', 'Nombre', 'Fecha Nacimiento', 'Procedencia', 'Fecha Ingreso', 'Fecha Salida', 'Nombre Paciente', 'Observacion']);

    // Cambiar ancho y agregarle un fondo verde
    worksheet.columns = [
      { key: 'A', width: 20 },
      { key: 'B', width: 30 },
      { key: 'C', width: 20 },
      { key: 'D', width: 30 },
      { key: 'E', width: 20 },
      { key: 'F', width: 20 },
      { key: 'G', width: 20 },
      { key: 'H', width: 30 },
    ];

    const dynamicHeaderCells = ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5'];
    dynamicHeaderCells.forEach(cell => {
      worksheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '77d9a1' }
      };
      worksheet.getCell(cell).font = { bold: true, size: 14 };
    });

    const datos = [...hombreInfo, ...mujerInfo];
    for (const dato of datos) {
      const persona = dato.PacienteHuesped.Huesped.Persona;
      const fechaNacimiento = dayjs(persona.fecha_nacimiento).format('DD-MM-YYYY');
      const fechaEntrada = dayjs(dato.PacienteHuesped.fecha_entrada).format('DD-MM-YYYY');
      const fechaSalida = dayjs(dato.PacienteHuesped.fecha_salida).format('DD-MM-YYYY');

      const municipio = await Municipio.findOne({ where: { municipio_id: persona.municipio_id }, include: Departamento });
      const paciente = await Paciente.findOne({ where: { id_paciente: dato.PacienteHuesped.id_paciente }, include: Persona });
      const d = [
        persona.dni,
        `${persona.primer_nombre} ${persona.primer_apellido}`,
        fechaNacimiento,
        `${municipio.nombre}, ${municipio.Departamento.nombre}`,
        fechaEntrada,
        fechaSalida,
        `${paciente.Persona.primer_nombre} ${paciente.Persona.primer_apellido}`,
        (persona.observacion) ? persona.observacion : '-VACÍO-'
      ];
      console.log("Agregando fila: ", d);
      worksheet.addRow(d);
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte.xlsx');
    await workbook.xlsx.writeBuffer().then(buffer => {
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getDataExcel = async (req, res) => {
  try {
    const response = await serviceExcel.getDataForExcel();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*exports.excelPagosGenerales = async (req, res) => {
  try {
    const { donaciones, cortesia, datosPagos } = req.body;

    const workbook = new ExcelJS.Workbook();
    workbook.getCell("A1").value = "Donaciones";
    workbook.getCell("B1").value = "Cortesía";
    workbook.getCell("C1").value = "Total";

    workbook.getCell("A2").value = donaciones;
    workbook.getCell("B2").value = cortesia;
    workbook.getCell("C2").value = donaciones + cortesia;

    for (const header of ["A1", "B1", "C1"]) {
      workbook.getCell(header).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '77d9a1' }
      };
      workbook.getCell(header).font = { bold: true, size: 14 };
    }


    workbook.addRow([]);
    workbook.addRow([]);

    worksheet.columns = [
      { key: 'A', width: 20 },
      { key: 'B', width: 30 },
      { key: 'C', width: 20 },
      { key: 'D', width: 30 },
      { key: 'E', width: 10 },
      { key: 'F', width: 20 },
    ];

    const headers = ["A5", "B5", "C5", "D5", "E5", "F5"];

    for (const header of headers) {
      workbook.getCell(header).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '77d9a1' }
      };
      workbook.getCell(header).font = { bold: true, size: 14 };
    }
    workbook.addRow(["Nombre Huesped", "DNI", "Fecha Pago", "No. Recibo", "Monto", "Observación"]);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte.xlsx');
    await workbook.xlsx.writeBuffer().then(buffer => {
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    });

  } catch (error) {
    res.status(500).json({ error: (error.message) ? error.message : "Ha ocurrido un error desconocido." });
  }

}
*/


exports.excelPagosGenerales = async (req, res) => {
  try {
    const { donaciones, cortesia, datosPagos, moneda, divisa } = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pagos');

    worksheet.getCell("A1").value = "Donaciones";
    worksheet.getCell("B1").value = "Cortesía";
    worksheet.getCell("C1").value = "Total";

    worksheet.getCell("A2").value = `${divisa} ${donaciones}`;
    worksheet.getCell("B2").value = `${divisa} ${cortesia}`;
    worksheet.getCell("C2").value = `${divisa} ${donaciones + cortesia}`;

    for (const header of ["A1", "B1", "C1"]) {
      worksheet.getCell(header).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '77d9a1' }
      };
      worksheet.getCell(header).font = { bold: true, size: 14 };
    }

    worksheet.addRow([]);
    worksheet.addRow([]);

    worksheet.columns = [
      { key: 'A', width: 20 },
      { key: 'B', width: 30 },
      { key: 'C', width: 20 },
      { key: 'D', width: 30 },
      { key: 'E', width: 10 },
      { key: 'F', width: 20 },
    ];

    const headers = ["A5", "B5", "C5", "D5", "E5", "F5"];

    for (const header of headers) {
      worksheet.getCell(header).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '77d9a1' }
      };
      worksheet.getCell(header).font = { bold: true, size: 14 };
    }

    worksheet.getCell("A5").value = "Nombre Huesped";
    worksheet.getCell("B5").value = "DNI";
    worksheet.getCell("C5").value = "Fecha Pago";
    worksheet.getCell("D5").value = "No. Recibo";
    worksheet.getCell("E5").value = `Monto en ${moneda}`;
    worksheet.getCell("F5").value = "Observación";


    datosPagos.forEach((pago) => {
      worksheet.addRow([
        pago.nombre,
        pago.dni,
        pago.fecha,
        pago.recibo,
        `${divisa} ${pago.valor}`,
        pago.observacion || 'N/A'
      ]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Pagos.xlsx');
    await workbook.xlsx.writeBuffer().then(buffer => {
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    });

  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ error: error.message || "Ha ocurrido un error desconocido." });
  }
};

exports.generateDonationExcel = async (req, res) => {
  try {
    const { idHuesped } = req.params;


    const { guestInfo, donations } = await serviceExcel.getGuestInfoAndDonations(idHuesped);

    if (!guestInfo || donations.length === 0) {
      return res.status(404).send("No se encontró información para generar el Excel.");
    }

   
    const guestName = `${guestInfo.primer_nombre} ${guestInfo.segundo_nombre || ""} ${guestInfo.primer_apellido} ${guestInfo.segundo_apellido || ""}`.trim();


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Historial Donaciones");


    worksheet.mergeCells("A1:D1");
    worksheet.getCell("A1").value = `Huésped: ${guestName}`;
    worksheet.getCell("A1").font = { bold: true, size: 16 };
    worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(1).height = 25; 

 
    worksheet.getColumn(1).width = 30; 
    worksheet.getColumn(2).width = 30; 
    worksheet.getColumn(3).width = 30; 
    worksheet.getColumn(4).width = 30;

    const headerRow = worksheet.getRow(2);
    headerRow.values = ["Cantidad", "Fecha", "Recibo", "Observación"];
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "77D9A1" } };
    });


    donations.forEach((donation, index) => {
      const rowIndex = index + 3; 
      const row = worksheet.getRow(rowIndex);
      row.values = [donation.cantidad, donation.fecha, donation.recibo, donation.observacion];
      row.alignment = { vertical: "middle", horizontal: "center" };
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Donaciones_Huesped_${guestName.replace(/ /g, "_")}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    res.status(500).send("Error al generar el archivo Excel.");
  }
};