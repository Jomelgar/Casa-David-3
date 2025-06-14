require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db");
const port = process.env.PORT || 3001;
process.env.REACT_APP_BACKEND_PORT = port;
const authenticateJWT = require("./middleware/authenticateJWT");
const path = require("path");
const fs = require('fs');
const { Persona, Municipio } = require("./models/persona");
const CausaVisita = require("./models/causaVisita");
const { Usuario } = require("./models/usuario");
const Paciente = require("./models/paciente")
const {Departamento} = require("./models/departamento");
const {Pais} = require("./models/pais");
const paisData = require("./paisData.json");
const departamentoData = require("./departamentoData.json");
const { CambioReserva } = require("./models/reservaciones")

//Routes
const routes = require("./routes/routes");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(authenticateJWT);
app.use(routes);

//Esto puede ir en una ruta, servicio y controlador hola
const initApp = async () => {
  console.log("Testing the database connection..");
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    const devMode = (process.env.DEV_MODE !== undefined) ? process.env.DEV_MODE.trim() === "true" : false;
    console.log("Dev Mode: ", devMode, typeof devMode);
    if (!devMode) {
      console.warn("Running in production mode!");
      app.use(express.static(path.join(__dirname, "../client/build")));

      app.get("*", async (req, res) => {
        //console.log(req);
        res.sendFile(
          path.join(__dirname, "../client/build", "index.html"),
          (err) => {
            if (err) {
              res.status(500).send(err);
            }
          }
        );
      });
    }

    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    console.error("Parent error:", error.parent);
    console.error("Error details:", error);
  }
};

const runSQLFile = async (filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  try {
    await db.query(sql);
    console.log('SQL ejecutado correctamente');
  } catch (error) {
    console.error('Error ejecutando el archivo SQL:', error);
  } 
};

// TODO: Analizar como migrar procedencia_id a municipio_id
const syncDb = async () => {

  // Check amount of departamentos and paises
  const paisCount = await Pais.count();
  const departamentoCount = await Departamento.count();

  console.log("Cantidad de Departamentos: ", departamentoCount)
  if (paisCount === 0) {
    console.log("Syncing all map data...")
    await Pais.sync({ force : true });
    await Departamento.sync({ force: true });
    await Municipio.sync({ force: true });

    //Try to add triggers in the database
    runSQLFile(path.join(__dirname ,'./SQL/functions.sql'));

    for(const pais of Object.keys(paisData)){
        console.log("Creating pais: ", pais);
        const newPais = await Pais.create({
          nombre: pais,
          codigo_iso: paisData[pais]["codigo_iso"],
          divisa: paisData[pais]["divisa"],
          referencia_telefonica: paisData[pais]["referencia_telefonica"],
          formato_dni: paisData[pais]["formato_dni"]
        });
        const idPais = newPais.dataValues.id_pais;
        for (const departamento of Object.keys(departamentoData[pais])) {
          console.log("----------")
          console.log("Creating departamento: ", departamento);
          const newDepartamento = await Departamento.create({
            nombre: departamento,
            id_pais: idPais
          });
          const id = newDepartamento.dataValues.departamento_id;
          console.log(`Departamento ${departamento} created with id ${id}`);
          for (const municipio of departamentoData[pais][departamento]) {
            const municipioId = await Municipio.create({
              nombre: municipio,
              departamento_id: id,
            });
          }
        }
    }
  };

  // Crear causa de visitas
  console.log("Updating causas...")

  const causasVisitaPredeterminadas = [
    { value: 1, label: "Consulta Médica" },
    { value: 2, label: "Ingresado Por Accidente" },
    { value: 3, label: "Igresado Por Enfermedad" },
    { value: 4, label: "Recien Nacido" },
    { value: 5, label: "Quimioterapia O Radioterapia" },
    { value: 6, label: "Cirugía Programada" },
    { value: 7, label: "Exámenes Clínicos" },
    { value: 8, label: "Tramites" },
    { value: 9, label: "Dado De Alta, En Recuperacón" },
  ];

  for (const causa of causasVisitaPredeterminadas) {
    await CausaVisita.findOrCreate({
      where: {
        causa: causa.label,
      },
      defaults: { causa: causa.label },
    })
  };

  console.log("Finished sync!")
};


db.sync({
  force: false, alter: false
})
  .then(() => {
    console.log("Database synced without altering existing schema!");
    console.log("Updating Municipio and Departamento data...");


    syncDb();
  })
  .catch((error) => {
    console.error("Error syncing database:", error.message);
    console.error("Parent error:", error.parent);
    console.error("Error details:", error);
  });

initApp();
