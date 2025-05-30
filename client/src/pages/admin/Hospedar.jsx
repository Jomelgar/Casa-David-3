import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../context/LayoutContext";
//Date Imports
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
//api imports
import OcupacionesApi from "../../api/Ocupaciones.api";
import ProcedenciaApi from "../../api/Procedencia.api";
import ReservacionesApi from "../../api/Reservaciones.api";
import hospitalesApi from "../../api/Hospitales.api";
import pisosApi from "../../api/Piso.api";
import SalasApi from "../../api/Salas.api";
import CausaVisitaApi from "../../api/CausaVisita.api";

import camaApi from "../../api/Cama.api";
import personaApi from "../../api/Persona.api";
import solicitudApi from "../../api/Solicitud.api";
import huespedApi from "../../api/Huesped.api";
import pacienteApi from "../../api/Paciente.api";
import pacienteHuespedApi from "../../api/pacienteHuesped.api";
import { getDepartamentos } from "../../api/departamentoApi";
import { getMunicipiosByDepartamentoId } from "../../api/municipioApi";
import { getMunicipioById } from "../../api/municipioApi";

import { getAllCausas } from "../../api/CausaVisita.api";

import { FileSearchOutlined, TeamOutlined } from "@ant-design/icons";

import { getUserFromToken } from "../../utilities/auth.utils";
//antd imports
import {
  Card,
  DatePicker,
  ConfigProvider,
  Flex,
  Layout,
  Input,
  Col,
  Row,
  Select,
  Button,
  Modal,
  message,
  Checkbox,
} from "antd";
//antd icon imports
import {
  LockOutlined,
  PushpinOutlined,
  PhoneOutlined,
  IdcardOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Disponibilidad from "../../components/Disponiblidad/Disponibilidad";
import InformacionPaciente from "../../components/Hospedaje/InformacionPaciente";
import PatronoHuesped from "../../components/Hospedaje/PatronoHuesped";

import ListaSolicitudApi from "../../api/ListaSolicitud.api";

import PatronoApi from "../../api/Patrono.api";
import ListaNegraApi from "../../api/ListaNegra.api";
import Cookie from "js-cookie";

const { Meta } = Card;
const { TextArea } = Input;
const { Content } = Layout;
const { Option } = Select;

dayjs.extend(customParseFormat);

const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

//Regex formats
const dateFormat = "DD-MM-YYYY";
const telFormat = /\d{4}-\d{4}/;
const dniFormat = /^\d{4}-\d{4}-\d{5}$/;

const regexFecha = /^\d{4}-\d{2}-\d{2}$/;

const generos = [
  { value: 1, label: "Femenino" },
  { value: 2, label: "Masculino" },
];

const roles = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Usuario" },
];

// Array con causas de visita predeterminadas
// TODO: Fetchear de la DB.
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

function Hospedar() {
  // Espacio para guardar los datos vacios de los formularios
  const [emptyFieldsHuesped, setEmptyFieldsHuesped] = useState({});
  const [emptyFieldsPaciente, setEmptyFieldsPaciente] = useState({});
  const [emptyFieldsAcompanante, setEmptyFieldsAcompanante] = useState({});

  const [hayAcompanante, setHayAcompanante] = useState(false);

  //para drop options de ocupaciones y procedencias
  const [ocupaciones, setOcupaciones] = useState([]);
  const [procedencias, setProcedencias] = useState([]);
  const [loading, setLoading] = useState(false);
  //para los pop ups & errores
  const { openNotification, setCurrentPath } = useLayout();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInfoPacienteEditable, setIsInfoPacienteEditable] = useState(true);
  //c onst [existPerson, setExistPerson] = useState(false);
  const [existHospedado, setExistHospedado] = useState(false);
  const [hospedado, setHospedado] = useState({});
  const [paciente, setPaciente] = useState({});
  const [acompanante, setAcompanante] = useState(false);

  const [searchOcupacion, setSearchOcupacion] = useState("");
  const [searchProcedencia, setSearchProcedencia] = useState("");

  const [camasDisponiblesHombres, setCamasDisponiblesHombres] = useState(0);
  const [camasDisponiblesMujeres, setCamasDisponiblesMujeres] = useState(0);

  const [noSolicitudesHombrs, setNoSolicitudesHombres] = useState(0);
  const [noSolicitudesMujeres, setNoSolicitudesMujeres] = useState(0);

  const [contenModal, setContentModal] = useState("");

  const [contentModalNegra, setContentModalNegra] = useState("");
  const [listaNegraModalVisible, setListaNegraModalVisible] = useState(false);

  const [observacionReservacion, setObservacionReservacion] = useState("");

  const [isChecked, setIsChecked] = useState(false); // Para el checkbox de que se marca que el acompanate es paciente

  ////////////Cambios para municipio y departamento
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedDepartamentoHuesped, setSelectedDepartamentoHuesped] =
    useState(null);
  const [selectedDepartamentoAcompanante, setSelectedDepartamentoAcompanante] =
    useState(null);
  const [selectedDepartamentoPaciente, setSelectedDepartamentoPaciente] =
    useState(null);
  const [selectedMunicipioHuesped, setSelectedMunicipioHuesped] =
    useState(null);
  const [selectedMunicipioAcompanante, setSelectedMunicipioAcompanante] =
    useState(null);
  const [selectedMunicipioPaciente, setSelectedMunicipioPaciente] =
    useState(null);

  const navigate = useNavigate();

  const { userLog } = useLayout();

  const validateFieldsHuesped = () => {
    const newEmptyFields = {};
    // Checks de huesped (13)
    if (!hospedado.dni) newEmptyFields.dni = true;
    if (!hospedado.id_ocupacion) newEmptyFields.id_ocupacion = true;
    if (!hospedado.primer_nombre) newEmptyFields.primer_nombre = true;
    if (!hospedado.primer_apellido) newEmptyFields.primer_apellido = true;
    if (hospedado.genero !== 1 && hospedado.genero !== 2)
      newEmptyFields.genero = true;
    if (!selectedDepartamentoHuesped) newEmptyFields.departamento_id = true;
    if (!hospedado.municipio_id) newEmptyFields.municipio_id = true;
    if (!hospedado.direccion) newEmptyFields.direccion = true;
    if (!hospedado.fecha_nacimiento) newEmptyFields.fecha_nacimiento = true;
    if (!hospedado.telefono) newEmptyFields.telefono = true;

    // Cosas mas abajo del form de huesped
    if (!hospedado.fecha_entrada) newEmptyFields.fecha_entrada = true;
    if (!hospedado.fecha_salida) newEmptyFields.fecha_salida = true;

    setEmptyFieldsHuesped(newEmptyFields);
    return Object.keys(newEmptyFields).length === 0;
  };

  const validateFieldsPaciente = () => {
    const newEmptyFields = {};
    // Checks de paciente (13)
    if (!paciente.dni) newEmptyFields.dni = true;
    console.log("Paciente dni: ", paciente.dni);
    if (!paciente.id_ocupacion) newEmptyFields.id_ocupacion = true;
    if (!paciente.primer_nombre) newEmptyFields.primer_nombre = true;
    if (!paciente.primer_apellido) newEmptyFields.primer_apellido = true;
    if (paciente.genero !== 1 && paciente.genero !== 2)
      newEmptyFields.genero = true;
    if (!selectedDepartamentoPaciente) newEmptyFields.departamento_id = true;
    if (!paciente.municipio_id) newEmptyFields.municipio_id = true;
    if (!paciente.direccion) newEmptyFields.direccion = true;
    if (!paciente.fecha_nacimiento) newEmptyFields.fecha_nacimiento = true;
    if (!paciente.telefono) newEmptyFields.telefono = true;
    if (!paciente.id_hospital) newEmptyFields.id_hospital = true;
    if (!paciente.id_piso) newEmptyFields.id_piso = true;
    if (!paciente.id_sala) newEmptyFields.id_sala = true;
    if (!paciente.parentesco) newEmptyFields.parentesco = true;
    if (!paciente.id_causa_visita) newEmptyFields.id_causa_visita = true;

    setEmptyFieldsPaciente(newEmptyFields);
    return Object.keys(newEmptyFields).length === 0;
  };

  const validateFieldsAcompanante = () => {
    if (hayAcompanante) {
      const newEmptyFields = {};
      // Checks de acompanante (13)
      if (!acompanante.dni) newEmptyFields.dni = true;
      if (!acompanante.id_ocupacion) newEmptyFields.id_ocupacion = true;
      if (!acompanante.primer_nombre) newEmptyFields.primer_nombre = true;
      if (!acompanante.primer_apellido) newEmptyFields.primer_apellido = true;
      if (acompanante.genero !== 1 && paciente.genero !== 2)
        newEmptyFields.genero = true;
      if (!selectedDepartamentoAcompanante)
        newEmptyFields.departamento_id = true;
      if (!acompanante.municipio_id) newEmptyFields.municipio_id = true;
      if (!acompanante.direccion) newEmptyFields.direccion = true;
      if (!acompanante.fecha_nacimiento) newEmptyFields.fecha_nacimiento = true;
      if (!acompanante.telefono) newEmptyFields.telefono = true;

      setEmptyFieldsAcompanante(newEmptyFields);
      return Object.keys(newEmptyFields).length === 0;
    }
  };
 const [selected, setSelected] = useState("DNI");
  const TipoDocumentoSelector = () => {
  

  return (
    <Row gutter={16} style={{ marginTop: 20 }}>
      <Col>
        <CustomCheckboxButton
          label="Dni"
          selected={selected === "DNI"}
          onClick={() => setSelected("DNI")}
        />
      </Col>
      <Col>
        <CustomCheckboxButton
          label="Dni Extranjero"
          selected={selected === "DNI Extranjero"}
          onClick={() => setSelected("DNI Extranjero")}
        />
      </Col>
      <Col>
        <CustomCheckboxButton
          label="Pasaporte"
          selected={selected === "Pasaporte"}
          onClick={() => setSelected("Pasaporte")}
        />
      </Col>
    </Row>
  );
};

const CustomCheckboxButton = ({ label, selected, onClick }) => {
  return (
    <label
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "#71d9af",
        borderRadius: "20px",
        padding: "8px 16px",
        color: "white",
        width: "220px",
        fontWeight: "bold",
        cursor: "pointer",
        userSelect: "none",
        opacity: selected ? 1 : 0.6,
        border: selected ? "2px solid #4ac2cd" : "2px solid transparent",
      }}
    >
      <span
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: selected ? "#4ac2cd" : "#ccc",
          borderRadius: "6px",
          marginRight: "10px",
          position: "relative",
        }}
      >
        {selected && (
          <span
            style={{
              color: "white",
              fontSize: "14px",
              position: "absolute",
              top: "3px",
              left: "6px",
            }}
          >
            ✔
          </span>
        )}
      </span>
      <span style={{ fontSize: "20px" }}>{label}</span>
    </label>
  );
};



  const CustomCheckboxButtonDni = () => {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "#71d9af",
        borderRadius: "20px",
        padding: "8px 16px",
        color: "white",
        width : "220px",
        fontWeight: "bold",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <input type="checkbox" defaultChecked style={{ display: "none" }} />
      <span
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "#4ac2cd",
          borderRadius: "6px",
          marginRight: "10px",
          position: "relative",
        }}
      >
        <span
          style={{
            content: '"✔"',
            color: "white",
            fontSize: "14px",
            position: "absolute",
            top: "3px",
            left: "6px",
          }}
        >
          ✔
        </span>
      </span>
      <span style={{ fontSize: "20px" }}>DNI</span>
    </label>
  );
};

const CustomCheckboxButtonDniExtranjero = () => {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "#71d9af",
        borderRadius: "20px",
        padding: "8px 16px",
        color: "white",
        width : "220px",
        fontWeight: "bold",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <input type="checkbox" defaultChecked style={{ display: "none" }} />
      <span
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "#4ac2cd",
          borderRadius: "6px",
          marginRight: "10px",
          position: "relative",
        }}
      >
        <span
          style={{
            content: '"✔"',
            color: "white",
            fontSize: "14px",
            position: "absolute",
            top: "3px",
            left: "6px",
          }}
        >
          ✔
        </span>
      </span>
      <span style={{ fontSize: "20px" }}>DNI Extrajero</span>
    </label>
  );
};

const CustomCheckboxButtonPasaporte = () => {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "#71d9af",
        borderRadius: "20px",
        padding: "8px 16px",
        color: "white",
        width : "220px",
        fontWeight: "bold",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <input type="checkbox" defaultChecked style={{ display: "none" }} />
      <span
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "#4ac2cd",
          borderRadius: "6px",
          marginRight: "10px",
          position: "relative",
        }}
      >
        <span
          style={{
            content: '"✔"',
            color: "white",
            fontSize: "14px",
            position: "absolute",
            top: "3px",
            left: "6px",
          }}
        >
          ✔
        </span>
      </span>
      <span style={{ fontSize: "20px" }}>Pasaporte</span>
    </label>
  );
};


  const usuario = getUserFromToken();

  const [hospitales, setHospitales] = useState([]);
  const [searchHospital, setSearchHospital] = useState("");

  const [pisos, setPisos] = useState([]);
  const [searchPiso, setSearchPiso] = useState("");

  const [salas, setSalas] = useState([]);
  const [searchSala, setSearchSala] = useState("");

  //const [causasVisita, setCausasVisita] = useState(causasVisitaPredeterminadas);
  const [causasVisita, setCausasVisita] = useState([]);
  const [searchCausaVisita, setSearchCausaVisita] = useState("");

  // El 2 es por Testing.
  const hospitalesPatronos = [12];

  const loadHospitales = async () => {
    try {
      const response = await hospitalesApi.getHospitalRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las Hospitales");
      }

      if (response.status >= 200 && response.status < 300) {
        setHospitales(
          response.data.map((e) => ({
            value: e.id_hospital,
            label: e.nombre + " , " + e.direccion,
          }))
        );
      } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los hospitales");
      }
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const validarFormatoHospital = () => {
    const hospitalFormat = searchHospital.split(",");

    if (hospitalFormat.length !== 2) {
      // Deberia lanzar una notificacion de error
      openNotification(
        2,
        "Hospital Incorrecta",
        "Formato de hospital invalido\n Ejemplo: Centro de Salud, Barrio Lopez Calle 1234"
      );
      return false;
    }

    return true;
  };

  // Funcion usada para obtener el municipio y el departamento de la persona al ingresar el DNI (si ya existe la persona)
  const fetchMunicipioById = async (municipioId) => {
    try {
      const municipio = await getMunicipioById(municipioId);
      return municipio;
    } catch (error) {
      console.error("Error fetching municipio by ID:", error);
      return null;
    }
  };

  const handleCrearHospital = async () => {
    setLoading(true);
    if (validarFormatoHospital()) {
      // Deberiamos llamar a la api para crear la procedencia;

      try {
        const hospitalFormat = searchHospital.split(",");

        console.log(hospitalFormat);

        const response = await hospitalesApi.postHospitalesRequest({
          nombre: hospitalFormat[0],
          direccion: hospitalFormat[1],
        });

        if (!response || response.status < 200 || response.status >= 300) {
          // Deberia lanzar una notificacion de error
          openNotification(2, "Error", "No se pudo crear el hospital");
          setLoading(false);
          return;
        }

        const id_hospital_creado = response.data.id_hospital;
        openNotification(
          1,
          "Hospital Creado",
          "Se creo el hospital correctamente"
        );

        loadHospitales();

        handleSetChangeHuesped("id_hospital", id_hospital_creado);

        document.getElementById("selectHospitalPaciente").blur();

        // Validar que retorna porque tenemos que asignarle ese id al user
      } catch (error) {
        openNotification(3, "Error", error);
      }
    }

    setLoading(false);
  };

  const loadPisos = async (id_hospital) => {
    try {
      const response = await pisosApi.getPisosRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los pisos");
      }

      if (response.status >= 200 && response.status < 300) {
        if (id_hospital) {
          const pisos = response.data.filter(
            (e) => e.id_hospital === id_hospital
          );

          if (pisos.length === 0) {
            console.log("No hay pisos en este hospital");
            setPisos([]); // Si no hay pisos se pone vacio el array
            return;
          } else {
            console.log("Se cargaron los pisos correctamente. Pisos: ", pisos);
          }

          // Si existen pisos para ese hospital se cargan en el select
          setPisos(
            pisos.map((e) => ({
              value: e.id_piso,
              label: e.nombre_piso,
            }))
          );

          return;
        }
      } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los pisos");
      }
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const handleCrearPiso = async () => {
    //setLoading(true);
    try {
      if (searchPiso === "" || paciente.id_hospital === "") {
        openNotification(
          2,
          "Error",
          "Debe seleccionar un hospital y un nombre de piso"
        );
        return;
      }

      const response = await pisosApi.postTransaccionRequest({
        id_hospital: paciente.id_hospital,
        nombre_piso: searchPiso,
      });

      if (!response || response.status !== 201) {
        // Deberia lanzar una notificacion de error
        openNotification(2, "Error", "No se pudo crear el piso");
        return;
      }

      loadPisos(paciente.id_hospital);
      setSalas([]); // Se limpian las salas porque no hay salas en un piso recien creado
      const id_ocupacion_creada = response.data.id_piso;
      openNotification(0, "Piso Creado", "Se creo la ocupacion correctamente");

      handleSetChangeHuesped("id_piso", id_ocupacion_creada);

      document.getElementById("selectPiso").blur();

      // Validar que retorna porque tenemos que asignarle ese id al user
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const loadSalas = async (id_piso) => {
    try {
      const response = await SalasApi.getSalasRequest();

      if (!response) {
        // deberia lanzar un error
        console.log("No se pudo cargar las salas");
        throw new Error("No se pudo cargar las salas");
      }

      if (response.status >= 200 && response.status < 300) {
        if (id_piso) {
          const salas = response.data.filter((e) => e.id_piso === id_piso);

          if (salas.length === 0) {
            console.log("No hay salas en este piso");
            setSalas([]);
            return;
          }

          // Si existen salas para ese piso se cargan en el select
          setSalas(
            salas.map((e) => ({
              value: e.id_sala,
              label: e.nombre_sala,
            }))
          );

          return;
        }
      } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las salas");
      }
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const loadCausasVisita = async () => {
    try {
      const causas = await getAllCausas();
      setCausasVisita(
        causas.map((causa) => ({
          value: causa.id_causa_visita,
          label: causa.causa,
        }))
      );
    } catch (error) {
      console.error("Error fetching causas de visita:", error);
    }
  };

  const handleCrearCausaVisita = async () => {
    try {
      const response = await CausaVisitaApi.createCausa({
        causa: searchCausaVisita,
      });

      if (!response || response.status < 200 || response.status >= 300) {
        openNotification(2, "Error", "No se pudo crear la causa de visita");
        return;
      }

      openNotification(
        1,
        "Causa de Visita Creada",
        "Se creo la causa de visita correctamente"
      );

      handleSetChangeHuesped("id_causa_visita", response.data.id_causa_visita);

      document.getElementById("selectCausa").blur();
      loadCausasVisita();
    } catch (error) {}
  };

  const handleCrearSala = async () => {
    //setLoading(true);
    try {
      if (searchSala === "" || paciente.id_piso === "") {
        openNotification(
          2,
          "Error",
          "Debe seleccionar un Piso y un nombre de sala"
        );
        return;
      }

      const response = await SalasApi.postSalasRequest({
        id_piso: paciente.id_piso,
        nombre_sala: searchSala,
      });

      if (!response || response.status !== 201) {
        // Deberia lanzar una notificacion de error
        openNotification(2, "Error", "No se pudo crear la sala");
        return;
      }

      loadSalas(paciente.id_piso);

      const id_ocupacion_creada = response.data.id_sala;
      openNotification(0, "Sala Creada", "Se creo la sala correctamente");

      handleSetChangeHuesped("id_sala", id_ocupacion_creada);

      document.getElementById("selectSala").blur();

      // Validar que retorna porque tenemos que asignarle ese id al user
    } catch (error) {}

    setLoading(false);
  };

  const loadCamasDisponibles = async () => {
    try {
      const response = await camaApi.getCamasByDisponibleRequest();

      if (!response || response.status < 200 || response.status >= 300) {
        navigate("/error");
        return;
      }

      const camasHombre = response.data.data.filter(
        (cama) =>
          cama.Habitacion.genero === "MASCULINO" &&
          cama.Habitacion.id_lugar === userLog.id_lugar
      );

      const camasMujer = response.data.data.filter(
        (cama) =>
          cama.Habitacion.genero === "FEMENINO" &&
          cama.Habitacion.id_lugar === userLog.id_lugar
      );

      setCamasDisponiblesHombres(camasHombre.length);
      setCamasDisponiblesMujeres(camasMujer.length);
    } catch (error) {
      navigate("/error");
    }
  };

  const loadNoSolicitudes = async () => {
    try {
      const usuario = getUserFromToken();
      console.log(usuario);
      const response = await ListaSolicitudApi.getListaSolicitudTotalRequest(
        usuario.id_lugar
      );

      if (!response || response.status < 200 || response.status >= 300) {
        navigate("/error");

        return;
      }

      const noSolicitudesHombres = response.data.filter(
        (solicitud) =>
          solicitud.PacienteHuesped.Huesped.Persona.genero === "MASCULINO"
      );

      const noSolicitudesMujeres = response.data.filter(
        (solicitud) =>
          solicitud.PacienteHuesped.Huesped.Persona.genero === "FEMENINO"
      );

      setNoSolicitudesHombres(noSolicitudesHombres.length);

      setNoSolicitudesMujeres(noSolicitudesMujeres.length);
    } catch (error) {
      navigate("/error");
    }
  };

  //Cargar las ocupaciones
  const loadOcupaciones = async () => {
    try {
      const response = await OcupacionesApi.getOcupacionesRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las ocupaciones");
      }

      if (response.status >= 200 && response.status < 300) {
        setOcupaciones(
          response.data.map((e) => ({
            value: e.id_ocupacion,
            label: e.descripcion,
          }))
        );
      } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las ocupaciones");
      }
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  ////////////////////////////Cambios para municipio y departamento
  const loadDepartamentos = async () => {
    try {
      const response = await getDepartamentos();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los departamentos");
      }

      if (response.status >= 200 && response.status < 300) {
        setDepartamentos(
          response.map((e) => ({
            value: e.id_departamento,
            label: e.nombre_departamento,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const loadMunicipiosHuesped = async () => {
    try {
      const response = await getMunicipiosByDepartamentoId(
        selectedDepartamentoHuesped
      );

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los municipios");
      }

      if (response.status >= 200 && response.status < 300) {
        setMunicipios(
          response.map((e) => ({
            value: e.id_municipio,
            label: e.nombre_municipio,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const loadMunicipioAcompanantes = async () => {
    try {
      const response = await getMunicipiosByDepartamentoId(
        selectedDepartamentoAcompanante
      );

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los municipios");
      }

      if (response.status >= 200 && response.status < 300) {
        setMunicipios(
          response.map((e) => ({
            value: e.id_municipio,
            label: e.nombre_municipio,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadMunicipiosPaciente = async () => {
    try {
      const response = await getMunicipiosByDepartamentoId(
        selectedDepartamentoPaciente
      );

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los municipios");
      }

      if (response.status >= 200 && response.status < 300) {
        setMunicipios(
          response.map((e) => ({
            value: e.id_municipio,
            label: e.nombre_municipio,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  //Cargar las procedencias
  const loadProcedencias = async () => {
    try {
      const response = await ProcedenciaApi.getProcedenciasRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las procedencias");
      }

      if (response.status >= 200 && response.status < 300) {
        setProcedencias(
          response.data.map((e) => ({
            value: e.id_procedencia,
            label: e.departamento + ", " + e.municipio,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleObtenerFechaNacimiento = () => {
    if (isInfoPacienteEditable) {
      return hospedado.fecha_nacimiento
        ? dayjs(hospedado.fecha_nacimiento, dateFormat)
        : "";
    }
  };

  const handleObtenerFechaPaciente = () => {
    //if (isInfoPacienteEditable) {
    return paciente.fecha_nacimiento
      ? dayjs(paciente.fecha_nacimiento, dateFormat)
      : "";
    //}
  };

  const handleObtenerFechaAcompanante = () => {
    console.log(
      "Fecha de nacimiento acompanante: ",
      acompanante.fecha_nacimiento
    );
    return acompanante.fecha_nacimiento
      ? dayjs(acompanante.fecha_nacimiento, dateFormat)
      : "";
  };

  const handleCrearOcupacion = async (persona) => {
    // Deberiamos llamar a la api para crear la ocupacion;

    setLoading(true);
    try {
      const response = await OcupacionesApi.postOcupacionRequest({
        descripcion: searchOcupacion,
      });

      if (!response || response.status !== 201) {
        // Deberia lanzar una notificacion de error
        openNotification(2, "Error", "No se pudo crear la ocupacion");
        setLoading(false);
        return;
      }

      const id_ocupacion_creada = response.data.id_ocupacion;
      openNotification(
        0,
        "Ocupacion Creada",
        "Se creo la ocupacion correctamente"
      );

      loadOcupaciones();

      if (persona === 0)
        handleSetChangeHuesped("id_ocupacion", id_ocupacion_creada);

      if (persona === 1)
        handleSetChangePaciente("id_ocupacion", id_ocupacion_creada);

      if (persona === 2)
        handleSetChangeAcompanante("id_ocupacion", id_ocupacion_creada);

      document.getElementById("selectOcupacion").blur();
      document.getElementById("selectOcupacionPaciente").blur();
      document.getElementById("selectOcupacionAcompanante").blur();

      // Validar que retorna porque tenemos que asignarle ese id al user
    } catch (error) {}

    setLoading(false);
  };

  const ResetearAtributos = () => {
    const hospedadoVacio = {
      dni: "",
      id_ocupacion: null,
      direccion: "",
      fecha_nacimiento: "",
      genero: null,
      iglesia: "",
      municipio_id: null,
      primer_nombre: "",
      segundo_nombre: "",
      segundo_apellido: "",
      primer_apellido: "",
      telefono: "",
      fecha_entrada: "",
      fecha_salida: "",
      id_lugar: usuario.id_lugar,
      observacion_reservacion: "",
      id_patrono: null,
      dni_afiliado: "",
      nombre_afiliado: "",
    };
    const pacienteVacio = {
      dni: "",
      id_ocupacion: null,
      direccion: "",
      fecha_nacimiento: "",
      genero: null,
      municipio_id: null,
      primer_nombre: "",
      segundo_nombre: "",
      segundo_apellido: "",
      primer_apellido: "",
      telefono: "",
      becada: false,
      id_lugar: usuario.id_lugar,
      id_hospital: null,
      id_piso: null,
      id_sala: null,
    };
    setHospedado(hospedadoVacio);
    setPaciente(pacienteVacio);
    setSelectedDepartamentoAcompanante(null);
    setSelectedMunicipioAcompanante(null);
    setSelectedDepartamentoHuesped(null);
    setSelectedMunicipioHuesped(null);
    setSelectedDepartamentoPaciente(null);
    setSelectedMunicipioPaciente(null);
    setAcompanante(false);
  };

  const resetearAcompanante = () => {
    const acompananteVacio = {
      dni: "",
      id_ocupacion: null,
      direccion: "",
      fecha_nacimiento: "",
      genero: null,
      municipio_id: null,
      primer_nombre: "",
      segundo_nombre: "",
      segundo_apellido: "",
      primer_apellido: "",
      telefono: "",
      id_lugar: usuario.id_lugar,
    };
    setAcompanante(acompananteVacio);
  };

  const searchDni = async (in_dni, persona) => {
    cargarInformacionHospedado(in_dni, persona);
  };

  const isInListaNegar = async (in_dni) => {
    try {
      const response = await personaApi.getPersonaByDniRequest(in_dni);

      if (response && response.status >= 200 && response.status < 300) {
        const { id_persona, dni, primer_nombre, primer_apellido } =
          response.data;

        const responseListaNegra = await ListaNegraApi.getListaNegraByIdPerson(
          id_persona
        );

        if (
          response &&
          responseListaNegra.status >= 200 &&
          responseListaNegra.status < 300
        ) {
          const razon = responseListaNegra.data.Reglamento.descripcion_regla;

          setContentModalNegra(
            <div>
              <Flex
                justify="center"
                align="center"
                style={{ marginBottom: 10, marginTop: 20 }}
              >
                <p className="px-3 py-1 bg-red-400 text-white-100 rounded-tl-md rounded-bl-md">
                  DNI:{" "}
                </p>
                <p className="px-3 py-1 border border-red-400  text-red-400 rounded-tr-md rounded-br-md">
                  {dni}
                </p>
              </Flex>

              <Flex
                justify="center"
                align="center"
                style={{ marginBottom: 30 }}
              >
                <p className="px-3 py-1 bg-red-400 text-white-100 rounded-tl-md rounded-bl-md">
                  Nombre:
                </p>
                <p className="px-3 py-1 border border-red-400  text-red-400 rounded-tr-md rounded-br-md">
                  {primer_nombre + " " + primer_apellido}
                </p>
              </Flex>

              <h1 className="text-white-800 text-lg mb-2 text-center">Razon</h1>

              <Flex
                justify="center"
                align="center"
                style={{ marginBottom: 20 }}
              >
                <p className="px-3 py-1 bg-red-300 text-white-100 rounded-tl-md rounded-md">
                  {razon}
                </p>
              </Flex>
            </div>
          );

          setListaNegraModalVisible(true);
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const isInSolicitudes = async (in_dni) => {
    try {
      const responseSolicitudes =
        await ListaSolicitudApi.getListaSolicitudTotalRequest();

      if (
        !responseSolicitudes ||
        responseSolicitudes.status < 200 ||
        responseSolicitudes.status >= 300
      ) {
        return false;
      }

      const solicitudes = responseSolicitudes.data;

      const solicitudesFiltradas = solicitudes.filter(
        (solicitud) => solicitud.PacienteHuesped.Huesped.Persona.dni === in_dni
      );

      if (solicitudesFiltradas.length > 0) {
        Modal.warning({
          centered: true,
          title: "Solicitud Activa",
          content: (
            <div>
              <p className="text-lg px-3 py-2 border-dashed border-red-400 rounded-md border-2 text-red-400 mt-5">
                El DNI ingresado ya tiene una solicitud de hospedaje en proceso
              </p>
            </div>
          ),
          onOk() {},
          afterClose() {},
        });

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const isInReservaciones = async (in_dni) => {
    try {
      const responseSolicitudes =
        await ReservacionesApi.getReservacionesActivas();

      if (
        !responseSolicitudes ||
        responseSolicitudes.status < 200 ||
        responseSolicitudes.status >= 300
      ) {
        return false;
      }

      const solicitudes = responseSolicitudes.data;

      const solicitudesFiltradas = solicitudes.filter(
        (solicitud) => solicitud.PacienteHuesped.Huesped.Persona.dni === in_dni
      );

      if (solicitudesFiltradas.length > 0) {
        Modal.warning({
          centered: true,
          title: "Reservacion Activa",
          content: (
            <div>
              <p className="text-lg px-3 py-2 border-dashed border-yellow-400 rounded-md border-2 text-red-400 mt-5">
                El dni que acaba de ingresar ya tiene una reservacion
              </p>
            </div>
          ),
          onOk() {},
          afterClose() {},
        });

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Funcion que se corre cuando se ingresa un dni y se busca la informacion de la persona
  const cargarInformacionHospedado = async (in_dni, persona) => {
    try {
      const response = await personaApi.getPersonaByDniRequest(in_dni);

      if (!response) {
        // deberia lanzar un erro
        console.log("la persona aun no existe");
      }

      if (response.status >= 200 && response.status < 300) {
        openNotification(
          2,
          "Persona ya Existe",
          "La persona que ingreso ya existe."
        );

        const {
          dni,
          id_ocupacion,
          direccion,
          fecha_nacimiento,
          genero,
          municipio_id,
          primer_nombre,
          segundo_nombre,
          segundo_apellido,
          primer_apellido,
          telefono,
          observacion,
          iglesia,
        } = response.data;
        const formattedDate = dayjs(fecha_nacimiento).format("DD-MM-YYYY");

        // Mostrar notificación si la persona tiene una observación
        if (observacion !== null)
          openNotification(
            1,
            "Observacion de Persona",
            `Esta persona tiene una observación: \n${observacion}`
          );

        const changeuser = {
          dni,
          id_ocupacion,
          municipio_id,
          direccion,
          fecha_nacimiento: formattedDate, // cambia el formato
          genero: genero === "FEMENINO" ? 1 : 2,
          primer_apellido,
          segundo_apellido,
          primer_nombre,
          segundo_nombre,
          telefono,
          id_lugar: 1,
          iglesia,
        };

        switch (persona) {
          case 0:
            console.log("Entro a case 0 supuestamente hospedado");
            setHospedado({
              ...changeuser,
              id_patrono: null,
              dni_afiliado: "",
              nombre_afiliado: "",
            });
            const municipioHuesped = await fetchMunicipioById(municipio_id);
            if (municipioHuesped) {
              setSelectedDepartamentoHuesped(municipioHuesped.departamento_id);
              setSelectedMunicipioHuesped(municipio_id);
            }
            break;

          case 1:
            console.log("Entro a case 1 supuestamente paciente");
            setPaciente({ ...changeuser, becada: false });
            const municipioPaciente = await fetchMunicipioById(municipio_id);
            if (municipioPaciente) {
              setSelectedDepartamentoPaciente(
                municipioPaciente.departamento_id
              );
              setSelectedMunicipioPaciente(municipio_id);
            }

            break;
          case 2:
            console.log("Entro a case 2 supuestamente acompanante");
            setAcompanante({ ...changeuser });
            const municipioAcompanante = await fetchMunicipioById(municipio_id);
            if (municipioAcompanante) {
              setSelectedDepartamentoAcompanante(
                municipioAcompanante.departamento_id
              );
              setSelectedMunicipioAcompanante(municipio_id);
              console.log("Municipio Acompanante: ", municipio_id);
            }
            break;

          default:
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //hace cambios de formato
  const handleSetChangeHuesped = async (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        // Pone el formato de dni
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }

        if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
          if (await isInListaNegar(newValue)) {
            ResetearAtributos();
            console.log("Esta en ngra");
            return;
          } else if (await isInSolicitudes(newValue)) {
            ResetearAtributos();
            console.log("Esta en solid");
            return;
          } else if (await isInReservaciones(newValue)) {
            ResetearAtributos();

            console.log("Eseta en reservacion");
            return;
          } else searchDni(newValue, 0);
        }
        break;

      case "fecha_nacimiento":
        if (value.length > 10) {
          const fecha = value.split("-");
          newValue = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
          setHospedado({ ...hospedado, fecha_nacimiento: value });
        }
        break;

      case "dni_afiliado":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      case "telefono":
        if (
          previousValue !== null &&
          value.length > previousValue.length &&
          value.length === 4
        ) {
          if (/\d{4}/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      case "iglesia":
        if (value.length > 0) {
          setHospedado({ ...hospedado, iglesia_id: value });
        }
        break;

      case "municipio_id":
        if (value.length > 0) {
          setHospedado({ ...hospedado, municipio_id: value });
        }
        break;

      default:
        break;
    }

    setHospedado({ ...hospedado, [key]: newValue });
  };

  const handleChangeObservacionHuesped = (e) => {
    setHospedado({ ...hospedado, observacion_reservacion: e.target.value });
  };

  // Funcion que maneja el cambio del texto en los inputs/selects del front
  const handleSetChangePaciente = (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }

        if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
          searchDni(newValue, 1);
        }

        break;

      case "direccion":
        if (value.length > 0) {
          setPaciente({ ...paciente, direccion: value });
        }
        break;

      case "telefono":
        if (
          previousValue !== null &&
          value.length > previousValue.length &&
          value.length === 4
        ) {
          if (/\d{4}/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      case "id_hospital":
        setPaciente({
          ...paciente,
          id_hospital: newValue,
          id_piso: null,
          id_sala: null,
        });
        break;

      case "iglesia":
        if (value.length > 0) {
          setPaciente({ ...paciente, iglesia: value });
        }
        break;

      case "id_piso":
        if (value.length > 0) {
          setPaciente({ ...paciente, id_piso: value, id_sala: null });
        }
        break;

      case "id_sala":
        if (value.length > 0) {
          setPaciente({ ...paciente, id_sala: value });
        }
        break;

      case "parentesco":
        if (value.length > 0) {
          setPaciente({ ...paciente, parentesco: value });
        }
        break;

      case "id_causa_visita":
        if (value.length > 0) {
          setPaciente({ ...paciente, id_causa_visita: value });
        }
        break;

      case "observacion":
        if (value.length > 0) {
          setPaciente({ ...paciente, observacion: value });
        }
        break;

      case "municipio_id":
        if (value.length > 0) {
          setPaciente({ ...paciente, municipio_id: value });
        }
        break;

      // Lo que pasa por default en el switch
      default:
        break;
    }

    setPaciente({ ...paciente, [key]: newValue });
  };

  const handleSetChangeAcompanante = async (
    key,
    value,
    previousValue = null
  ) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }

        if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
          if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
            if (await isInListaNegar(newValue)) {
              resetearAcompanante();
              return;
            } else if (await isInSolicitudes(newValue)) {
              resetearAcompanante();
              return;
            } else if (await isInReservaciones(newValue)) {
              resetearAcompanante();
              return;
            } else searchDni(newValue, 2);
          }
        }

        break;

      case "telefono":
        if (
          previousValue !== null &&
          value.length > previousValue.length &&
          value.length === 4
        ) {
          if (/\d{4}/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      case "iglesia":
        if (value.length > 0) {
          setAcompanante({ ...acompanante, iglesia: value });
        }
        break;

      case "municipio_id":
        if (value.length > 0) {
          setAcompanante({ ...acompanante, municipio_id: value });
        }
        break;

      default:
        break;
    }

    setAcompanante({ ...acompanante, [key]: newValue });
  };

  const toggleAcompanante = () => {
    setHayAcompanante(!hayAcompanante);
    setAcompanante((prev) => {
      if (prev === true) {
        resetearAcompanante();
      }
      return !prev;
    });
  };

  const validarCamposHospedado = () => {
    for (const [key, value] of Object.entries(hospedado)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido" &&
        key !== "telefono" &&
        key !== "observacion_reservacion" &&
        key !== "id_patrono" &&
        key !== "dni_afiliado" &&
        key !== "nombre_afiliado" &&
        key !== "iglesia"
      ) {
        openNotification(
          2,
          "Campos Vacios en Huesped",
          "No puede dejar campos vacios"
        );
        return false;
      }

      if (key === "telefono" && value.match(telFormat) === null) {
        openNotification(
          2,
          "Telefono del huesped",
          "El formato del telefono no es valido"
        );
        return false;
      }
      if (
        key === "dni" &&
        value.match(dniFormat) === null &&
        value.match(regexFecha) === null
      ) {
        openNotification(
          2,
          "DNI del huesped",
          "El formato del DNI no es valido"
        );
        return false;
      }
    }

    return true;
  };

  const validarCamposPaciente = () => {
    console.warn("Verificando paciente...");
    console.log(paciente);
    for (const [key, value] of Object.entries(paciente)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido" &&
        key !== "telefono" &&
        key !== "observacion" &&
        key !== "iglesia"
      ) {
        openNotification(
          2,
          "Campos Vacios en Paciente",
          "No puede dejar campos vacios"
        );
        return false;
      }

      if (
        key === "telefono" &&
        value.length > 0 &&
        value.match(telFormat) === null
      ) {
        openNotification(
          2,
          "Telefono del Paciente Invalido",
          "El formato del telefono no es valido"
        );
        return false;
      }
      if (
        key === "dni" &&
        value.match(dniFormat) === null &&
        value.match(regexFecha) === null
      ) {
        openNotification(
          2,
          "DNI del paciente",
          "El formato del DNI no es valido"
        );
        return false;
      }
    }

    return true;
  };

  const validarCamposAcompanante = () => {
    for (const [key, value] of Object.entries(acompanante)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido" &&
        key !== "telefono" &&
        key !== "iglesia"
      ) {
        openNotification(
          2,
          "Campos Vacios en Acompañante",
          "No puede dejar campos vacios"
        );
        return false;
      }

      if (
        key === "telefono" &&
        value.length > 0 &&
        value.match(telFormat) === null
      ) {
        openNotification(
          2,
          "Telefono en Acompañante",
          "El formato del telefono no es valido"
        );
        return false;
      }
      if (
        key === "dni" &&
        value.match(dniFormat) === null &&
        value.match(regexFecha) === null
      ) {
        openNotification(
          2,
          "DNI del Acompañante",
          "El formato del DNI no es valido"
        );
        return false;
      }
    }

    return true;
  };

  const validarCampos = async () => {
    if (validarCamposHospedado() && validarCamposPaciente()) {
      if (acompanante) {
        if (validarCamposAcompanante()) {
          return true;
        } else return false;
      }

      return true;
    }

    return false;
  };

  //agarra el submit aqui va a mandar
  const handleSubmit = async (event) => {
    event.preventDefault();

    const huespedFormFull = validateFieldsHuesped();
    const pacienteFormFull = validateFieldsPaciente();
    const acompananteFormFull = validateFieldsAcompanante();

    if (huespedFormFull && pacienteFormFull && acompananteFormFull) {
      console.log("Todos los campos estan llenos");
    }

    setLoading(true);

    if (await validarCampos()) {
      const huespedData = {
        ...hospedado,
        iglesia: hospedado.iglesia ? hospedado.iglesia : "",
        municipio_id: selectedMunicipioHuesped,
        genero: hospedado.genero === 1 ? "FEMENINO" : "MASCULINO",
        id_lugar: usuario.id_lugar,
        fecha_entrada: dayjs(hospedado.fecha_entrada, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
        fecha_nacimiento: dayjs(
          hospedado.fecha_nacimiento,
          "DD-MM-YYYY"
        ).format("YYYY-MM-DD"),
        fecha_salida: dayjs(hospedado.fecha_salida, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      setContentModal(
        <p className="px-2 py-3 bg-green-400 text-white-100 rounded-md">
          Por favor, espere a que le asignemos una cama
        </p>
      );

      if (hospedado.genero === "FEMENINO" || hospedado.genero === 1) {
        if (!validarDisponibilidadMujeres()) {
          setContentModal(
            <p className="px-2 py-3 bg-red-400 text-white-100 rounded-md">
              Usted ha pasado a la lista de espera, hay muchas solicitudes
            </p>
          );
        }
      } else {
        console.log("se fue a hombre");
        if (!validarDisponibilidadHombres()) {
          setContentModal(
            <p className="px-2 py-3 bg-red-400 text-white-100 rounded-md">
              Usted ha pasado a la lista de espera, hay muchas solicitudes
            </p>
          );
        }
      }

      const pacienteData = {
        ...paciente,
        iglesia: paciente.iglesia ? paciente.iglesia : "",
        municipio_id: selectedMunicipioPaciente,
        genero: paciente.genero === 1 ? "FEMENINO" : "MASCULINO",
        id_lugar: usuario.id_lugar,
        fecha_nacimiento: dayjs(paciente.fecha_nacimiento, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
        //fecha_entrada: dayjs(paciente.fecha_entrada, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        //fecha_salida: dayjs(paciente.fecha_salida, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      };

      const acompananteDataFunc = () => {
        if (acompanante) {
          return {
            ...acompanante,
            municipio_id: selectedMunicipioAcompanante,
            iglesia: acompanante.iglesia ? acompanante.iglesia : "",
            genero: acompanante.genero === 1 ? "FEMENINO" : "MASCULINO",
            id_lugar: usuario.id_lugar,
            fecha_nacimiento: dayjs(
              acompanante.fecha_nacimiento,
              "DD-MM-YYYY"
            ).format("YYYY-MM-DD"),
          };
        }

        return null;
      };

      const acompananteData = acompananteDataFunc();

      const patronoDataFunc = () => {
        if (
          hospitalesPatronos.includes(paciente.id_hospital) &&
          hospedado.id_patrono !== null &&
          hospedado.dni_afiliado !== "" &&
          hospedado.nombre_afiliado !== ""
        ) {
          return {
            id_patrono: hospedado.id_patrono,
            dni_afiliado: hospedado.dni_afiliado,
            nombre_afiliado: hospedado.nombre_afiliado,
          };
        } else return null;
      };

      const patronoData = patronoDataFunc();

      const solicitudData = {
        fecha_entrada: dayjs(hospedado.fecha_entrada, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
        fecha_salida: dayjs(hospedado.fecha_salida, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
        becada: paciente.becada,
        observacion: hospedado.observacion_reservacion
          ? hospedado.observacion_reservacion
          : "",
      };

      try {
        const response = await solicitudApi.createSolicitud({
          huespedData,
          pacienteData,
          acompananteData,
          solicitudData,
          patronoData,
          userId: Cookie.get("userId"),
        });

        if (response && response.status >= 200 && response.status < 300) {
          setSuccessModalVisible(true);

          loadCamasDisponibles();
          loadNoSolicitudes();

          resetearAcompanante();
          ResetearAtributos();
          setIsInfoPacienteEditable(true);

          setLoading(false);
        }
      } catch (error) {
        if (error.message === "people_max_reached") {
          alert(
            "Se ha alcanzado el límite de personas por paciente. Contacte un administrador."
          );
        }
        openNotification(4, "Error", "No se pudo crear la solicitud");
        console.log("Error creando solicitud: ", error);
      }
    }

    setLoading(false);
  };

  const validarDisponibilidadMujeres = () => {
    if (noSolicitudesMujeres) {
      return camasDisponiblesMujeres > noSolicitudesMujeres;
    }

    return camasDisponiblesMujeres > 0;
  };

  const validarDisponibilidadHombres = () => {
    if (noSolicitudesHombrs) {
      return camasDisponiblesHombres > noSolicitudesHombrs;
    }

    return camasDisponiblesHombres > 0;
  };

  useEffect(() => {
    console.log("SE CORRIO EL useeffect GENERAL");
    loadOcupaciones();
    loadProcedencias();
    loadHospitales(); // Cargar los hospitales para que se puedan elegir en el select apenas se meta a la vista
    //////////////////////////Cambios para municipio y departamento de prueba
    loadDepartamentos();
    loadMunicipiosHuesped();
    loadMunicipioAcompanantes();
    loadMunicipiosPaciente();

    loadCausasVisita();
    //handleGetOcupaciones();
    //handleGetProcedencias();

    ResetearAtributos();
    //cargarInformacion();

    loadCamasDisponibles();

    loadNoSolicitudes();
  }, []);

  useEffect(() => {
    console.log("SE CORRIO EL FETCH DEPARTAMENTOS");
    const fetchDepartamentos = async () => {
      try {
        const departamentosData = await getDepartamentos();
        setDepartamentos(departamentosData);
      } catch (error) {
        console.error("Error fetching departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, []);

  useEffect(() => {
    console.log("SE CORRIO EL FETCH MUNICIPIOS");
    const fetchMunicipios = async () => {
      console.log(selectedDepartamentoHuesped);
      if (selectedDepartamentoHuesped !== null) {
        try {
          console.log("Sending", selectedDepartamentoHuesped);
          const municipiosData = await getMunicipiosByDepartamentoId(
            selectedDepartamentoHuesped
          );
          setMunicipios(municipiosData);
        } catch (error) {
          console.error("Error fetching municipios:", error);
        }
      } else {
        setMunicipios([]);
      }
    };

    fetchMunicipios();
  }, [selectedDepartamentoHuesped]);

  useEffect(() => {
    console.log("SE CORRIO EL FETCH MUNICIPIOS");
    const fetchMunicipios = async () => {
      console.log(selectedDepartamentoAcompanante);
      if (selectedDepartamentoAcompanante !== null) {
        try {
          console.log("Sending", selectedDepartamentoAcompanante);
          const municipiosData = await getMunicipiosByDepartamentoId(
            selectedDepartamentoAcompanante
          );
          setMunicipios(municipiosData);
        } catch (error) {
          console.error("Error fetching municipios:", error);
        }
      } else {
        setMunicipios([]);
      }
    };

    fetchMunicipios();
  }, [selectedDepartamentoAcompanante]);

  useEffect(() => {
    console.log("SE CORRIO EL FETCH MUNICIPIOS de paciente");
    const fetchMunicipios = async () => {
      console.log(selectedDepartamentoPaciente);
      if (selectedDepartamentoPaciente !== null) {
        try {
          console.log("Sending", selectedDepartamentoPaciente);
          const municipiosData = await getMunicipiosByDepartamentoId(
            selectedDepartamentoPaciente
          );
          setMunicipios(municipiosData);
        } catch (error) {
          console.error("Error fetching municipios:", error);
        }
      } else {
        setMunicipios([]);
      }
    };

    fetchMunicipios();
  }, [selectedDepartamentoPaciente]);

  const Fechas = () => {
    return (
      <Card style={{ marginTop: 16 }} className="shadow-#1">
        <Meta title="" />
        <Row gutter={25} style={{ marginTop: 20 }}>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Flex
              justify=""
              align="center"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="w-max mr-3 text-[16px] font-bold text-white-700 text-nowrap">
                Fecha De Entrada
              </div>
              <DatePicker
                minDate={dayjs()}
                maxDate={
                  hospedado.fecha_salida
                    ? dayjs(hospedado.fecha_salida).subtract(1, "day")
                    : null
                }
                style={{
                  height: "100%",
                  width: "100%",
                  borderColor: emptyFieldsHuesped.fecha_entrada
                    ? "#FF0A0A"
                    : undefined,
                  borderWidth: emptyFieldsHuesped.fecha_entrada
                    ? "1px"
                    : undefined,
                  borderRadius: emptyFieldsHuesped.fecha_entrada
                    ? "8px"
                    : undefined,
                }}
                placeholder="Fecha de Entrada"
                format={dateFormat}
                className="my-datepicker"
                value={
                  hospedado.fecha_entrada
                    ? dayjs(hospedado.fecha_entrada, dateFormat)
                    : null
                }
                onChange={(e, d) => {
                  handleSetChangeHuesped("fecha_entrada", d);
                }}
              />
            </Flex>
          </Col>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Flex
              justify=""
              align="center"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="w-max mr-3 text-[16px] font-bold text-white-700 text-nowrap">
                Fecha De Salida
              </div>
              <DatePicker
                minDate={
                  hospedado.fecha_entrada
                    ? dayjs(hospedado.fecha_entrada).add(1, "day")
                    : dayjs().add(1, "day")
                }
                style={{
                  height: "100%",
                  width: "100%",
                  borderColor: emptyFieldsHuesped.fecha_salida
                    ? "#FF0A0A"
                    : undefined,
                  borderWidth: emptyFieldsHuesped.fecha_salida
                    ? "1px"
                    : undefined,
                  borderRadius: emptyFieldsHuesped.fecha_salida
                    ? "8px"
                    : undefined,
                }}
                placeholder="Fecha de Salida"
                format={dateFormat}
                className="my-datepicker"
                value={
                  hospedado.fecha_salida
                    ? dayjs(hospedado.fecha_salida, dateFormat)
                    : null
                }
                onChange={(e, d) => {
                  handleSetChangeHuesped("fecha_salida", d);
                }}
              />
            </Flex>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Flex vertical>
      <ConfigProvider
        input={{ className: "cursor-default" }}
        theme={{
          token: {
            colorPrimaryHover: "#92e1b4",
            colorPrimary: "#77d9a1",
            colorText: "#626262",
            colorBgContainerDisabled: "#fcfcfc",
            colorTextDisabled: "#939393",
          },
          Button: {
            colorPrimary: "#77d9a1",
            colorPrimaryHover: "#5fae81",
            colorPrimaryActive: "#9bd8e5",
            defaultHoverColor: "#fdfdfd",
          },
          components: {
            Input: {},
          },
        }}
      >
        <Disponibilidad
          camasDisponiblesHombres={camasDisponiblesHombres}
          camasDisponiblesMujeres={camasDisponiblesMujeres}
          noSolicitudesHombres={noSolicitudesHombrs}
          noSolicitudesMujeres={noSolicitudesMujeres}
        />


        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Informacion Personal Huesped" />

          <Row gutter={25} style={{ marginTop: 20 }}>
  
         <TipoDocumentoSelector />
        </Row>

          



          <Row gutter={25} style={{ marginTop: 20 }}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<IdcardOutlined style={styleIconInput} />}
                size="large"
                placeholder={selected}
                maxLength={15}
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsHuesped.dni ? "#FF0A0A" : undefined,
                }}
                value={hospedado.dni}
                
                onChange={(e) => {
                  handleSetChangeHuesped("dni", e.target.value, hospedado.dni);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                id="selectOcupacion"
                showSearch
                searchValue={searchOcupacion}
                onSearch={(e) => {
                  setSearchOcupacion(e.toUpperCase());
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                placeholder="Ocupacion"
                size="large"
                notFoundContent={
                  <Button
                    loading={loading}
                    onClick={() => {
                      handleCrearOcupacion(0);
                    }}
                  >
                    Crear Ocupacion
                  </Button>
                }
                options={ocupaciones}
                style={{
                  width: "100%",
                  height: "100%",
                  borderColor: emptyFieldsHuesped.id_ocupacion
                    ? "#FF0A0A"
                    : undefined,
                  borderWidth: emptyFieldsHuesped.id_ocupacion
                    ? "1px"
                    : undefined,
                  borderRadius: emptyFieldsHuesped.id_ocupacion
                    ? "8px"
                    : undefined,
                }}
                value={hospedado.id_ocupacion}
                onChange={(e) => {
                  handleSetChangeHuesped("id_ocupacion", e);
                }}
              ></Select>
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                placeholder="Primer Nombre"
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsHuesped.primer_nombre
                    ? "#FF0A0A"
                    : undefined,
                }}
                value={hospedado.primer_nombre}
                onChange={(e) => {
                  handleSetChangeHuesped(
                    "primer_nombre",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                placeholder="Segundo Nombre"
                type="text"
                style={{
                  height: "100%",
                }}
                value={hospedado.segundo_nombre}
                onChange={(e) => {
                  handleSetChangeHuesped(
                    "segundo_nombre",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                placeholder="Primer Apellido"
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsHuesped.primer_apellido
                    ? "#FF0A0A"
                    : undefined,
                }}
                value={hospedado.primer_apellido}
                onChange={(e) => {
                  handleSetChangeHuesped(
                    "primer_apellido",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                placeholder="Segundo Apellido"
                type="text"
                style={{
                  height: "100%",
                }}
                value={hospedado.segundo_apellido}
                onChange={(e) => {
                  handleSetChangeHuesped(
                    "segundo_apellido",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                placeholder="Genero"
                size="large"
                options={generos}
                style={{
                  width: "100%",
                  height: "100%",
                  borderColor: emptyFieldsHuesped.genero
                    ? "#FF0A0A"
                    : undefined,
                  borderWidth: emptyFieldsHuesped.genero ? "1px" : undefined, // Para reforzar el borde
                  borderRadius: emptyFieldsHuesped.genero ? "8px" : undefined,
                }}
                value={hospedado.genero}
                onChange={(e) => {
                  handleSetChangeHuesped("genero", e);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                size="large"
                placeholder="Iglesia (Opcional)"
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsHuesped.iglesia
                    ? "#FF0A0A"
                    : undefined,
                }}
                value={hospedado.iglesia}
                onChange={(e) => {
                  handleSetChangeHuesped(
                    "iglesia",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <Select
                  showSearch
                  value={selectedDepartamentoHuesped}
                  onChange={(value) => {
                    setSelectedDepartamentoHuesped(value);
                    //handleSetChangeHuesped("departamento", value);
                    setSelectedMunicipioHuesped(null); // Resetear municipio al cambiar departamento
                  }}
                  placeholder="Departamento"
                  style={{
                    flex: 1,
                    borderColor: emptyFieldsHuesped.departamento_id
                      ? "#FF0A0A"
                      : undefined,
                    borderWidth: emptyFieldsHuesped.departamento_id
                      ? "1px"
                      : undefined,
                    borderRadius: emptyFieldsHuesped.departamento_id
                      ? "8px"
                      : undefined,
                  }}
                  //options={departamentos}
                  size="large"
                  options={departamentos.map((d) => ({
                    value: d.departamento_id,
                    label: d.nombre,
                  }))}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
                <Select
                  showSearch
                  value={selectedMunicipioHuesped}
                  onChange={(value) => {
                    setSelectedMunicipioHuesped(value);
                    handleSetChangeHuesped("municipio_id", value);
                  }}
                  placeholder="Municipio"
                  style={{
                    flex: 1,
                    borderColor: emptyFieldsHuesped.municipio_id
                      ? "#FF0A0A"
                      : undefined,
                    borderWidth: emptyFieldsHuesped.municipio_id
                      ? "1px"
                      : undefined,
                    borderRadius: emptyFieldsHuesped.municipio_id
                      ? "8px"
                      : undefined,
                  }}
                  //options={municipiosFiltradosHuesped}
                  size="large"
                  disabled={!selectedDepartamentoHuesped} // Deshabilitar si no hay departamento seleccionado
                  options={municipios.map((m) => ({
                    value: m.municipio_id,
                    label: m.nombre,
                  }))}
                  filterOption={(input, option) =>
                    option.label.toUpperCase().includes(input.toUpperCase())
                  }
                />
              </div>

              {/* <Select
                showSearch
                searchValue={searchProcedencia}
                onSearch={(e) => {
                  setSearchProcedencia(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                notFoundContent={
                  <Button
                    onClick={(e) => {
                      handleCrearProcedencia();
                    }}
                  >
                    Crear Procedencia
                  </Button>
                }
                placeholder="Procedencia"
                style={{ width: "100%", height: "100%" }}
                options={procedencias}
                size="large"
                value={hospedado.id_procedencia}
                onChange={(e) => {
                  handleSetChangeUser("id_procedencia", e);
                }}
              /> */}
            </Col>
          </Row>
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: "auto" }}>
              <TextArea
                count={{ show: true }}
                prefix={<PushpinOutlined />}
                placeholder="Direccion Exacta"
                maxLength={150}
                autoSize={{ minRows: 2, maxRows: 4 }}
                value={hospedado.direccion}
                style={{
                  borderColor: emptyFieldsHuesped.direccion
                    ? "#FF0A0A"
                    : undefined,
                }}
                onChange={(e) => {
                  handleSetChangeHuesped(
                    "direccion",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <DatePicker
                style={{
                  height: "100%",
                  width: "100%",
                  borderColor: emptyFieldsHuesped.fecha_nacimiento
                    ? "#FF0A0A"
                    : undefined,
                }}
                placeholder="Fecha de nacimiento"
                format={dateFormat}
                className="my-datepicker"
                value={handleObtenerFechaNacimiento()}
                onChange={(e, d) => {
                  handleSetChangeHuesped("fecha_nacimiento", d);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<PhoneOutlined style={styleIconInput} />}
                size="large"
                placeholder="Telefono"
                maxLength={9}
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsHuesped.telefono
                    ? "#FF0A0A"
                    : undefined,
                }}
                value={hospedado.telefono}
                onChange={(e) => {
                  handleSetChangeHuesped(
                    "telefono",
                    e.target.value,
                    hospedado.telefono
                  );
                }}
              />
            </Col>
          </Row>

          <br />
          <br />

          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: "#77d9a1",
                  colorPrimaryHover: "#5fae81",
                  colorPrimaryActive: "#9bd8e5",
                  defaultHoverColor: "#fdfdfd",
                },
              },
            }}
          >
            <Button
              type={acompanante ? "default" : "primary"}
              size="large"
              onClick={toggleAcompanante}
              style={{
                marginLeft: "20px",
                backgroundColor: acompanante ? "#d9d9d9" : undefined, // Greyed out when state is true
                color: acompanante ? "#000" : "#fff",
              }}
            >
              {acompanante ? "Remover acompañante" : "Agregar acompañante"}
            </Button>
          </ConfigProvider>
        </Card>

        <div>
          {!acompanante ? (
            <div></div>
          ) : (
            <Card style={{ marginTop: 16 }} className="shadow-#1">
              <div className="flex items-center justify-between mb-6">
                <Meta title="Informacion del Acompañante" />

                <Checkbox
                  checked={acompanante.es_paciente}
                  onChange={async (e) => {
                    const isChecked = e.target.checked;
                    setAcompanante({ ...acompanante, es_paciente: isChecked });
                    console.log(
                      "Info del acompanante pasandose: ",
                      acompanante
                    );
                    //const formattedDate = dayjs(acompanante.fecha_nacimiento).format("DD-MM-YYYY");
                    if (isChecked) {
                      setPaciente({
                        ...paciente,
                        dni: acompanante.dni,
                        id_ocupacion: acompanante.id_ocupacion,
                        primer_nombre: acompanante.primer_nombre,
                        segundo_nombre: acompanante.segundo_nombre,
                        primer_apellido: acompanante.primer_apellido,
                        segundo_apellido: acompanante.segundo_apellido,
                        genero: acompanante.genero,
                        iglesia: acompanante.iglesia,
                        municipio_id: acompanante.municipio_id,
                        direccion: acompanante.direccion,
                        fecha_nacimiento: acompanante.fecha_nacimiento, // Asegurarse de copiar la fecha de nacimiento
                        telefono: acompanante.telefono,
                      });
                      const municipioPaciente = await fetchMunicipioById(
                        acompanante.municipio_id
                      );
                      if (municipioPaciente) {
                        setSelectedDepartamentoPaciente(
                          municipioPaciente.departamento_id
                        );
                        setSelectedMunicipioPaciente(acompanante.municipio_id);
                      }
                      setIsInfoPacienteEditable(false);
                    } else {
                      setIsInfoPacienteEditable(true);
                    }
                  }}
                  className="text-lg px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200 text-gray-800 font-semibold"
                >
                  Marcar como paciente
                </Checkbox>
              </div>

              <Row gutter={25} style={{ marginTop: 20 }}>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Input
                    prefix={<IdcardOutlined style={styleIconInput} />}
                    size="large"
                    placeholder="No. de Identidad"
                    maxLength={15}
                    type="text"
                    style={{
                      height: "100%",
                      borderColor: emptyFieldsAcompanante.dni
                        ? "#FF0A0A"
                        : undefined,
                    }}
                    value={acompanante.dni}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "dni",
                        e.target.value,
                        acompanante.dni
                      );
                    }}
                  />
                </Col>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Select
                    id="selectOcupacionAcompanante"
                    showSearch
                    searchValue={searchOcupacion}
                    onSearch={(e) => {
                      setSearchOcupacion(e.toUpperCase());
                    }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    placeholder="Ocupacion"
                    size="large"
                    notFoundContent={
                      <Button
                        loading={loading}
                        onClick={() => {
                          handleCrearOcupacion(2);
                        }}
                      >
                        Crear Ocupacion
                      </Button>
                    }
                    options={ocupaciones}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderColor: emptyFieldsAcompanante.id_ocupacion
                        ? "#FF0A0A"
                        : undefined,
                      borderWidth: emptyFieldsAcompanante.id_ocupacion
                        ? "1px"
                        : undefined,
                      borderRadius: emptyFieldsAcompanante.id_ocupacion
                        ? "8px"
                        : undefined,
                    }}
                    value={acompanante.id_ocupacion}
                    onChange={(e) => {
                      handleSetChangeAcompanante("id_ocupacion", e);
                    }}
                  ></Select>
                </Col>
              </Row>
              <Row gutter={25}>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Input
                    prefix={<UserOutlined style={styleIconInput} />}
                    size="large"
                    placeholder="Primer Nombre"
                    type="text"
                    style={{
                      height: "100%",
                      borderColor: emptyFieldsAcompanante.primer_nombre
                        ? "#FF0A0A"
                        : undefined,
                    }}
                    value={acompanante.primer_nombre}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "primer_nombre",
                        e.target.value.toUpperCase()
                      );
                    }}
                  />
                </Col>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Input
                    prefix={<UserOutlined style={styleIconInput} />}
                    size="large"
                    placeholder="Segundo Nombre"
                    type="text"
                    style={{
                      height: "100%",
                    }}
                    value={acompanante.segundo_nombre}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "segundo_nombre",
                        e.target.value.toUpperCase()
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={25}>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Input
                    prefix={<UserOutlined style={styleIconInput} />}
                    size="large"
                    placeholder="Primer Apellido"
                    type="text"
                    style={{
                      height: "100%",
                      borderColor: emptyFieldsAcompanante.primer_apellido
                        ? "#FF0A0A"
                        : undefined,
                    }}
                    value={acompanante.primer_apellido}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "primer_apellido",
                        e.target.value.toUpperCase()
                      );
                    }}
                  />
                </Col>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Input
                    prefix={<UserOutlined style={styleIconInput} />}
                    size="large"
                    placeholder="Segundo Apellido"
                    type="text"
                    style={{
                      height: "100%",
                    }}
                    value={acompanante.segundo_apellido}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "segundo_apellido",
                        e.target.value.toUpperCase()
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={25}>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Select
                    placeholder="Genero"
                    size="large"
                    options={generos}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderColor: emptyFieldsAcompanante.genero
                        ? "#FF0A0A"
                        : undefined,
                      borderWidth: emptyFieldsAcompanante.genero
                        ? "1px"
                        : undefined,
                      borderRadius: emptyFieldsAcompanante.genero
                        ? "8px"
                        : undefined,
                    }}
                    value={acompanante.genero}
                    onChange={(e) => {
                      handleSetChangeAcompanante("genero", e);
                    }}
                  ></Select>
                </Col>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Input
                    size="large"
                    placeholder="Iglesia (Opcional)"
                    type="text"
                    style={{
                      height: "100%",
                      width: "100%",
                      borderColor: emptyFieldsAcompanante.iglesia
                        ? "#FF0A0A"
                        : undefined,
                    }}
                    value={acompanante.iglesia}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "iglesia",
                        e.target.value.toUpperCase()
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Select
                      showSearch
                      value={selectedDepartamentoAcompanante}
                      onChange={(value) => {
                        setSelectedDepartamentoAcompanante(value);
                        setSelectedMunicipioAcompanante(null); // Resetear municipio al cambiar departamento
                      }}
                      placeholder="Departamento"
                      style={{
                        flex: 1,
                        borderColor: emptyFieldsAcompanante.departamento_id
                          ? "#FF0A0A"
                          : undefined,
                        borderWidth: emptyFieldsAcompanante.departamento_id
                          ? "1px"
                          : undefined,
                        borderRadius: emptyFieldsAcompanante.departamento_id
                          ? "8px"
                          : undefined,
                      }}
                      options={departamentos.map((d) => ({
                        value: d.departamento_id,
                        label: d.nombre,
                      }))}
                      size="large"
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                    <Select
                      showSearch
                      value={selectedMunicipioAcompanante}
                      onChange={(value) => {
                        setSelectedMunicipioAcompanante(value);
                        handleSetChangeAcompanante("municipio_id", value);
                      }}
                      placeholder="Municipio"
                      style={{
                        flex: 1,
                        borderColor: emptyFieldsAcompanante.municipio_id
                          ? "#FF0A0A"
                          : undefined,
                        borderWidth: emptyFieldsAcompanante.municipio_id
                          ? "1px"
                          : undefined,
                        borderRadius: emptyFieldsAcompanante.municipio_id
                          ? "8px"
                          : undefined,
                      }}
                      options={municipios.map((m) => ({
                        value: m.municipio_id,
                        label: m.nombre,
                      }))}
                      size="large"
                      disabled={!selectedDepartamentoAcompanante} // Deshabilitar si no hay departamento seleccionado
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </div>
                </Col>
              </Row>
              {/* <Row>
                <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
                  <Select
                    id="selectProcedenciaH"
                    searchValue={searchProcedencia}
                    onSearch={(e) => {
                      setSearchProcedencia(e);
                    }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    notFoundContent={
                      <Button onClick={handleCrearProcedencia}>
                        Crear Procedencia
                      </Button>
                    }
                    placeholder="Procedencia"
                    style={{ width: "100%", height: "100%" }}
                    options={procedencias}
                    size="large"
                    value={acompanante.id_procedencia}
                    onChange={(e) => {
                      handleSetChangeAcompanante("id_procedencia", e);
                    }}
                  />
                </Col>
              </Row> */}
              <Row>
                <Col flex={"100%"} style={{ marginBottom: 25, height: "auto" }}>
                  <TextArea
                    count={{ show: true }}
                    prefix={<PushpinOutlined />}
                    placeholder="Direccion Exacta"
                    maxLength={150}
                    style={{
                      borderColor: emptyFieldsAcompanante.direccion
                        ? "#FF0A0A"
                        : undefined,
                    }}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    value={acompanante.direccion}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "direccion",
                        e.target.value.toUpperCase()
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={25}>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <DatePicker
                    style={{
                      height: "100%",
                      width: "100%",
                      borderColor: emptyFieldsAcompanante.fecha_nacimiento
                        ? "#FF0A0A"
                        : undefined,
                    }}
                    placeholder="Fecha de nacimiento"
                    format={dateFormat}
                    className="my-datepicker"
                    value={handleObtenerFechaAcompanante()}
                    onChange={(e, d) => {
                      handleSetChangeAcompanante("fecha_nacimiento", d);
                    }}
                  />
                </Col>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Input
                    prefix={<PhoneOutlined style={styleIconInput} />}
                    size="large"
                    placeholder="Telefono"
                    maxLength={9}
                    type="text"
                    style={{
                      height: "100%",
                      borderColor: emptyFieldsAcompanante.telefono
                        ? "#FF0A0A"
                        : undefined,
                    }}
                    value={acompanante.telefono}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "telefono",
                        e.target.value,
                        acompanante.telefono
                      );
                    }}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </div>

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Informacion Personal del Paciente" />

          <Row gutter={25} style={{ marginTop: 20 }}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<IdcardOutlined style={styleIconInput} />}
                size="large"
                placeholder="No. de Identidad"
                maxLength={15}
                disabled={
                  acompanante.es_paciente
                    ? true
                    : isInfoPacienteEditable
                    ? false
                    : true
                }
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsPaciente.dni ? "#FF0A0A" : undefined,
                  borderWidth: emptyFieldsPaciente.dni ? "1px" : undefined,
                }}
                value={paciente.dni}
                onChange={(e) => {
                  handleSetChangePaciente("dni", e.target.value, paciente.dni);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                id="selectOcupacionPaciente"
                showSearch
                searchValue={searchOcupacion}
                onSearch={(e) => {
                  setSearchOcupacion(e.toUpperCase());
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                placeholder="Ocupacion"
                size="large"
                disabled={isInfoPacienteEditable ? false : true}
                notFoundContent={
                  <Button
                    loading={loading}
                    onClick={() => {
                      handleCrearOcupacion(1);
                    }}
                  >
                    Crear Ocupacion
                  </Button>
                }
                options={ocupaciones}
                style={{
                  width: "100%",
                  height: "100%",
                  borderColor: emptyFieldsPaciente.id_ocupacion
                    ? "#FF0A0A"
                    : undefined,
                  borderWidth: emptyFieldsPaciente.id_ocupacion
                    ? "1px"
                    : undefined,
                  borderRadius: emptyFieldsPaciente.id_ocupacion
                    ? "8px"
                    : undefined,
                }}
                value={paciente.id_ocupacion}
                onChange={(e) => {
                  handleSetChangePaciente("id_ocupacion", e);
                }}
              ></Select>
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                disabled={isInfoPacienteEditable ? false : true}
                placeholder="Primer Nombre"
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsPaciente.primer_nombre
                    ? "#FF0A0A"
                    : undefined,
                }}
                value={paciente.primer_nombre}
                onChange={(e) => {
                  handleSetChangePaciente(
                    "primer_nombre",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                placeholder="Segundo Nombre"
                type="text"
                disabled={isInfoPacienteEditable ? false : true}
                style={{
                  height: "100%",
                }}
                value={paciente.segundo_nombre}
                onChange={(e) => {
                  handleSetChangePaciente(
                    "segundo_nombre",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                disabled={isInfoPacienteEditable ? false : true}
                placeholder="Primer Apellido"
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsPaciente.primer_apellido
                    ? "#FF0A0A"
                    : undefined,
                }}
                value={paciente.primer_apellido}
                onChange={(e) => {
                  handleSetChangePaciente(
                    "primer_apellido",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                disabled={isInfoPacienteEditable ? false : true}
                placeholder="Segundo Apellido"
                type="text"
                style={{
                  height: "100%",
                }}
                value={paciente.segundo_apellido}
                onChange={(e) => {
                  handleSetChangePaciente(
                    "segundo_apellido",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                placeholder="Genero"
                size="large"
                options={generos}
                disabled={isInfoPacienteEditable ? false : true}
                style={{
                  width: "98%",
                  height: "100%",
                  borderColor: emptyFieldsPaciente.genero
                    ? "#FF0A0A"
                    : undefined,
                  borderWidth: emptyFieldsPaciente.genero ? "1px" : undefined,
                  borderRadius: emptyFieldsPaciente.genero ? "8px" : undefined,
                }}
                value={paciente.genero}
                onChange={(e) => {
                  handleSetChangePaciente("genero", e);
                }}
              ></Select>
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                size="large"
                disabled={isInfoPacienteEditable ? false : true}
                placeholder="Iglesia (Opcional)"
                type="text"
                style={{
                  height: "100%",
                  width: "97%",
                  marginLeft: "11px",
                  borderColor: emptyFieldsPaciente.iglesia
                    ? "#FF0A0A"
                    : undefined,
                }}
                value={paciente.iglesia}
                onChange={(e) => {
                  handleSetChangePaciente(
                    "iglesia",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <Select
                  showSearch
                  value={selectedDepartamentoPaciente}
                  disabled={isInfoPacienteEditable ? false : true}
                  onChange={(value) => {
                    setSelectedDepartamentoPaciente(value);
                    setSelectedMunicipioPaciente(null); // Resetear municipio al cambiar departamento
                  }}
                  placeholder="Departamento"
                  style={{
                    flex: 1,
                    borderColor: emptyFieldsPaciente.departamento_id
                      ? "#FF0A0A"
                      : undefined,
                    borderWidth: emptyFieldsPaciente.departamento_id
                      ? "1px"
                      : undefined,
                    borderRadius: emptyFieldsPaciente.departamento_id
                      ? "8px"
                      : undefined,
                  }}
                  options={departamentos.map((d) => ({
                    value: d.departamento_id,
                    label: d.nombre,
                  }))}
                  size="large"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
                <Select
                  showSearch
                  value={selectedMunicipioPaciente}
                  onChange={(value) => {
                    setSelectedMunicipioPaciente(value);
                    handleSetChangePaciente("municipio_id", value);
                  }}
                  placeholder="Municipio"
                  style={{
                    flex: 1,
                    borderColor: emptyFieldsPaciente.municipio_id
                      ? "#FF0A0A"
                      : undefined,
                    borderWidth: emptyFieldsPaciente.municipio_id
                      ? "1px"
                      : undefined,
                    borderRadius: emptyFieldsPaciente.municipio_id
                      ? "8px"
                      : undefined,
                  }}
                  options={municipios.map((m) => ({
                    value: m.municipio_id,
                    label: m.nombre,
                  }))}
                  size="large"
                  disabled={
                    !selectedDepartamentoPaciente || !isInfoPacienteEditable
                  } // Deshabilitar si no hay departamento seleccionado
                  filterOption={(input, option) =>
                    option.label.toUpperCase().includes(input.toUpperCase())
                  }
                />
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                notFoundContent={
                  <Button onClick={handleCrearProcedencia}>
                    Crear Procedencia
                  </Button>
                }
                placeholder="Procedencia"
                disabled={isEditable ? false : true}
                style={{ width: "100%", height: "100%" }}
                options={procedencias}
                size="large"
                value={paciente.id_procedencia}
                onChange={(e) => {
                  handleSetChangePaciente("id_procedencia", e);
                }}
              />
            </Col>
          </Row> */}
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: "auto" }}>
              <TextArea
                count={{ show: true }}
                disabled={isInfoPacienteEditable ? false : true}
                prefix={<PushpinOutlined />}
                placeholder="Direccion Exacta"
                maxLength={150}
                autoSize={{ minRows: 2, maxRows: 4 }}
                value={paciente.direccion}
                style={{
                  borderColor: emptyFieldsPaciente.direccion
                    ? "#FF0A0A"
                    : undefined,
                }}
                onChange={(e) => {
                  handleSetChangePaciente(
                    "direccion",
                    e.target.value.toUpperCase()
                  );
                }}
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <DatePicker
                style={{
                  height: "100%",
                  width: "100%",
                  borderColor: emptyFieldsPaciente.fecha_nacimiento
                    ? "#FF0A0A"
                    : undefined,
                }}
                placeholder="Fecha de nacimiento"
                disabled={isInfoPacienteEditable ? false : true}
                format={dateFormat}
                className="my-datepicker"
                value={handleObtenerFechaPaciente()}
                onChange={(e, d) => {
                  handleSetChangePaciente("fecha_nacimiento", d);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<PhoneOutlined style={styleIconInput} />}
                size="large"
                disabled={isInfoPacienteEditable ? false : true}
                placeholder="Telefono"
                maxLength={9}
                type="text"
                style={{
                  height: "100%",
                  borderColor: emptyFieldsPaciente.telefono
                    ? "#FF0A0A"
                    : undefined,
                }}
                value={paciente.telefono}
                onChange={(e) => {
                  handleSetChangePaciente(
                    "telefono",
                    e.target.value,
                    paciente.telefono
                  );
                }}
              />
            </Col>
          </Row>
        </Card>

        <ConfigProvider
          theme={{
            token: {
              colorPrimaryHover: "#92e1b4",
              colorPrimary: "#77d9a1",
              colorText: "#626262",
              colorBgContainerDisabled: "#fcfcfc",
              colorTextDisabled: "#939393",
            },
          }}
        >
          <Card style={{ marginTop: 16 }} className="shadow-#1">
            <Meta title="Informacion Paciente" />

            <Row gutter={25} style={{ marginTop: 20 }}>
              <Col
                xs={{ flex: "100%" }}
                lg={{ flex: "100%" }}
                style={{ marginBottom: 25, height: 50 }}
              >
                <Select
                  id="selectHospitalPaciente"
                  showSearch
                  searchValue={searchHospital}
                  onSearch={(e) => {
                    setSearchHospital(e.toUpperCase());
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  notFoundContent={
                    <Button
                      loading={loading}
                      onClick={(e) => {
                        handleCrearHospital(handleSetChangeHuesped);
                      }}
                    >
                      Crear Hospital
                    </Button>
                  }
                  placeholder="Hospital"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderColor: emptyFieldsPaciente.id_hospital
                      ? "#FF0A0A"
                      : undefined,
                    borderWidth: emptyFieldsPaciente.id_hospital
                      ? "1px"
                      : undefined,
                    borderRadius: emptyFieldsPaciente.id_hospital
                      ? "8px"
                      : undefined,
                  }}
                  options={hospitales}
                  size="large"
                  value={paciente.id_hospital}
                  onChange={(hospitalSeleccionado) => {
                    handleSetChangePaciente(
                      "id_hospital",
                      hospitalSeleccionado
                    );

                    setPisos([]);
                    setSalas([]);
                    

                    // El texto del ultimo valor seleccionado en piso y sala se queda como placeholder por alguna razon (WIP - Fix)
                    loadPisos(hospitalSeleccionado);  
                  }}
                />
              </Col>
            </Row>

            <Row gutter={25} style={{ marginTop: 20 }}>
              <Col
                xs={{ flex: "100%" }}
                lg={{ flex: "50%" }}
                style={{ marginBottom: 25, height: 50 }}
              >
                <Select
                  id="selectPiso"
                  showSearch
                  searchValue={searchPiso}
                  onSearch={(e) => {
                    setSearchPiso(e.toUpperCase());
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  notFoundContent={
                    <Button
                      loading={loading}
                      onClick={(e) => {
                        handleCrearPiso();
                      }}
                    >
                      Crear Piso
                    </Button>
                  }
                  placeholder="Piso"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderColor: emptyFieldsPaciente.id_piso
                      ? "#FF0A0A"
                      : undefined,
                    borderWidth: emptyFieldsPaciente.id_piso
                      ? "1px"
                      : undefined,
                    borderRadius: emptyFieldsPaciente.id_piso
                      ? "8px"
                      : undefined,
                  }}
                  options={pisos}
                  size="large"
                  value={paciente.id_piso}
                  onChange={(pisoSeleccionado) => {
                    handleSetChangePaciente("id_piso", pisoSeleccionado);
                    loadSalas(pisoSeleccionado);
                  }}
                />
              </Col>

              <Col
                xs={{ flex: "100%" }}
                lg={{ flex: "50%" }}
                style={{ marginBottom: 25, height: 50 }}
              >
                <Select
                  id="selectSala"
                  showSearch
                  searchValue={searchSala}
                  onSearch={(e) => {
                    setSearchSala(e.toUpperCase());
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  notFoundContent={
                    <Button
                      loading={loading}
                      onClick={(e) => {
                        handleCrearSala();
                      }}
                    >
                      Crear Sala
                    </Button>
                  }
                  placeholder="Sala"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderColor: emptyFieldsPaciente.id_sala
                      ? "#FF0A0A"
                      : undefined,
                    borderWidth: emptyFieldsPaciente.id_sala
                      ? "1px"
                      : undefined,
                    borderRadius: emptyFieldsPaciente.id_sala
                      ? "8px"
                      : undefined,
                  }}
                  options={salas}
                  size="large"
                  value={paciente.id_sala}
                  onChange={(e) => {
                    handleSetChangePaciente("id_sala", e);
                  }}
                />
              </Col>
            </Row>

            <Row gutter={25}>
              <Col
                xs={{ flex: "100%" }}
                lg={{ flex: "50%" }}
                style={{ marginBottom: 25, height: 50 }}
              >
                <Input
                  prefix={<TeamOutlined style={styleIconInput} />}
                  size="large"
                  placeholder="Parentesco"
                  maxLength={9}
                  type="text"
                  style={{
                    height: "100%",
                    borderColor: emptyFieldsPaciente.parentesco
                      ? "#FF0A0A"
                      : undefined,
                  }}
                  value={paciente.parentesco}
                  onChange={(e) => {
                    handleSetChangePaciente(
                      "parentesco",
                      e.target.value.toUpperCase()
                    );
                  }}
                />
              </Col>
              <Col
                xs={{ flex: "100%" }}
                lg={{ flex: "50%" }}
                style={{ marginBottom: 25, height: 50 }}
              >
                <Select
                  id="selectCausa"
                  showSearch
                  searchValue={searchCausaVisita}
                  onSearch={(e) => {
                    setSearchCausaVisita(e.toUpperCase());
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  notFoundContent={
                    <Button
                      onClick={(e) => {
                        handleCrearCausaVisita();
                      }}
                    >
                      Crear Causa
                    </Button>
                  }
                  placeholder="Causa de Visita"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderColor: emptyFieldsPaciente.id_causa_visita
                      ? "#FF0A0A"
                      : undefined,
                    borderWidth: emptyFieldsPaciente.id_causa_visita
                      ? "1px"
                      : undefined,
                    borderRadius: emptyFieldsPaciente.id_causa_visita
                      ? "8px"
                      : undefined,
                  }}
                  options={causasVisita}
                  size="large"
                  value={paciente.id_causa_visita}
                  onChange={(e) => {
                    handleSetChangePaciente("id_causa_visita", e);
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col flex={"100%"} style={{ marginBottom: 25, height: "auto" }}>
                <TextArea
                  prefix={<FileSearchOutlined />}
                  placeholder="Observacion Sobre El Paciente"
                  maxLength={150}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{}}
                  value={paciente.observacion}
                  onChange={(e) => {
                    handleSetChangePaciente(
                      "observacion",
                      e.target.value.toUpperCase()
                    );
                  }}
                />
              </Col>
            </Row>
          </Card>
        </ConfigProvider>

        {/* ================ Check patrono | Check Afiliado  ================ */}
        {paciente.id_hospital === null ||
        !hospitalesPatronos.includes(paciente.id_hospital) ? (
          <div></div>
        ) : (
          <PatronoHuesped
            changeUser={hospedado}
            isEditable={true}
            handleSetChangeUser={handleSetChangeHuesped}
          />
        )}

        <Fechas />

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Row style={{ marginBottom: 20 }}>
            <Input.TextArea
              prefix={<SearchOutlined style={styleIconInput} />}
              size="large"
              placeholder="Observacion de la Reservacion"
              value={hospedado.observacion_reservacion}
              onChange={(e) => {
                e.preventDefault();

                handleSetChangeHuesped(
                  "observacion_reservacion",
                  e.target.value.toUpperCase()
                );
              }}
            />
          </Row>

          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Checkbox
                checked={paciente.becada}
                onChange={(e) =>
                  handleSetChangePaciente("becada", e.target.checked)
                }
                className="text-lg px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200  text-white-800 font-semibold"
              >
                Cortesía
              </Checkbox>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="" />
          <div
            style={{
              display: "flex",
              gap: "large",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: "#fa8787",
                    colorPrimaryHover: "#ea8383",
                    colorPrimaryBorder: "#ffff",
                  },
                },
              }}
            >
              <Button
                type="primary"
                size={"large"}
                onClick={() => {
                  ResetearAtributos();
                }}
              >
                Cancelar
              </Button>
            </ConfigProvider>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: "#77d9a1",
                    colorPrimaryHover: "#5fae81",
                    colorPrimaryActive: "#9bd8e5",
                    defaultHoverColor: "#fdfdfd",
                  },
                },
              }}
            >
              <Button
                type="primary"
                size={"large"}
                onClick={handleSubmit}
                style={{ marginLeft: "20px" }}
                loading={loading}
              >
                Registrar
              </Button>
            </ConfigProvider>
          </div>
        </Card>

        <Modal
          title="Éxito"
          centered
          open={successModalVisible}
          onOk={() => setSuccessModalVisible(false)}
        >
          <h1 className="text-white-800 font-bold py-3 text-lg">
            Solicitud agendada Correctamente
          </h1>

          {contenModal}
        </Modal>

        <Modal
          title="Se Encontro en Lista Negra"
          open={listaNegraModalVisible}
          onOk={() => setListaNegraModalVisible(false)}
        >
          {contentModalNegra}
        </Modal>

        <Modal
          title="Error"
          open={errorModalVisible}
          onCancel={() => setErrorModalVisible(false)}
          onOk={() => setErrorModalVisible(false)}
        >
          <p>{errorMessage}</p>
        </Modal>
      </ConfigProvider>
    </Flex>
  );
}

export default Hospedar;
