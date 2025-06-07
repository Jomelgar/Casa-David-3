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

import axios from "axios";
import axiosInstance from '../../api/axiosInstance';
import camaApi from "../../api/Cama.api";
import personaApi from "../../api/Persona.api";
import solicitudApi from "../../api/Solicitud.api";
import huespedApi from "../../api/Huesped.api";
import pacienteApi from "../../api/Paciente.api";
import PaisApi from "../../api/Pais.api";
import pacienteHuespedApi from "../../api/pacienteHuesped.api";
import { getDepartamentos } from "../../api/departamentoApi";
import {getDepartamentoByPais} from "../../api/departamentoApi";
import { getMunicipiosByDepartamentoId } from "../../api/municipioApi";
import { getMunicipioById } from "../../api/municipioApi";
import PersonApi from "../../api/Persona.api";
import UserApi from "../../api/User.api";

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

import { COUNTRIES_API } from "../../api/Huesped.api";
import { formatPhoneNumber } from "../../api/Huesped.api";
const { Meta } = Card;
const { TextArea } = Input;
const { Content } = Layout;
const { Option } = Select;

dayjs.extend(customParseFormat);

const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

//Regex formats
const dateFormat = "DD-MM-YYYY";
const telFormat = /\d{4}-\d{4}/;


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
  const [idlugar,setLugar]=useState(0);
  const [dniFormat, setdniFormat] = useState("####");
  const [idPais, setIdPais] = useState(null);
  const [digitos,setdigitos] = useState(0);
  const [TelFormat,setTelFormat] = useState("");
  const obtenerDigitos = (tipo) => tipo === "DNI" ? digitos : 15;

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
/*
  const validarFormato = (valor, formatoEsperado) => {
  const soloNumeros = valor.replace(/\D/g, '');
  const cantidadNumeros = soloNumeros.length;
  const totalNumerosEsperados = (formatoEsperado.match(/#/g) || []).length;

  // Construir regex a partir del formato
  const regexStr = "^" + formatoEsperado
    .replace(/#/g, "\\d")
    .replace(/[-\s]/g, (s) => `\\${s}`) + "$";
  const regex = new RegExp(regexStr);

  // Asignar a variables globales (declaradas arriba)
  digitos = totalNumerosEsperados;
  setdniFormat = formatoEsperado;
  obtenerDigitos = (tipo) => tipo === "DNI" ? digitos : 15;
  };
*/
  
  const validarFormato = (valor, formatoEsperado) => {
  //const soloNumeros = valor.replace(/\D/g, ''); ####-####-#####
  const totalNumerosEsperados = (formatoEsperado.match(/#/g) || []).length;

  // Construir regex a partir del formato
  const regexStr = "^" + formatoEsperado
    .replace(/#/g, "\\d")
    .replace(/[-\s]/g, (s) => `\\${s}`) + "$";
  const regex = new RegExp(regexStr);

  // Asignar a variables globales (declaradas arriba)
  setdigitos = totalNumerosEsperados;
  setdniFormat = formatoEsperado;
  //esValido = regex.test(valor); // Puedes usar esta también si necesitas validar

  obtenerDigitos = (tipo) => tipo === "DNI" ? digitos : 15;
};

function formatearNumero(numero, codigoPais) {
  const formato = formatosTelefono[codigoPais];
  if (!formato) {
    // Si no se encuentra el formato, devuelve el número sin cambios
    return numero;
  }

  // Eliminar caracteres no numéricos
  const soloNumeros = numero.replace(/\D/g, '');

  let resultado = '';
  let indice = 0;

  for (let i = 0; i < formato.length; i++) {
    const segmento = soloNumeros.substr(indice, formato[i]);
    if (segmento) {
      resultado += segmento;
      indice += formato[i];
      if (i < formato.length - 1) {
        resultado += '-';
      }
    }
  }

  return resultado;
} 

function formatearNumeroDinamico(numero, codigoPais) {
  const formato = formatosTelefono[codigoPais];
  if (!formato) {
    return {
      formateado: numero,
      cantidad: numero.replace(/\D/g, '').length,
      excedido: false
    };
  }

  // Eliminar caracteres no numéricos
  const numerosLimpios = numero.replace(/\D/g, '');
  const maxDigitos = formato.reduce((total, segmento) => total + segmento, 0);

  // Bloquear si se excede el máximo
  if (numerosLimpios.length > maxDigitos) {
    return {
      formateado: numero.slice(0, -1), // Elimina el último dígito ingresado
      cantidad: maxDigitos,
      excedido: true
    };
  }

  // Aplicar formato si está dentro del límite
  let resultado = '';
  let indice = 0;

  for (let i = 0; i < formato.length; i++) {
    const segmento = numerosLimpios.substr(indice, formato[i]);
    if (!segmento) break;

    if (i > 0) resultado += '-';
    resultado += segmento;
    indice += formato[i];
  }

  // Agregar dígitos restantes (sin guiones extra)
  if (indice < numerosLimpios.length) {
    resultado += numerosLimpios.substr(indice);
  }

  return {
    formateado: resultado,
    cantidad: maxDigitos,
    excedido: false
  };
}

const formatosTelefono = {
  "+1201": [3, 3, 4],      // USA/Canadá: XXX-XXX-XXXX
  "+7": [3, 2, 2, 2],   // Rusia: XXX-XX-XX-XX
  "+20": [2, 3, 4],     // Egipto: XX-XXX-XXXX
  "+27": [2, 3, 4],     // Sudáfrica: XX-XXX-XXXX
  "+30": [3, 4],        // Grecia: XXX-XXXX
  "+31": [2, 4, 4],     // Países Bajos: XX-XXXX-XXXX
  "+32": [2, 3, 4],     // Bélgica: XX-XXX-XXXX
  "+33": [1, 2, 2, 2, 2], // Francia: X-XX-XX-XX-XX
  "+34": [3, 3, 3],     // España: XXX-XXX-XXX
  "+36": [2, 3, 4],     // Hungría: XX-XXX-XXXX
  "+39": [3, 3, 4],     // Italia: XXX-XXX-XXXX
  "+40": [3, 3, 4],     // Rumania: XXX-XXX-XXXX
  "+41": [2, 3, 4],     // Suiza: XX-XXX-XXXX
  "+43": [1, 4, 4],     // Austria: X-XXXX-XXXX
  "+44": [2, 4, 4],     // Reino Unido: XX-XXXX-XXXX
  "+45": [2, 2, 2, 2],  // Dinamarca: XX-XX-XX-XX
  "+46": [3, 3, 4],     // Suecia: XXX-XXX-XXXX
  "+47": [2, 2, 2, 2],  // Noruega: XX-XX-XX-XX
  "+48": [2, 3, 2, 2],  // Polonia: XX-XXX-XX-XX
  "+49": [3, 3, 4],     // Alemania: XXX-XXX-XXXX
  "+51": [3, 3, 4],     // Perú: XXX-XXX-XXXX
  "+52": [3, 4, 4],     // México: XXX-XXXX-XXXX
  "+54": [2, 4, 4],     // Argentina: XX-XXXX-XXXX
  "+55": [2, 5, 4],     // Brasil: XX-XXXXX-XXXX
  "+56": [2, 3, 4],     // Chile: XX-XXX-XXXX
  "+57": [3, 3, 4],     // Colombia: XXX-XXX-XXXX
  "+58": [3, 3, 4],     // Venezuela: XXX-XXX-XXXX
  "+60": [2, 3, 4],     // Malasia: XX-XXX-XXXX
  "+61": [2, 4, 4],     // Australia: XX-XXXX-XXXX
  "+62": [2, 4, 4],     // Indonesia: XX-XXXX-XXXX
  "+63": [2, 3, 4],     // Filipinas: XX-XXX-XXXX
  "+64": [2, 3, 4],     // Nueva Zelanda: XX-XXX-XXXX
  "+65": [4, 4],        // Singapur: XXXX-XXXX
  "+66": [2, 3, 4],     // Tailandia: XX-XXX-XXXX
  "+81": [2, 4, 4],     // Japón: XX-XXXX-XXXX
  "+82": [2, 4, 4],     // Corea del Sur: XX-XXXX-XXXX
  "+84": [3, 4, 4],     // Vietnam: XXX-XXXX-XXXX
  "+86": [2, 4, 4],     // China: XX-XXXX-XXXX
  "+90": [3, 3, 4],     // Turquía: XXX-XXX-XXXX
  "+91": [3, 3, 4],     // India: XXX-XXX-XXXX
  "+92": [3, 3, 4],     // Pakistán: XXX-XXX-XXXX
  "+93": [2, 3, 4],     // Afganistán: XX-XXX-XXXX
  "+94": [2, 3, 4],     // Sri Lanka: XX-XXX-XXXX
  "+95": [2, 3, 4],     // Myanmar: XX-XXX-XXXX
  "+98": [3, 3, 4],     // Irán: XXX-XXX-XXXX
  "+212": [2, 3, 4],    // Marruecos: XX-XXX-XXXX
  "+213": [2, 3, 4],    // Argelia: XX-XXX-XXXX
  "+216": [2, 3, 4],    // Túnez: XX-XXX-XXXX
  "+218": [2, 3, 4],    // Libia: XX-XXX-XXXX
  "+220": [3, 4],       // Gambia: XXX-XXXX
  "+221": [3, 4],       // Senegal: XXX-XXXX
  "+222": [2, 2, 4],    // Mauritania: XX-XX-XXXX
  "+223": [2, 2, 4],    // Malí: XX-XX-XXXX
  "+224": [3, 4],       // Guinea: XXX-XXXX
  "+225": [2, 2, 4],    // Costa de Marfil: XX-XX-XXXX
  "+226": [2, 2, 4],    // Burkina Faso: XX-XX-XXXX
  "+227": [2, 2, 4],    // Níger: XX-XX-XXXX
  "+228": [2, 2, 4],    // Togo: XX-XX-XXXX
  "+229": [2, 2, 4],    // Benín: XX-XX-XXXX
  "+230": [3, 4],       // Mauricio: XXX-XXXX
  "+231": [3, 4],       // Liberia: XXX-XXXX
  "+232": [2, 3, 4],    // Sierra Leona: XX-XXX-XXXX
  "+233": [2, 3, 4],    // Ghana: XX-XXX-XXXX
  "+234": [3, 3, 4],    // Nigeria: XXX-XXX-XXXX
  "+235": [2, 2, 4],    // Chad: XX-XX-XXXX
  "+236": [2, 2, 4],    // República Centroafricana: XX-XX-XXXX
  "+237": [2, 2, 4],    // Camerún: XX-XX-XXXX
  "+238": [3, 4],       // Cabo Verde: XXX-XXXX
  "+239": [3, 4],       // Santo Tomé y Príncipe: XXX-XXXX
  "+240": [3, 4],       // Guinea Ecuatorial: XXX-XXXX
  "+241": [2, 2, 4],    // Gabón: XX-XX-XXXX
  "+242": [2, 2, 4],    // República del Congo: XX-XX-XXXX
  "+243": [2, 3, 4],    // RD Congo: XX-XXX-XXXX
  "+244": [2, 3, 4],    // Angola: XX-XXX-XXXX
  "+245": [3, 4],       // Guinea-Bisáu: XXX-XXXX
  "+246": [3, 4],       // Territorio Británico del Océano Índico: XXX-XXXX
  "+248": [1, 3, 4],    // Seychelles: X-XXX-XXXX
  "+249": [2, 3, 4],    // Sudán: XX-XXX-XXXX
  "+250": [3, 4],       // Ruanda: XXX-XXXX
  "+251": [2, 3, 4],    // Etiopía: XX-XXX-XXXX
  "+252": [2, 3, 4],    // Somalia: XX-XXX-XXXX
  "+253": [2, 2, 4],    // Yibuti: XX-XX-XXXX
  "+254": [2, 3, 4],    // Kenia: XX-XXX-XXXX
  "+255": [2, 3, 4],    // Tanzania: XX-XXX-XXXX
  "+256": [2, 3, 4],    // Uganda: XX-XXX-XXXX
  "+257": [2, 2, 4],    // Burundi: XX-XX-XXXX
  "+258": [2, 3, 4],    // Mozambique: XX-XXX-XXXX
  "+260": [2, 3, 4],    // Zambia: XX-XXX-XXXX
  "+261": [2, 2, 4],    // Madagascar: XX-XX-XXXX
  "+262": [3, 3, 4],    // Reunión: XXX-XXX-XXXX
  "+263": [2, 3, 4],    // Zimbabue: XX-XXX-XXXX
  "+264": [2, 3, 4],    // Namibia: XX-XXX-XXXX
  "+265": [2, 3, 4],    // Malaui: XX-XXX-XXXX
  "+266": [2, 2, 4],    // Lesoto: XX-XX-XXXX
  "+267": [2, 3, 4],    // Botsuana: XX-XXX-XXXX
  "+268": [2, 2, 4],    // Suazilandia: XX-XX-XXXX
  "+269": [2, 2, 4],    // Comoras: XX-XX-XXXX
  "+290": [4],          // Santa Elena: XXXX
  "+291": [2, 3, 4],    // Eritrea: XX-XXX-XXXX
  "+297": [3, 4],       // Aruba: XXX-XXXX
  "+298": [3, 4],       // Islas Feroe: XXX-XXXX
  "+299": [2, 2, 4],    // Groenlandia: XX-XX-XXXX
  "+350": [3, 4],       // Gibraltar: XXX-XXXX
  "+351": [3, 3, 3],    // Portugal: XXX-XXX-XXX
  "+352": [2, 3, 4],    // Luxemburgo: XX-XXX-XXXX
  "+353": [2, 3, 4],    // Irlanda: XX-XXX-XXXX
  "+354": [3, 4],       // Islandia: XXX-XXXX
  "+355": [3, 3, 4],    // Albania: XXX-XXX-XXXX
  "+356": [4, 4],       // Malta: XXXX-XXXX
  "+357": [2, 3, 4],    // Chipre: XX-XXX-XXXX
  "+358": [2, 3, 4],    // Finlandia: XX-XXX-XXXX
  "+359": [2, 3, 4],    // Bulgaria: XX-XXX-XXXX
  "+370": [3, 3, 4],    // Lituania: XXX-XXX-XXXX
  "+371": [2, 3, 4],    // Letonia: XX-XXX-XXXX
  "+372": [3, 4],       // Estonia: XXX-XXXX
  "+373": [3, 3, 4],    // Moldavia: XXX-XXX-XXXX
  "+374": [2, 3, 4],    // Armenia: XX-XXX-XXXX
  "+375": [2, 3, 4],    // Bielorrusia: XX-XXX-XXXX
  "+376": [3, 3],       // Andorra: XXX-XXX
  "+377": [3, 3, 4],    // Mónaco: XXX-XXX-XXXX
  "+378": [3, 3, 4],    // San Marino: XXX-XXX-XXXX
  "+379": [3, 3, 4],    // Ciudad del Vaticano: XXX-XXX-XXXX
  "+380": [2, 3, 4],    // Ucrania: XX-XXX-XXXX
  "+381": [2, 3, 4],    // Serbia: XX-XXX-XXXX
  "+382": [2, 3, 4],    // Montenegro: XX-XXX-XXXX
  "+383": [2, 3, 4],    // Kosovo: XX-XXX-XXXX
  "+385": [2, 3, 4],    // Croacia: XX-XXX-XXXX
  "+386": [2, 3, 4],    // Eslovenia: XX-XXX-XXXX
  "+387": [2, 3, 4],    // Bosnia y Herzegovina: XX-XXX-XXXX
  "+389": [2, 3, 4],    // Macedonia del Norte: XX-XXX-XXXX
  "+420": [3, 3, 4],    // República Checa: XXX-XXX-XXXX
  "+421": [2, 3, 4],    // Eslovaquia: XX-XXX-XXXX
  "+423": [3, 3, 4],    // Liechtenstein: XXX-XXX-XXXX
  "+500": [5],          // Islas Malvinas: XXXXX
  "+501": [3, 4],       // Belice: XXX-XXXX
  "+502": [4, 4],       // Guatemala: XXXX-XXXX
  "+503": [4, 4],       // El Salvador: XXXX-XXXX
  "+504": [4, 4],       // Honduras: XXXX-XXXX
  "+505": [4, 4],       // Nicaragua: XXXX-XXXX
  "+506": [4, 4],       // Costa Rica: XXXX-XXXX
  "+507": [4, 4],       // Panamá: XXXX-XXXX
  "+508": [3, 4],       // San Pedro y Miquelón: XXX-XXXX
  "+509": [2, 2, 4],    // Haití: XX-XX-XXXX
  "+590": [3, 3, 4],    // Guadalupe: XXX-XXX-XXXX
  "+591": [3, 3, 4],    // Bolivia: XXX-XXX-XXXX
  "+592": [3, 4],       // Guyana: XXX-XXXX
  "+593": [2, 3, 4],    // Ecuador: XX-XXX-XXXX
  "+594": [3, 3, 4],    // Guayana Francesa: XXX-XXX-XXXX
  "+595": [2, 3, 4],    // Paraguay: XX-XXX-XXXX
  "+596": [3, 3, 4],    // Martinica: XXX-XXX-XXXX
  "+597": [3, 4],       // Surinam: XXX-XXXX
  "+598": [2, 3, 4],    // Uruguay: XX-XXX-XXXX
  "+599": [3, 4],       // Curazao: XXX-XXXX
  "+670": [3, 4],       // Timor Oriental: XXX-XXXX
  "+672": [1, 3, 4],    // Territorio Antártico Australiano: X-XXX-XXXX
  "+673": [3, 4],       // Brunéi: XXX-XXXX
  "+674": [3, 4],       // Nauru: XXX-XXXX
  "+675": [3, 4],       // Papúa Nueva Guinea: XXX-XXXX
  "+676": [2, 3, 4],    // Tonga: XX-XXX-XXXX
  "+677": [2, 3, 4],    // Islas Salomón: XX-XXX-XXXX
  "+678": [2, 3, 4],    // Vanuatu: XX-XXX-XXXX
  "+679": [3, 4],       // Fiyi: XXX-XXXX
  "+680": [3, 4],       // Palaos: XXX-XXXX
  "+681": [2, 2, 4],    // Wallis y Futuna: XX-XX-XXXX
  "+682": [2, 3, 4],    // Islas Cook: XX-XXX-XXXX
  "+683": [4],          // Niue: XXXX
  "+685": [2, 3, 4],    // Samoa: XX-XXX-XXXX
  "+686": [2, 3, 4],    // Kiribati: XX-XXX-XXXX
  "+687": [3, 4],       // Nueva Caledonia: XXX-XXXX
  "+688": [3, 4],       // Tuvalu: XXX-XXXX
  "+689": [2, 2, 4],    // Polinesia Francesa: XX-XX-XXXX
  "+690": [1, 3, 4],    // Tokelau: X-XXX-XXXX
  "+691": [3, 4],       // Micronesia: XXX-XXXX
  "+692": [3, 4],       // Islas Marshall: XXX-XXXX
  "+850": [2, 3, 4],    // Corea del Norte: XX-XXX-XXXX
  "+852": [4, 4],       // Hong Kong: XXXX-XXXX
  "+853": [4, 4],       // Macao: XXXX-XXXX
  "+855": [2, 3, 4],    // Camboya: XX-XXX-XXXX
  "+856": [2, 3, 4],    // Laos: XX-XXX-XXXX
  "+880": [2, 3, 4],    // Bangladés: XX-XXX-XXXX
  "+886": [2, 4, 4],    // Taiwán: XX-XXXX-XXXX
  "+960": [3, 4],       // Maldivas: XXX-XXXX
  "+961": [1, 3, 4],    // Líbano: X-XXX-XXXX
  "+962": [2, 3, 4],    // Jordania: XX-XXX-XXXX
  "+963": [2, 3, 4],    // Siria: XX-XXX-XXXX
  "+964": [3, 3, 4],    // Irak: XXX-XXX-XXXX
  "+965": [4, 4],       // Kuwait: XXXX-XXXX
  "+966": [2, 3, 4],    // Arabia Saudita: XX-XXX-XXXX
  "+967": [2, 3, 4],    // Yemen: XX-XXX-XXXX
  "+968": [2, 3, 4],    // Omán: XX-XXX-XXXX
  "+970": [2, 3, 4],    // Palestina: XX-XXX-XXXX
  "+971": [2, 3, 4],    // Emiratos Árabes Unidos: XX-XXX-XXXX
  "+972": [2, 3, 4],    // Israel: XX-XXX-XXXX
  "+973": [4, 4],       // Baréin: XXXX-XXXX
  "+974": [4, 4],       // Catar: XXXX-XXXX
  "+975": [2, 3, 4],    // Bután: XX-XXX-XXXX
  "+976": [2, 3, 4],    // Mongolia: XX-XXX-XXXX
  "+977": [2, 3, 4],    // Nepal: XX-XXX-XXXX
  "+992": [3, 3, 4],    // Tayikistán: XXX-XXX-XXXX
  "+993": [1, 3, 4],    // Turkmenistán: X-XXX-XXXX
  "+994": [2, 3, 4],    // Azerbaiyán: XX-XXX-XXXX
  "+995": [3, 3, 4],    // Georgia: XXX-XXX-XXXX
  "+996": [3, 3, 4],    // Kirguistán: XXX-XXX-XXXX
  "+998": [3, 3, 4],    // Uzbekistán: XXX-XXX-XXXX
};



 const [selected, setSelected] = useState("DNI");
 
  const TipoDocumentoSelector = () => {
  

  return (
    <Row gutter={16} style={{ marginTop: 20,} }>
      <Col>
        <CustomCheckboxButton
          label="Dni"
          selected={selected === "DNI"}
          onClick={() => setSelected("DNI")}
        />
      </Col>
      <Col>
        <CustomCheckboxButton
          label="DNI Extranjero"
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
const [selected2, setSelected2] = useState("DNI");
 
  const TipoDocumentoSelectorSegundaPersona = () => {
  

  return (
    <Row gutter={16} style={{ marginTop: 5,justify:"start"} }>
      <Col>
        <CustomCheckboxButton
          label="DNI"
          selected={selected2 === "DNI"}
          onClick={() => setSelected2("DNI")}
        />
      </Col>
      <Col>
        <CustomCheckboxButton
          label="DNI Extranjero"
          selected={selected2 === "DNI Extranjero"}
          onClick={() => setSelected2("DNI Extranjero")}
        />
      </Col>
      <Col>
        <CustomCheckboxButton
          label="Pasaporte"
          selected={selected2 === "Pasaporte"}
          onClick={() => setSelected2("Pasaporte")}
        />
      </Col>
    </Row>
  );
};

const [selected3, setSelected3] = useState("DNI");
 
  const TipoDocumentoSelectorTerceraPersona = () => {
  return (
    <Row gutter={16} style={{ marginTop: 20,justify:"start"} }>
      <Col>
        <CustomCheckboxButton
          label="DNI"
          selected={selected3 === "DNI"}
          onClick={() => setSelected3("DNI")}
        />
      </Col>
      <Col>
        <CustomCheckboxButton
          label="Dni Extranjero"
          selected={selected3 === "DNI Extranjero"}
          onClick={() => setSelected3("DNI Extranjero")}
        />
      </Col>
      <Col>
        <CustomCheckboxButton
          label="Pasaporte"
          selected={selected3 === "Pasaporte"}
          onClick={() => setSelected3("Pasaporte")}
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
          marginRight: "100px",
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

const [countries, setCountries] = useState([]);
const [selectedCountry, setSelectedCountry] = useState(null);
const [selectedCountry2, setSelectedCountry2] = useState(null);
const [selectedCountry3, setSelectedCountry3] = useState(null);


const [selectedCountryCode,setSelectedCountryCode]= useState(null);
const [selectedCountryCode2,setSelectedCountryCode2]= useState(null);
const [selectedCountryCode3,setSelectedCountryCode3]= useState(null);

const [cantidadNumeros, setcantidadNumeros]= useState(15);
const [cantidadNumeros2, setcantidadNumeros2]= useState(15);
const [cantidadNumeros3, setcantidadNumeros3]= useState(15);
const [PacienteMarcado,setPacienteMarcado]= useState(0);

const cargarPaisdeUso = async () => {
  const id_pais = await personaApi.getPaisByPersona(usuario.id_persona);
  const paises = await PaisApi.getPaisForTable();
  const pais = paises.data.find(p => p.id_pais === id_pais.data.id_pais);
  return pais;
};

const cargarFormato = async () => {
  const pais = await cargarPaisdeUso(); // ← agregar await
  const formato = pais.formato_dni;
  return formato;
};

const cargarCAFormato = async () => {
  const pais = await cargarPaisdeUso(); // ← agregar await
  const formato = pais.formato_dni;
  return (formato.length);
};

// useEffect que carga ambos valores al inicio
useEffect(() => {
  const fetchFormato = async () => {
    const formato1 = await cargarFormato();
    const cantidad = await cargarCAFormato();
    setdniFormat(formato1);
    setdigitos(cantidad); // ✅ correctamente llamada
  };
  fetchFormato();
}, []);


useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(COUNTRIES_API);
      const filtered = res.data
        .filter(c => c.idd?.root && c.idd?.suffixes && c.flags?.png)
        .map(c => ({
          name: c.name.common,
          code: c.idd.root + (c.idd.suffixes[0] || ''),
          flag: c.flags.png
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setCountries(filtered);

      const pais = await cargarPaisdeUso();
      console.log(pais);
      const selected = await filtered.find(c => c.code === pais.referencia_telefonica);
      setSelectedCountry(selected || filtered[0]);
      setSelectedCountry2(selected || filtered[0]);
      setSelectedCountry3(selected || filtered[0]);

      setSelectedCountryCode(pais.referencia_telefonica);
      setSelectedCountryCode2(pais.referencia_telefonica);
      setSelectedCountryCode3(pais.referencia_telefonica);
    } catch (error) {
      console.error('Error al cargar datos de países:', error);
    }
  };

  fetchData();
}, []);

const [referenciaTelefonica,setreferenciaTelefonica]= useState('');
const [referenciaTelefonica2,setreferenciaTelefonica2]= useState('');
const [referenciaTelefonica3,setreferenciaTelefonica3]= useState('');


const countrySelector = (
  <Select
  suffixIcon={<PhoneOutlined style={{ color: "#8c8c8c", width:230}} />}
    disabled={selected === "DNI"}
    showSearch
    style={{
      width: 250,
      height: 48,
      
    }}
    value={selectedCountry?.code}
    onChange={(value) => {
      const found = countries.find((c) => c.code === value);
      setSelectedCountry(found);
      setSelectedCountryCode(selectedCountry?.code);
    }}
    optionLabelProp="label"
    
  >
    {countries.map((country) => (
      <Select.Option
        key={country.code}
        value={country.code}
        label={`${country.name} (${country.code})`}
        setSelectedCountry={country.name}
        setSelectedCountryCode={country.code}
        setreferenciaTelefonica= {country.code}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={country.flag}
            alt={country.name}
            style={{ width: 20, height: 15 }}
          />
          {country.name} ({country.code})
        </div>
      </Select.Option>
    ))}
  </Select>
);

const countrySelector2 = (
  <Select
  suffixIcon={<PhoneOutlined style={{ color: "#8c8c8c", width:230}} />}
    disabled={selected2 === "DNI"}
    showSearch
    style={{
      width: 250,
      height: 48,
      //borderRadius: 8,
      //backgroundColor: "#fafafa",
      //borderColor: "#d9d9d9",
    }}
    value={selectedCountry2?.code}
    
    onChange={(value) => {
      const found = countries.find((c) => c.code === value);
      setSelectedCountry2(found);
      setSelectedCountryCode2(selectedCountry2?.code);
    }}
    optionLabelProp="label"
    
  >
    {countries.map((country) => (
      <Select.Option
        key={country.code}
        value={country.code}
        label={`${country.name} (${country.code})`}
        setSelectedCountry2={country.name}
        setSelectedCountryCode2={country.code}
        setreferenciaTelefonica2= {country.code}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={country.flag}
            alt={country.name}
            style={{ width: 20, height: 15 }}
          />
          {country.name} ({country.code})
        </div>
      </Select.Option>
    ))}
  </Select>
);

const countrySelector3 = (
  <Select
  suffixIcon={<PhoneOutlined style={{ color: "#8c8c8c", width:230}} />}
    disabled={selected3 === "DNI"}
    showSearch
    style={{
      width: 250,
      height: 48,
      //borderRadius: 8,
      //backgroundColor: "#fafafa",
      //borderColor: "#d9d9d9",
    }}
    value={selectedCountry3?.code}
    onChange={(value) => {
      const found = countries.find((c) => c.code === value);
      setSelectedCountry3(found);
      setSelectedCountryCode3(selectedCountry3?.code);
    }}
    optionLabelProp="label"
    
  >
    {countries.map((country) => (
      <Select.Option
        key={country.code}
        value={country.code}
        label={`${country.name} (${country.code})`}
        setSelectedCountry3={country.name}
        setSelectedCountryCode3={country.code}
        setreferenciaTelefonica3= {country.code}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={country.flag}
            alt={country.name}
            style={{ width: 20, height: 15 }}
          />
          {country.name} ({country.code})
        </div>
      </Select.Option>
    ))}
  </Select>
);


const seleccionarAfiliado = (
 <Checkbox
      style={{ width: 270, height: 45, marginRight:20, marginLeft:370}}
      checked={acompanante.es_paciente}
      onChange={async (e) => {
        const isChecked = e.target.checked;
        setAcompanante({ ...acompanante, es_paciente: isChecked });
        

        if (isChecked) {
          setPacienteMarcado(1);
          setPaciente({
            ...paciente,
            dni: hospedado.dni,
            id_ocupacion: hospedado.id_ocupacion,
            primer_nombre: hospedado.primer_nombre,
            segundo_nombre: hospedado.segundo_nombre,
            primer_apellido: hospedado.primer_apellido,
            segundo_apellido: hospedado.segundo_apellido,
            genero: hospedado.genero,
            iglesia: hospedado.iglesia,
            municipio_id: hospedado.municipio_id,
            direccion: hospedado.direccion,
            fecha_nacimiento: hospedado.fecha_nacimiento,
            telefono: hospedado.telefono,
          });

          const municipioPaciente = await fetchMunicipioById(
            hospedado.municipio_id
          );
          if (municipioPaciente) {
            setSelectedDepartamentoPaciente(municipioPaciente.departamento_id);
            setSelectedMunicipioPaciente(hospedado.municipio_id);
          }

          setIsInfoPacienteEditable(false);
        } else {
          setPacienteMarcado(0);
          setIsInfoPacienteEditable(true);
        }
      }}
      className="text-lg px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200 text-gray-800 font-semibold"
    >
      Marcar Huesped como afiliado
    </Checkbox>
);


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
        if(selected=="DNI"){
        newValue = aplicarFormatoDNI(value, dniFormat);
        
        if (validarFormatoConGuiones(newValue, dniFormat)) {
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
        }}
        break;

      case "fecha_nacimiento":
        if (value.length > 10) {
          const fecha = value.split("-");
          newValue = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
          setHospedado({ ...hospedado, fecha_nacimiento: value });
        }
        break;


      case "dni_afiliado":
        if (selected3=="DNI" && previousValue !== null && value.length > previousValue.length) {
          newValue = aplicarFormatoDNI(value, dniFormat);
          if (validarFormatoConGuiones(newValue, dniFormat)) {
            searchDni(newValue, 1);
          }
        }
        break;
      case "telefono":
  console.log("Huesped...Pais: ", selectedCountry, ", code: ", selectedCountry.code);
  if (selectedCountry && selectedCountry.code) {
    const resultado = formatearNumeroDinamico(value, selectedCountry.code);
    newValue = resultado.formateado;
    console.log("Cantidad de dígitos: ", resultado.cantidad, ", Formato: ", resultado.formateado);
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

  const aplicarFormatoDNI = (valor, formato) => {
  const soloDigitos = valor.replace(/\D/g, ''); // Elimina guiones y otros no números
  let resultado = '';
  let i = 0;

  for (const char of formato) {
    if (char === '#') {
      if (i < soloDigitos.length) {
        resultado += soloDigitos[i++];
      } else {
        break;
      }
    } else {
      if (i < soloDigitos.length) {
        resultado += char;
      }
    }
  }

  return resultado;
};

const validarFormatoConGuiones = (valor, formato) => {
  // Convertir el formato (ej: ###-####-#####) en expresión regular
  const regexStr = "^" + formato
    .replace(/#/g, "\\d") // '#' se convierte en dígito
    .replace(/[-\s]/g, (s) => `\\${s}`) + "$"; // escapamos guiones o espacios

  const regex = new RegExp(regexStr);
  return regex.test(valor); // true si coincide exactamente
};


  // Funcion que maneja el cambio del texto en los inputs/selects del front
  const handleSetChangePaciente = (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {


      case "dni":
        if(selected3=="DNI"){
        newValue = aplicarFormatoDNI(value, dniFormat);
        if (validarFormatoConGuiones(newValue, dniFormat)) {
          searchDni(newValue, 1);
        }}


        break;

      case "direccion":
        if (value.length > 0) {
          setPaciente({ ...paciente, direccion: value });
        }
        break;

      case "telefono":
 case "telefono":
  console.log("Paciente....Pais: ", selectedCountry3, ", code: ", selectedCountry3.code);
  if (selectedCountry3 && selectedCountry3.code) {
    const resultado = formatearNumeroDinamico(value, selectedCountry3.code);
    newValue = resultado.formateado;
    console.log("Cantidad de dígitos: ", resultado.cantidad, ", Formato: ", resultado.formateado);
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
        if(selected2=="DNI"){
        newValue = aplicarFormatoDNI(value, dniFormat);
        if (validarFormatoConGuiones(newValue, dniFormat)) {
          searchDni(newValue, 1);
        }

        if (validarFormatoConGuiones(newValue, dniFormat)) {
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
        console.log("Acom....Pais: ", selectedCountry2, ", code: ", selectedCountry2.code);
  if (selectedCountry2 && selectedCountry2.code) {
    const resultado = formatearNumeroDinamico(value, selectedCountry2.code);
    newValue = resultado.formateado;
    console.log("Cantidad de dígitos: ", resultado.cantidad, ", Formato: ", resultado.formateado);
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
    // Validación campos vacíos
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
      openNotification(2, "Campos Vacios en Huesped", "No puede dejar campos vacios");
      return false;
    }

    // Validación teléfono (corregida)
    if (key === "telefono" && value.length > 0) {
      if (!selectedCountry?.code) {
        openNotification(2, "Teléfono del Huesped", "Debe seleccionar un país primero");
        return false;
      }

      const resultado = formatearNumeroDinamico(value, selectedCountry.code);
      const digitosRequeridos = formatosTelefono[selectedCountry.code]?.reduce((a, b) => a + b, 0);
      
      if (resultado.excedido || resultado.formateado.replace(/-/g, '').length < digitosRequeridos) {
        openNotification(
          2,
          "Teléfono del Huesped",
          `Formato inválido. Use el formato para `
        );
        return false;
      }
    }

    // Validación DNI
    if (key === "dni" && selected === "DNI" && value.length !== digitos) {
      openNotification(2, "DNI del huesped", "El formato del DNI no es válido");
      return false;
    }
  }
  return true;
};

const validarCamposPaciente = () => {
  for (const [key, value] of Object.entries(paciente)) {
    // Validación campos vacíos
    if (
      value === "" &&
      key !== "segundo_nombre" &&
      key !== "segundo_apellido" &&
      key !== "telefono" &&
      key !== "observacion" &&
      key !== "iglesia"
    ) {
      openNotification(2, "Campos Vacios en Paciente", "No puede dejar campos vacios");
      return false;
    }

    // Validación teléfono (corregida)
    if (key === "telefono" && value.length > 0) {
      if (!selectedCountry3?.code) {
        openNotification(2, "Teléfono del Paciente", "Debe seleccionar un país primero");
        return false;
      }

      const resultado = formatearNumeroDinamico(value, selectedCountry3.code);
      const digitosRequeridos = formatosTelefono[selectedCountry3.code]?.reduce((a, b) => a + b, 0);
      
      if (resultado.excedido || resultado.formateado.replace(/-/g, '').length < digitosRequeridos) {
        openNotification(
          2,
          "Teléfono del Paciente",
          `Formato inválido.)`
        );
        return false;
      }
    }

    // Validación DNI
    if (key === "dni" && selected3 === "DNI" &&  value.length !== digitos) {
      openNotification(2, "DNI del paciente", "El formato del DNI no es válido");
      return false;
    }
  }
  return true;
};

const validarCamposAcompanante = () => {
  for (const [key, value] of Object.entries(acompanante)) {
    // Validación campos vacíos
    if (
      value === "" &&
      key !== "segundo_nombre" &&
      key !== "segundo_apellido" &&
      key !== "telefono" &&
      key !== "iglesia"
    ) {
      openNotification(2, "Campos Vacios en Acompañante", "No puede dejar campos vacios");
      return false;
    }

    // Validación teléfono (corregida)
    if (key === "telefono" && value.length > 0) {
      if (!selectedCountry2?.code) {
        openNotification(2, "Teléfono del Acompañante", "Debe seleccionar un país primero");
        return false;
      }

      const resultado = formatearNumeroDinamico(value, selectedCountry2.code);
      const digitosRequeridos = formatosTelefono[selectedCountry2.code]?.reduce((a, b) => a + b, 0);
      
      if (resultado.excedido || resultado.formateado.replace(/-/g, '').length < digitosRequeridos) {
        openNotification(
          2,
          "Teléfono del Acompañante",
          `Formato inválido. `
        );
        return false;
      }
    }

    // Validación DNI
    if (key === "dni" && selected2 === "DNI" && value.length !== digitos) {
      openNotification(2, "DNI del Acompañante", "El formato del DNI no es válido");
      return false;
    }
  }
  return true;
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
        referencia_telefonica:referenciaTelefonica,
        identidad_extrangero: selected === "DNI Extranjero"? true : false,
        pasaporte: selected === "Pasaporte"? true:false 
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
        referencia_telefonica:referenciaTelefonica3,
        identidad_extrangero: selected3 === "DNI Extranjero"? true : false,
        pasaporte: selected3 === "Pasaporte"? true:false 
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
            referencia_telefonica:referenciaTelefonica2,
            identidad_extrangero: selected2 === "DNI Extranjero"? true : false,
            pasaporte: selected2 === "Pasaporte"? true:false 
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
    
    const fetchData = async () => {
    try{
        
        console.log("SI FUNCIONOOOOOOOOOOOOOOOOOOOOOO");
        console.error("SI FUNCIONOOOOOOOOOOOOOOOOOOOOOO");
    }catch (error) {
        console.error("Error al conseguir info:", error);
        console.log("NO FUNCIONOOOOOOOOOOOOOOOOOOOOOO");
        console.error("NO FUNCIONOOOOOOOOOOOOOOOOOOOOOO");
      }}
      console.log("Ya salio, Pais es: "+idPais+", Formato de dni: "+dniFormat+", cantidad de numeros: "+", Lugar: "+idlugar);
    loadOcupaciones();
    loadProcedencias();
    loadHospitales(); // Cargar los hospitales para que se puedan elegir en el select apenas se meta a la vista
    //////////////////////////Cambios para municipio y departamento de prueba
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
        const pais = await personaApi.getPaisByPersona(usuario.id_persona);
        const departamentosData = await getDepartamentoByPais(pais.data.id_pais);
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
        <TipoDocumentoSelector />
  <Row gutter={16} style={{ marginTop: 5 } }justify="end">
    {/* Selector de tipo de documento */}
    {PacienteMarcado !== 2 && (
    
    <Checkbox
      style={{ width: 270, height: 45, marginRight:20, marginLeft:370}}
      checked={acompanante.es_paciente}
      onChange={async (e) => {
        const isChecked = e.target.checked;
        setAcompanante({ ...acompanante, es_paciente: isChecked });
        

        if (isChecked) {
          setPacienteMarcado(1);
          setPaciente({
            ...paciente,
            dni: hospedado.dni,
            id_ocupacion: hospedado.id_ocupacion,
            primer_nombre: hospedado.primer_nombre,
            segundo_nombre: hospedado.segundo_nombre,
            primer_apellido: hospedado.primer_apellido,
            segundo_apellido: hospedado.segundo_apellido,
            genero: hospedado.genero,
            iglesia: hospedado.iglesia,
            municipio_id: hospedado.municipio_id,
            direccion: hospedado.direccion,
            fecha_nacimiento: hospedado.fecha_nacimiento,
            telefono: hospedado.telefono,
          });

          const municipioPaciente = await fetchMunicipioById(
            hospedado.municipio_id
          );
          if (municipioPaciente) {
            setSelectedDepartamentoPaciente(municipioPaciente.departamento_id);
            setSelectedMunicipioPaciente(hospedado.municipio_id);
          }

          setIsInfoPacienteEditable(false);
        } else {
          setPacienteMarcado(0);
          setIsInfoPacienteEditable(true);
        }
      }}
      className="text-lg px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200 text-gray-800 font-semibold"
    >
      Marcar como paciente
    </Checkbox>
    )}
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
                maxLength={obtenerDigitos(selected)}
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
                placeholder={"Ocupacion"}
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
                  height: 40,
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
  addonBefore={countrySelector}
  
  //prefix={<PhoneOutlined style={styleIconInput} />}
  size="large"
  placeholder="Telefono"
  //maxLength={9}
  type="text"
  style={{
    height: "100%",
    borderColor: emptyFieldsHuesped.telefono ? "#FF0A0A" : undefined,
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

            <Card style={{ marginTop: 5 }} className="shadow-#1">
              <Meta title="Informacion del Acompañante" />
              <div className="flex items-center justify-between mb-6">
                
                <Row>
                <TipoDocumentoSelectorSegundaPersona />
                </Row>
                <Row gutter={16} style={{ marginTop: 70 } }justify="end">
                
                {PacienteMarcado !== 1 && (
                <Checkbox
                  style={{ width: 270, height: 45, marginRight:20, marginLeft:370}}

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
                      setPacienteMarcado(0);
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
                      setPacienteMarcado(2);
                      setIsInfoPacienteEditable(true);
                    }
                  }}
                  className="text-lg px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200 text-gray-800 font-semibold"
                >
                  Marcar como paciente
                </Checkbox>
                )}
                
              </Row>
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
                    placeholder={selected2}
                    maxLength={obtenerDigitos(selected2)}
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
                      height: 40,
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
  addonBefore={countrySelector2}
  
  //prefix={<PhoneOutlined style={styleIconInput} />}
  size="large"
  placeholder="Telefono"
  //maxLength={9}
  type="text"
  style={{
    height: "100%",
    borderColor: emptyFieldsHuesped.telefono ? "#FF0A0A" : undefined,
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
          <TipoDocumentoSelectorTerceraPersona/>
          <Row gutter={25} style={{ marginTop: 30 }}>
            
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<IdcardOutlined style={styleIconInput} />}
                size="large"
                placeholder={selected3}
                maxLength={obtenerDigitos(selected3)}
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
                  height: 40,
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
  addonBefore={countrySelector3}
  
  //prefix={<PhoneOutlined style={styleIconInput} />}
  size="large"
  placeholder="Telefono"
  //maxLength={9}
  type="text"
  style={{
    height: "100%",
    borderColor: emptyFieldsHuesped.telefono ? "#FF0A0A" : undefined,
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
