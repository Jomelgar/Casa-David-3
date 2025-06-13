import React, { useState, useEffect } from "react";
import { PiHouseLight } from "react-icons/pi";
import { CiMoneyBill } from "react-icons/ci";
import { FaGift, FaBed } from "react-icons/fa";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Card,
  Col,
  Row,
  Layout,
  Breadcrumb,
  DatePicker,
  Table,
  ConfigProvider,
  Input,
  Button,
  Select,
  Spin,
  Divider,
  Collapse
} from "antd";
import axiosInstance from "../../../api/axiosInstance";
import { useLayout } from "../../../context/LayoutContext";
import { getDepartamentos, getDepartamentoByPais } from "../../../api/departamentoApi";
import { getMunicipiosByDepartamentoId } from "../../../api/municipioApi";
import { getMunicipioById } from "../../../api/municipioApi";
import { getDepartamentoById } from "../../../api/departamentoApi";
import { getDepartamentoByMunicipioId } from "../../../api/departamentoApi";
import { getAllCausas } from "../../../api/CausaVisita.api";
import { getPacienteRequest } from "../../../api/Paciente.api";
import OcupacionesApi from "../../../api/Ocupaciones.api";
import ReservacionesApi from "../../../api/Reservaciones.api";
import OfrendasApi from "../../../api/Ofrenda.api";
import LugarApi from "../../../api/Lugar.api"
import hospitalesApi from "../../../api/Hospitales.api";
import PopUpExport from "./PopUpsInformes/PopUpExport";
import UserApi from "../../../api/User.api";
import { getUserFromToken } from "../../../utilities/auth.utils";
import PaisApi from "../../../api/Pais.api";
const{ Panel } = Collapse;

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

const Informes = () => {
  const { setCurrentPath } = useLayout();
  const userLog  = getUserFromToken();

  const [fechaInicio, setFechaInicio] = useState(dayjs().format(dateFormat));
  const [fechaFinal, setFechaFinal] = useState(dayjs().format(dateFormat));
  const [loading, setLoading] = useState(false);
  const [monedaLocal, setMonedaLocal] = useState(null);

  const [totalDonacion, setTotalDonacion] = useState(0);
  const [totalBeca, setTotalBeca] = useState(0);
  const [camasCortesia, setCamasCortesia] = useState(0);
  const [camasOcupadas, setCamasOcupadas] = useState(0);
  const [evangelizadas, setEvangelizadas] = useState(0);
  const [recibieronCristo, setRecibieronCristo] = useState(0);
  const [reconciliadas, setReconciliadas] = useState(0);
  const [hospedadosDia, setHospedadosDia] = useState(0);
  const [primeraVez, setPrimeraVez] = useState(0);

  const [hombre, setHombres] = useState(0);
  const [mujer, setMujeres] = useState(0);

  // Para mandarlo al excel de reportes y que se genere.
  // ¿Se puede hacer mejor? Si. ¿Hay tiempo? No.
  const [hombreInfo, setHombresInfo] = useState([]);
  const [mujerInfo, setMujeresInfo] = useState([]);

  // Variables de los filtros
  const [paises, setPaises] = useState([]);
  const [lugares,setLugares] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedPais, setSelectedPais] = useState(userLog.role === "master"? -1 : userLog.id_pais);
  const [selectedLugar, setSelectedLugar] = useState(userLog.role === "master"? -1 : userLog.id_lugar);
  const [selectedDepartamento, setSelectedDepartamento] = useState(-1);
  const [municipios, setMunicipios] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState(-1);
  const [genero, setGenero] = useState(-1);
  const [generos, setGeneros] = useState([
    { value: -1, label: "Todos los Generos" },
    { value: 1, label: "Masculino" },
    { value: 2, label: "Femenino" },
  ]);
  const [edadEscrita, setEdadEscrita] = useState();
  const [hospitalSeleccionado, setHospitalSeleccionado] = useState(-1);
  const [listaHospitales, setListaHospitales] = useState([]);
  const [causaVisitaSeleccionada, setCausaVisitaSeleccionada] = useState(-1);
  const [listaCausasVisita, setListaCausasVisita] = useState([]);
  const [ocupacionSeleccionada, setOcupacionSeleccionada] = useState(-1);
  const [listaOcupaciones, setListaOcupaciones] = useState([]);

  const[exportVisible, setExportVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [
    fechaInicio,
    fechaFinal,
    selectedPais,
    selectedLugar,
    selectedDepartamento,
    selectedMunicipio,
    genero,
    edadEscrita,
    hospitalSeleccionado,
    causaVisitaSeleccionada,
    ocupacionSeleccionada,
  ]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const departamentosData = await getDepartamentoByPais(selectedPais);
        departamentosData.unshift({
            departamento_id: -1,
            nombre: "Todos los Departamentos",
          });
        setDepartamentos(departamentosData);
      } catch (error) {
        console.error("Error fetching departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, [selectedPais]);

  useEffect(() => {
    const fetchMunicipios = async () => {
      if (selectedDepartamento !== null) {
        try {
          const municipiosData = await getMunicipiosByDepartamentoId(
            selectedDepartamento
          );
          municipiosData.unshift({
            municipio_id: -1,
            nombre: "Todos los Municipios",
          });
          setMunicipios(municipiosData);
        } catch (error) {
          console.error("Error fetching municipios:", error);
        }
      } else {
        setMunicipios([]);
      }
    };

    fetchMunicipios();
  }, [selectedDepartamento]);

  const loadPaises = async() =>
  {
    const paisData = await PaisApi.getPaisForTable();
    paisData.data.unshift({
        id_pais: -1,
        nombre: "Todos los Paises",
      })
    setPaises(paisData.data);
  };

  useEffect(
    () => {
      const fetchLugar =async () =>
        {
          const lugarData = await LugarApi.getLugarByPais(selectedPais);
          console.log(lugarData.data); 
          lugarData.data.unshift({
            id_lugar: -1,
            codigo: "Todas las Casas"
          })
          setLugares( lugarData.data || [])
        }
        fetchLugar();
    },[selectedPais]);
    
  const loadHospitales = async () => {
    try {
      let response;
      if (selectedPais === -1) {
        response = await hospitalesApi.getHospitalRequest();
      } else {
        response = await hospitalesApi.getHospitalByPais(selectedPais);
      }
      const hospitales = response?.data?.length ? response.data : [];

        const listaDeHospitales = hospitales.map((e) => ({
          value: e.id_hospital,
          label: e.nombre + " , " + e.direccion,
        }));
        listaDeHospitales.unshift({
          value: -1,
          label: "Todos los Hospitales",
        });
        setListaHospitales(listaDeHospitales);
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const loadCausasVisita = async () => {
    try {
      const causas = await getAllCausas();
      causas.unshift({
        id_causa_visita: -1,
        causa: "Todas las Causas",
      });
      setListaCausasVisita(
        causas.map((causa) => ({
          value: causa.id_causa_visita,
          label: causa.causa,
        }))
      );
    } catch (error) {
      console.error("Error fetching causas de visita:", error);
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
        const listaDeOcupaciones = response.data.map((e) => ({
          value: e.id_ocupacion,
          label: e.descripcion,
        }));
        listaDeOcupaciones.unshift({
          value: -1,
          label: "Todas las ocupaciones",
        });
        setListaOcupaciones(listaDeOcupaciones);
      } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las ocupaciones");
      }
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const getPacienteFromId = async (id) => {
    try {
      const response = await getPacienteRequest(id);
      if (!response) {
        throw new Error("No se pudo cargar la informacion del paciente");
      }
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("No se pudo cargar la informacion del paciente");
      }
    } catch (error) {
      console.error("Error fetching paciente:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await loadPaises();
    loadHospitales();
    loadCausasVisita();
    loadOcupaciones();

    const data = [];

    try {
      //* Sacar data de los Hombres
      const responseHombres = await ReservacionesApi.getReservacionesHombres(
        fechaInicio,
        fechaFinal
      );

      if (
        !responseHombres ||
        responseHombres.status < 200 ||
        responseHombres.status >= 300
      ) {
        throw new Error("No se pudo cargar la informacion de los hombres");
      }

      let hombresData = responseHombres.data.hombres.rows;
      console.log(hombresData)
      // Filtrar por genero
      if (genero !== -1) {
        hombresData = hombresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.genero ===
            (genero === 1 ? "MASCULINO" : "FEMENINO")
        );
      }

      //Filtro por Pais
      if(selectedPais !== -1)
      {
        hombresData = await hombresData.filter((persona)=>
              persona.PacienteHuesped.Huesped.Persona.Municipio.Departamento.id_pais === selectedPais);
      }
      //Filtro por Lugar
      if(selectedLugar !== -1)
      {
        hombresData = await hombresData.filter((persona)=>
          persona.PacienteHuesped.Huesped.Persona.id_lugar === selectedLugar
        )
      }
      // Filtrar por departamento
      if (selectedDepartamento !== -1) {
        const filteredHombres = await Promise.all(
          hombresData.map(async (persona) => {
            const departamento = await getDepartamentoByMunicipioId(
              persona.PacienteHuesped.Huesped.Persona.municipio_id
            );
            return departamento.departamento_id === selectedDepartamento
              ? persona
              : null;
          })
        );

        hombresData = filteredHombres.filter((persona) => persona !== null);
      }

      // Filtrar por municipio
      if (selectedMunicipio !== -1) {
        hombresData = hombresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.municipio_id ===
            selectedMunicipio
        );
      }

      // (WIP) Filtrar por edad
      if (
        edadEscrita !== undefined &&
        edadEscrita !== null &&
        edadEscrita.trim() !== ""
      ) {
        const edadBuscada = Number(edadEscrita);
        if (isNaN(edadBuscada)) {
          console.error("La edad escrita no es un número válido:", edadEscrita);
        } else {
          console.log("Edad escrita: ", edadBuscada);

          hombresData = hombresData.filter((persona) => {
            const fechaNacimiento =
              persona.PacienteHuesped.Huesped.Persona.fecha_nacimiento;

            if (!fechaNacimiento) {
              console.warn(
                "La persona no tiene fecha de nacimiento definida:",
                persona
              );
              return false;
            }

            const birthDate = dayjs(fechaNacimiento);
            if (!birthDate.isValid()) {
              console.error(
                "La fecha de nacimiento no es válida:",
                fechaNacimiento
              );
              return false;
            }

            const age = dayjs().diff(birthDate, "year");
            return age === edadBuscada;
          });
        }
      }

      // Filtrar por hospital
      if (hospitalSeleccionado !== -1) {
        hombresData = hombresData.filter(
          (persona) => persona.id_hospital === hospitalSeleccionado
        );
      }

      // Filtrar por causa de visita
      if (causaVisitaSeleccionada !== -1) {
        const filteredHombres = await Promise.all(
          hombresData.map(async (persona) => {
            const pacienteObject = await getPacienteFromId(
              persona.PacienteHuesped.id_paciente
            );
            return pacienteObject.id_causa_visita === causaVisitaSeleccionada
              ? persona
              : null;
          })
        );
        hombresData = filteredHombres.filter((persona) => persona !== null);
      }

      // Filtrar por ocupacion
      if (ocupacionSeleccionada !== -1) {
        hombresData = hombresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.id_ocupacion ===
            ocupacionSeleccionada
        );
      }

      setHombres(hombresData.length);
      setHombresInfo(hombresData);

      //* Sacar los datos de las Mujeres
      const responseMujeres = await ReservacionesApi.getReservacionesMujeres(
        fechaInicio,
        fechaFinal
      );

      if (
        !responseMujeres ||
        responseMujeres.status < 200 ||
        responseMujeres.status >= 300
      ) {
        throw new Error("No se pudo cargar la informacion de las mujeres");
      }

      //console.log("Data de las mujeres: ", responseMujeres.data);
      let mujeresData = responseMujeres.data.hombres.rows;

      // Filtrar por genero
      if (genero !== -1) {
        mujeresData = mujeresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.genero ===
            (genero === 1 ? "MASCULINO" : "FEMENINO")
        );
      }

      //Filtrar por pais
      if(selectedPais !== -1)
        {
          mujeresData = mujeresData.filter((persona)=>
            persona.PacienteHuesped.Huesped.Persona.Municipio.Departamento.id_pais === selectedPais
          );
        }
      //Filtrar por Lugar
      if(selectedLugar !== -1)
        { 
          mujeresData = mujeresData.filter((persona)=>
          persona.PacienteHuesped.Huesped.Persona.id_lugar === selectedLugar
          );
        }
      // Filtrar por departamento
      if (selectedDepartamento !== -1) {
        const filteredMujeres = await Promise.all(
          mujeresData.map(async (persona) => {
            const departamento = await getDepartamentoByMunicipioId(
              persona.PacienteHuesped.Huesped.Persona.municipio_id
            );
            return departamento.departamento_id === selectedDepartamento
              ? persona
              : null;
          })
        );
        mujeresData = filteredMujeres.filter((persona) => persona !== null);
      }

      // Filtrar por municipio
      if (selectedMunicipio !== -1) {
        mujeresData = mujeresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.municipio_id ===
            selectedMunicipio
        );
      }

      // Filtrar por hospital
      if (hospitalSeleccionado !== -1) {
        mujeresData = mujeresData.filter(
          (persona) => persona.id_hospital === hospitalSeleccionado
        );
      }

      // Filtrar por causa de visita
      if (causaVisitaSeleccionada !== -1) {
        const filteredMujeres = await Promise.all(
          mujeresData.map(async (persona) => {
            const pacienteObject = await getPacienteFromId(
              persona.PacienteHuesped.id_paciente
            );
            return pacienteObject.id_causa_visita === causaVisitaSeleccionada
              ? persona
              : null;
          })
        );
        mujeresData = filteredMujeres.filter((persona) => persona !== null);
      }

      // Filtrar por ocupacion
      if (ocupacionSeleccionada !== -1) {
        mujeresData = mujeresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.id_ocupacion ===
            ocupacionSeleccionada
        );
      }

      if (
        edadEscrita !== undefined &&
        edadEscrita !== null &&
        edadEscrita.trim() !== ""
      ) {
        const edadBuscada = Number(edadEscrita);
        if (isNaN(edadBuscada)) {
          console.error("La edad escrita no es un número válido:", edadEscrita);
        } else {
          console.log("Edad escrita: ", edadBuscada);

          mujeresData = mujeresData.filter((persona) => {
            const fechaNacimiento =
              persona.PacienteHuesped.Huesped.Persona.fecha_nacimiento;

            if (!fechaNacimiento) {
              console.warn(
                "La persona no tiene fecha de nacimiento definida:",
                persona
              );
              return false;
            }

            const birthDate = dayjs(fechaNacimiento);
            if (!birthDate.isValid()) {
              console.error(
                "La fecha de nacimiento no es válida:",
                fechaNacimiento
              );
              return false;
            }

            const age = dayjs().diff(birthDate, "year");
            return age === edadBuscada;
          });
        }
      }

      setMujeres(mujeresData.length);
      setMujeresInfo(mujeresData);

      // * Donaciones de no becados
      const responseDonaciones = await OfrendasApi.getOfrendasDonaciones(
        fechaInicio,
        fechaFinal
      );
      if (
        !responseDonaciones ||
        responseDonaciones.status < 200 ||
        responseDonaciones.status >= 300
      ) {
        throw new Error("No se pudo cargar la informacion de las donaciones");
      }

      let donaciones =
        responseDonaciones.data.donacion;
      //Filtrar donacion por pais
      if(selectedPais !== -1)
      {
         donaciones = donaciones.filter((ofrenda)=>
            ofrenda.id_pais === selectedPais
          ); 
      }

      if(selectedLugar !== -1)
        {
          donaciones = donaciones.filter((ofrenda) => ofrenda.Reservacion.Cama
            ? ofrenda.Reservacion.Cama.Habitacion.id_lugar === selectedLugar
            : false
          ) || [];
        }
      
      // Filtrar donacion por genero
      if (genero !== -1) {
        donaciones = donaciones.filter(
          (ofrenda) =>
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.genero ===
            (genero === 1 ? "MASCULINO" : "FEMENINO")
        );
      }

      // Obtener los municipios y departamentos para las personas
      const personasyProcedencia = await Promise.all(
        donaciones.map(async (ofrenda) => {
          const municipioId =
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.municipio_id;
          if (!municipioId) {
            console.error("Municipio ID is undefined for ofrenda:", ofrenda);
            return ofrenda;
          }
          const municipio = await getMunicipioById(municipioId);
          const departamento = await getDepartamentoById(
            municipio.departamento_id
          );
          return {
            ...ofrenda,
            Reservacion: {
              ...ofrenda.Reservacion,
              PacienteHuesped: {
                ...ofrenda.Reservacion.PacienteHuesped,
                Huesped: {
                  ...ofrenda.Reservacion.PacienteHuesped.Huesped,
                  Persona: {
                    ...ofrenda.Reservacion.PacienteHuesped.Huesped.Persona,
                    departamento_id: departamento.departamento_id,
                    municipio_id: municipio.municipio_id,
                  },
                },
              },
            },
          };
        })
      );

      // Filtrar donacion por departamento
      if (selectedDepartamento !== -1) {
        donaciones = personasyProcedencia.filter(
          (ofrenda) =>
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona
              .departamento_id === selectedDepartamento
        );
      }

      // Filtrar donacion por municipio
      if (selectedMunicipio !== -1) {
        donaciones = personasyProcedencia.filter(
          (ofrenda) =>
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.municipio_id ===
            selectedMunicipio
        );
      }

      // Filtrar donacion por hospital
      if (hospitalSeleccionado !== -1) {
        donaciones = donaciones.filter(
          (ofrenda) => ofrenda.Reservacion.id_hospital === hospitalSeleccionado
        );
      }

      // Filtrar donaciones por causa de visita
      if (causaVisitaSeleccionada !== -1) {
        donaciones = await Promise.all(
          donaciones.map(async (ofrenda) => {
            const pacienteObject = await getPacienteFromId(
              ofrenda.Reservacion.PacienteHuesped.id_paciente
            );
            return pacienteObject.id_causa_visita === causaVisitaSeleccionada
              ? ofrenda
              : null;
          })
        );
        donaciones = donaciones.filter((ofrenda) => ofrenda !== null);
      }

      // Filtrar donaciones por ocupacion
      if (ocupacionSeleccionada !== -1) {
        donaciones = donaciones.filter(
          (ofrenda) =>
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.id_ocupacion ===
            ocupacionSeleccionada
        );
      }

      // Filtrar donaciones por edad
      if (
        edadEscrita !== undefined &&
        edadEscrita !== null &&
        edadEscrita.trim() !== ""
      ) {
        const edadBuscada = Number(edadEscrita);
        if (isNaN(edadBuscada)) {
          console.error("La edad escrita no es un número válido:", edadEscrita);
        } else {
          console.log("Edad escrita: ", edadBuscada);

          donaciones = donaciones.filter((ofrenda) => {
            const fechaNacimiento =
              ofrenda.Reservacion.PacienteHuesped.Huesped.Persona
                .fecha_nacimiento;

            if (!fechaNacimiento) {
              console.warn(
                "La persona no tiene fecha de nacimiento definida:",
                ofrenda
              );
              return false;
            }

            const birthDate = dayjs(fechaNacimiento);
            if (!birthDate.isValid()) {
              console.error(
                "La fecha de nacimiento no es válida:",
                fechaNacimiento
              );
              return false;
            }

            const age = dayjs().diff(birthDate, "year");
            return age === edadBuscada;
          });
        }
      }

      donaciones.forEach((ofrenda) => {
        data.push({
          key: ofrenda.id_ofrenda,
          nombre:
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
            " " +
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_apellido,
          dni: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.dni,
          fecha: dayjs(ofrenda.fecha).format(dateFormat),
          valor: parseFloat(ofrenda.valor),
        });
      });

      const totalDonaciones = donaciones.reduce(
        (total, reservacion) => total + parseFloat(reservacion.valor),
        0
      );

      if(selectedPais !== -1)setTotalDonacion(totalDonaciones);
      else setTotalDonacion(0);

      // * Donaciones de becados
      const responseBecados = await OfrendasApi.getOfrendasBecados(
        fechaInicio,
        fechaFinal
      );

      if (
        !responseBecados &&
        responseBecados.status < 200 &&
        responseBecados.status >= 300
      ) {
        setLoading(false);
        return;
      }

      let becados =
        responseBecados.data.becados;

      if(selectedPais !== -1)
      {
        becados = becados.filter((ofrenda) => 
            ofrenda.id_pais === selectedPais
          )
      }
      if(selectedLugar !== -1)
        {
          becados = becados.filter((ofrenda) =>
          ofrenda.Reservacion.Cama
            ? ofrenda.Reservacion.Cama.Habitacion.id_lugar === selectedLugar
            : false
          ) || []
        }
      // Filtrar donaciones por genero
      if (genero !== -1) {
        becados = becados.filter(
          (ofrenda) =>
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.genero ===
            (genero === 1 ? "MASCULINO" : "FEMENINO")
        );
      }

      // Obtener los municipios y departamentos para las personas
      const becadosyProcedencia = await Promise.all(
        becados.map(async (ofrenda) => {
          const municipioId =
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.municipio_id;
          if (!municipioId) {
            console.error("Municipio ID is undefined for ofrenda:", ofrenda);
            return ofrenda;
          }
          const municipio = await getMunicipioById(municipioId);
          const departamento = await getDepartamentoById(
            municipio.departamento_id
          );
          return {
            ...ofrenda,
            Reservacion: {
              ...ofrenda.Reservacion,
              PacienteHuesped: {
                ...ofrenda.Reservacion.PacienteHuesped,
                Huesped: {
                  ...ofrenda.Reservacion.PacienteHuesped.Huesped,
                  Persona: {
                    ...ofrenda.Reservacion.PacienteHuesped.Huesped.Persona,
                    departamento_id: departamento.departamento_id,
                    municipio_id: municipio.municipio_id,
                  },
                },
              },
            },
          };
        })
      );

      // Filtrar donaciones por departamento
      if (selectedDepartamento !== -1) {
        becados = becadosyProcedencia.filter(
          (ofrenda) =>
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona
              .departamento_id === selectedDepartamento
        );
      }

      // Filtrar donaciones por municipio
      if (selectedMunicipio !== -1) {
        becados = becadosyProcedencia.filter(
          (ofrenda) =>
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.municipio_id ===
            selectedMunicipio
        );
      }

      // Filtrar donaciones por hospital
      if (hospitalSeleccionado !== -1) {
        becados = becados.filter(
          (ofrenda) => ofrenda.Reservacion.id_hospital === hospitalSeleccionado
        );
      }

      // Filtrar donaciones por causa de visita
      if (causaVisitaSeleccionada !== -1) {
        becados = await Promise.all(
          becados.map(async (ofrenda) => {
            const pacienteObject = await getPacienteFromId(
              ofrenda.Reservacion.PacienteHuesped.id_paciente
            );
            return pacienteObject.id_causa_visita === causaVisitaSeleccionada
              ? ofrenda
              : null;
          })
        );
        becados = becados.filter((ofrenda) => ofrenda !== null);
      }

      // Filtrar donaciones por ocupacion
      if (ocupacionSeleccionada !== -1) {
        becados = becados.filter(
          (ofrenda) =>
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.id_ocupacion ===
            ocupacionSeleccionada
        );
      }

      // Filtrar donaciones por edad
      if (
        edadEscrita !== undefined &&
        edadEscrita !== null &&
        edadEscrita.trim() !== ""
      ) {
        const edadBuscada = Number(edadEscrita);
        if (isNaN(edadBuscada)) {
          console.error("La edad escrita no es un número válido:", edadEscrita);
        } else {
          console.log("Edad escrita: ", edadBuscada);

          becados = becados.filter((ofrenda) => {
            const fechaNacimiento =
              ofrenda.Reservacion.PacienteHuesped.Huesped.Persona
                .fecha_nacimiento;

            if (!fechaNacimiento) {
              console.warn(
                "La persona no tiene fecha de nacimiento definida:",
                ofrenda
              );
              return false;
            }

            const birthDate = dayjs(fechaNacimiento);
            if (!birthDate.isValid()) {
              console.error(
                "La fecha de nacimiento no es válida:",
                fechaNacimiento
              );
              return false;
            }

            const age = dayjs().diff(birthDate, "year");
            return age === edadBuscada;
          });
        }
      }

      becados.forEach((ofrenda) => {
        data.push({
          key: ofrenda.id_ofrenda,
          nombre:
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
            " " +
            ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_apellido,
          dni: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.dni,
          fecha: dayjs(ofrenda.fecha).format(dateFormat),
          valor: parseFloat(ofrenda.valor),
        });
      });

      const totalBecados = becados.reduce(
        (total, ofrenda) => total + parseFloat(ofrenda.valor),
        0
      );

      if(-1 === selectedPais)setTotalBeca(totalBecados);
      else setTotalBeca(0);

      // Camas ocupadas por becados
      let becadosHombres = 0;
      let becadosMujeres = 0;

      if (hombresData.length !== 0) {
        becadosHombres = hombresData.filter(
          (persona) => persona.becado === true
        ).length;
      }

      if (mujeresData.length !== 0) {
        becadosMujeres = mujeresData.filter(
          (persona) => persona.becado === true
        ).length;
      }
      setCamasCortesia(becadosHombres + becadosMujeres);

      // Personas evangelizadas
      let hombresEvangelizados = 0;
      let mujeresEvangelizadas = 0;
      if (hombresData.length !== 0) {
        hombresEvangelizados = hombresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.compartio_evangelio === true
        ).length;
      }
      if (mujeresData.length !== 0) {
        mujeresEvangelizadas = mujeresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.compartio_evangelio === true
        ).length;
      }
      setEvangelizadas(hombresEvangelizados + mujeresEvangelizadas);

      // Personas que recibieron a Cristo
      let hombresRecibieronCristo = 0;
      let mujeresRecibieronCristo = 0;
      if (hombresData.length !== 0) {
        hombresRecibieronCristo = hombresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.acepto_a_cristo === true
        ).length;
      }
      if (mujeresData.length !== 0) {
        mujeresRecibieronCristo = mujeresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.acepto_a_cristo === true
        ).length;
      }
      setRecibieronCristo(hombresRecibieronCristo + mujeresRecibieronCristo);

      // Personas reconciliadas
      let hombresReconciliados = 0;
      let mujeresReconciliadas = 0;
      if (hombresData.length !== 0) {
        hombresReconciliados = hombresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.reconcilio === true
        ).length;
      }
      if (mujeresData.length !== 0) {
        mujeresReconciliadas = mujeresData.filter(
          (persona) =>
            persona.PacienteHuesped.Huesped.Persona.reconcilio === true
        ).length;
      }
      setReconciliadas(hombresReconciliados + mujeresReconciliadas);

      // Hospedados por dia
      const startDate = dayjs(fechaInicio, dateFormat);
      const endDate = dayjs(fechaFinal, dateFormat);
      const numberOfDays = endDate.diff(startDate, "day") + 1;
      const hombresCount = hombresData.length || 0;
      const mujeresCount = mujeresData.length || 0;
      const promedioHospedadosPorDia =
        (hombresCount + mujeresCount) / numberOfDays;
      const promedioHospedadosPorDiaFixeado =
        promedioHospedadosPorDia.toFixed(2);
      setHospedadosDia(promedioHospedadosPorDiaFixeado);

      // Primera vez
      let hombresPrimeraVez = 0;
      let mujeresPrimeraVez = 0;
      if (hombresData.length !== 0) {
        hombresPrimeraVez = hombresData.filter(
          (persona) => persona.PacienteHuesped.Huesped.reingreso === false
        ).length;
      }
      if (mujeresData.length !== 0) {
        mujeresPrimeraVez = mujeresData.filter(
          (persona) => persona.PacienteHuesped.Huesped.reingreso === false
        ).length;
      }
      setPrimeraVez(hombresPrimeraVez + mujeresPrimeraVez);

       //TODO: Poner que obtenga moneda local o usd etc.
      console.log(donaciones);
      if(selectedPais === -1)
      {
        setMonedaLocal('$');
        const API_KEY = '44948c701865425a8109ae020dedea23';

        // BECADOS
        let totalBecados = 0;
        for (const becado of becados) {
          const response = await fetch(`https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${becado.Pai.codigo_iso},USD`);
          const data = await response.json();

          const tasaMonedaLocal = parseFloat(data.rates[becado.Pai.codigo_iso]);
          const tasaMonedaDestino = parseFloat(data.rates['USD']);

          becado.valor = tasaMonedaDestino / tasaMonedaLocal;
          totalBecados += becado.valor;
        }
        setTotalBeca(Number(totalBecados.toFixed(2)));

        // DONACIONES
        let totalDonacionCalculada = 0;
        for (const donacion of donaciones) {
          const response = await fetch(`https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${donacion.Pai.codigo_iso},USD`);
          const data = await response.json();

          const tasaMonedaLocal = parseFloat(data.rates[donacion.Pai.codigo_iso]);
          const tasaMonedaDestino = parseFloat(data.rates['USD']);

          donacion.valor = donacion.valor * tasaMonedaDestino / tasaMonedaLocal;
          totalDonacionCalculada += donacion.valor;
        }
        setTotalDonacion(Number(totalDonacionCalculada.toFixed(2)));
        console.log(donaciones);

      }else
      {
        const {codigo_iso,divisa} = (await axiosInstance.get(`/pais/${selectedPais}/iso`)).data;
        setMonedaLocal(divisa);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const onChange = (dates, dateStrings) => {
    if (dates) {
      const newFechaInicio = dateStrings[0];
      const newFechaFinal = dateStrings[1];
      setFechaInicio(newFechaInicio);
      setFechaFinal(newFechaFinal);
    }
  };

  const abrirModal  = () => {
    setExportVisible(true); 
  };

  const onExportClick = async (tasa, moneda, divisa) => {
    const donacionesConvertidas = parseFloat(totalDonacion) * tasa;
    const becasConvertidas = parseFloat(totalBeca) * tasa;
    
    const data = {
      fechaInicio,
      fechaFinal,
      hombreInfo,
      mujerInfo,
      moneda,
      divisa,
      donaciones: donacionesConvertidas + becasConvertidas,
      primeraVez,
      hospedadosDia,
      camasCortesia,
    };

    const res = await axiosInstance.post("/reportesExcel", data, {
      responseType: "arraybuffer",
    });

    const url = window.URL.createObjectURL(
      new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_${fechaInicio}_${fechaFinal}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const renderFiltros = () => {
        return (
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
              components: {
                Input: {},
              },
            }}
          >
            <Card className="mt-10 rounded-xl mb-5">
              <Collapse accordion className="bg-white rounded shadow-sm" defaultActiveKey={["1"]}>
                <Panel header={<span className="text-gray-700 font-medium">Filtros Avanzados</span>} key="1">
                  <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
                    <Row gutter={25}>
                      <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
                        <Select
                          style={{ width: "100%", height: "100%", fontSize: "16px" }}
                          showSearch
                          value={selectedPais}
                          disabled={userLog.role !== "master"}
                          onChange={(value) => {
                            setSelectedPais(value);
                            setHospitalSeleccionado(-1);
                            setSelectedDepartamento(-1);
                            setSelectedMunicipio(-1);
                            setSelectedLugar(-1);
                          }}
                          placeholder="País"
                          size="large"
                          options={paises.map((d) => ({
                            value: d.id_pais,
                            label: d.nombre,
                          }))}
                          filterOption={(input, option) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      </Col>
                      <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
                        <Select
                          style={{ width: "100%", height: "100%", fontSize: "16px" }}
                          showSearch
                          placeholder="Casa"
                          size="large"
                          value={selectedLugar}
                          disabled={selectedPais === -1 || userLog.role !== "master"}
                          onChange={(value) => setSelectedLugar(value)}
                          options={lugares?.map((lugar) => ({
                            value: lugar.id_lugar,
                            label: lugar.codigo,
                          }))}
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Row gutter={25}>
                    <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
                      <Select
                        style={{ width: "100%", height: "100%", fontSize: "16px" }}
                        showSearch
                        value={selectedDepartamento}
                        onChange={(value) => {
                          setSelectedDepartamento(value);
                          setSelectedMunicipio(-1);
                        }}
                        placeholder="Departamento"
                        disabled={selectedPais === -1}
                        size="large"
                        options={departamentos?.map((d) => ({
                          value: d.departamento_id,
                          label: d.nombre,
                        }))}
                        filterOption={(input, option) =>
                          option.label.toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Col>
                    <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
                      <Select
                        style={{ width: "100%", height: "100%", fontSize: "16px" }}
                        showSearch
                        value={selectedMunicipio}
                        onChange={(value) => setSelectedMunicipio(value)}
                        placeholder="Municipio"
                        size="large"
                        disabled={selectedDepartamento === -1}
                        options={municipios.map((m) => ({
                          value: m.municipio_id,
                          label: m.nombre,
                        }))}
                        filterOption={(input, option) =>
                          option.label.toUpperCase().includes(input.toUpperCase())
                        }
                      />
                    </Col>
                  </Row>

                  <Row gutter={25}>
                    <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
                      <Select
                        style={{ width: "100%", height: "100%", fontSize: "16px" }}
                        placeholder="Género"
                        options={generos}
                        value={genero}
                        onChange={(e) => setGenero(e)}
                      />
                    </Col>
                    <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
                      <Input
                        style={{ width: "100%", height: "100%", fontSize: "16px" }}
                        placeholder="Todas las edades"
                        type="number"
                        min={0}
                        value={edadEscrita}
                        onChange={(e) => setEdadEscrita(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <Row gutter={25}>
                    <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
                      <Select
                        style={{ width: "100%", height: "100%", fontSize: "16px" }}
                        placeholder="Hospital"
                        disabled={selectedPais === -1}
                        options={listaHospitales}
                        value={hospitalSeleccionado}
                        onChange={(value) => setHospitalSeleccionado(value)}
                      />
                    </Col>
                    <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
                      <Select
                        style={{ width: "100%", height: "100%", fontSize: "16px" }}
                        placeholder="Causa de visita"
                        options={listaCausasVisita}
                        value={causaVisitaSeleccionada}
                        onChange={(value) => setCausaVisitaSeleccionada(value)}
                      />
                    </Col>
                  </Row>

                  <Row gutter={25}>
                    <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
                      <Select
                        style={{ width: "100%", height: "100%", fontSize: "16px" }}
                        placeholder="Ocupación"
                        options={listaOcupaciones}
                        value={ocupacionSeleccionada}
                        onChange={(value) => setOcupacionSeleccionada(value)}
                      />
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            </Card>
          </ConfigProvider>
        );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Filtros de Fecha y Tipo */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <Header
          style={{
            background: "#fff",
            color: "gray",
            fontSize: 20,
            padding: 5,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "right",
            borderRadius: 20,
          }}
        >
          <div>Fechas</div>
          <RangePicker
            defaultValue={[
              dayjs(fechaInicio, dateFormat),
              dayjs(fechaFinal, dateFormat),
            ]}
            style={{ color: "gray", fontSize: 20, alignItems: "center" }}
            onChange={onChange}
            format={dateFormat}
          />
        </Header>
        
      </div>

      {renderFiltros()}

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-md shadow-md border-solid border-2 border-[#049DBF] text-left flex items-center">
          <div className="text-green-500 text-7xl mr-8">
            <PiHouseLight />
          </div>
          <div>
            <div className="font-bold text-lg text-[#049DBF]">Hospedados</div>
            <div className="text-xl font-bold">{hombre + mujer}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md text-left border-solid border-2 border-[#049DBF] flex items-center">
          <div className="text-green-500 text-7xl mr-8">
            <CiMoneyBill />
          </div>
          <div>
            <div className="font-bold text-lg text-[#049DBF]">
              Donaciones de Huespedes
            </div>
            <div className="text-xl font-bold">
              {monedaLocal} {totalBeca + totalDonacion}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md text-left border-solid border-2 border-[#049DBF] flex items-center">
          <div className="text-green-500 text-7xl mr-8">
            <FaGift />
          </div>
          <div>
            <div className="font-bold text-lg text-[#049DBF]">
              Camas Cortesía
            </div>
            <div className="text-xl font-bold">{camasCortesia}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md text-left border-solid border-2 border-[#049DBF] flex items-center">
          <div className="text-green-500 text-7xl mr-8">
            <FaBed />
          </div>
          <div>
            <div className="font-bold text-lg text-[#049DBF]">
              Total camas ocupadas
            </div>
            <div className="text-xl font-bold">{hombre + mujer}</div>{" "}
            {/*El total de camas es el mismo numero que el de hospedados */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Card de Evangelio */}
        <div className="bg-white p-4 rounded-md shadow-md border border-[#049DBF]">
          <div className="font-bold text-lg text-[#049DBF] mb-4">Evangelio</div>
          <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
            <span className="font-medium text-lg text-gray-600">
              Personas evangelizadas
            </span>
            <span className="font-bold text-lg">{evangelizadas}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
            <span className="font-medium text-lg text-gray-600">
              Personas que recibieron a Cristo
            </span>
            <span className="font-bold text-lg">{recibieronCristo}</span>
          </div>
          <div className="flex text-lg justify-between">
            <span className="font-medium text-gray-600">
              Personas reconciliadas
            </span>
            <span className="font-bold text-lg">{reconciliadas}</span>
          </div>
        </div>

        {/* Card General */}
        <div className="bg-white p-4 rounded-md shadow-md border border-[#049DBF]">
          <div className="font-bold text-lg text-[#049DBF] mb-4">General</div>
          <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
            <span className="font-medium text-lg text-gray-600">
              Promedio de hospedados por día
            </span>
            <span className="font-bold text-lg">{hospedadosDia}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-lg text-gray-600">
              Primera vez
            </span>
            <span className="font-bold text-lg">{primeraVez}</span>
          </div>
        </div>
      </div>

      <button
        onClick={abrirModal}
        className="bg-red-400 font-bold text-lg mt-12 rounded-md shadow pl-6 pr-8 h-fit py-4 text-white-100 text-start hover:-translate-y-2 transition-all ease-in-out duration-150"
      >
        EXPORTAR A EXCEL
      </button>
      <PopUpExport
        visible={exportVisible}
        onConfirm={onExportClick}
        onCancel={() => setExportVisible(false)}
      />
    </div>
    
  );
};

export default Informes;
