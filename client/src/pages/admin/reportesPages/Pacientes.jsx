import React, { useState, useEffect } from "react";
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
  Collapse,
  Slider,
  Typography
} from "antd";
import dayjs from "dayjs";

import axiosInstance from "../../../api/axiosInstance";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { WomanOutlined, ManOutlined, TeamOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import ProcedenciaApi from "../../../api/Procedencia.api";
import ReservacionesApi from "../../../api/Reservaciones.api";
import PatronoApi from "../../../api/Patrono.api";
import { useLayout } from "../../../context/LayoutContext";
import { getDepartamentos } from "../../../api/departamentoApi";
import { getMunicipiosByDepartamentoId } from "../../../api/municipioApi";
import { getMunicipioById } from "../../../api/municipioApi";
import { getDepartamentoById } from "../../../api/departamentoApi";
import { getDepartamentoByMunicipioId } from "../../../api/departamentoApi";
import { getAllCausas } from "../../../api/CausaVisita.api";

import {getDepartamentoByPais} from "../../../api/departamentoApi";
import personaApi from "../../../api/Persona.api";
import { getUserFromToken } from "../../../utilities/auth.utils";

import PaisApi from "../../../api/Pais.api";
import HospitalesApi from "../../../api/Hospitales.api";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import LugarApi from "../../../api/Lugar.api"
import PacienteApi from "../../../api/Paciente.api";
const userLog  = getUserFromToken();

const { Panel } = Collapse;
const { Option } = Select;
const { Title } = Typography;

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;
const usuario = getUserFromToken();
function Pacientes() {
  
  const [selectedPais, setSelectedPais] = useState(userLog.role === "master"? -1 : userLog.id_pais);
  const [selectedLugar, setSelectedLugar] = useState(userLog.role === "master"? -1 : userLog.id_lugar);
   // Variables de los filtros
    const [paises, setPaises] = useState([]);
    const [lugares,setLugares] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const { setCurrentPath } = useLayout();

  const [procedencia, setProcedencia] = useState(-1);
  const [selectedCausa, setSelectedCausa] = useState(-1);
  const [edad, setEdad] = useState([18,85]);
  const [rangoEdad,setRangoEdad] = useState(edad);
  const [causas, setCausas] = useState([]);

  const [genero, setGenero] = useState(-1);
  const [searchProcedencia, setSearchProcedencia] = useState("");

  const [procedencias, setProcedencias] = useState([]);
  const [generos, setGeneros] = useState([
    { value: -1, label: "Todos los Generos" },
    { value: 1, label: "Masculino" },
    { value: 2, label: "Femenino" },
  ]);
  const [loading, setLoading] = useState(false);

  const [selectedHospital,setSelectedHospital] = useState(-1);
  const [hospitales, setHospitales] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState(-1);
  const [municipios, setMunicipios] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState(-1);

  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString());
  const [fechaFinal, setFechaFinal] = useState(new Date().toISOString());

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [page1, setPage1] = useState(1);
  const [pageSize1, setPageSize1] = useState(5);
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
            const departamentosData = await getDepartamentoByPais(selectedPais);
            departamentosData.unshift({ departamento_id: -1, nombre: "Todos los Departamentos" });
            setDepartamentos(departamentosData);
          }
          fetchLugar();
          

      },[selectedPais]);


const loadCausasVisita = async () => {
  try {
    const causaData = await getAllCausas();
    causaData.unshift({
      id_causa_visita: -1,
      causa: "Todas las Causas",
    });
    setCausas(
      causaData.map((causa) => ({
        value: causa.id_causa_visita,
        label: causa.causa,
      }))
    );
    console.log(causaData);
  } catch (error) {
    console.error("Error fetching causas de visita:", error);
  }
};
      
    const loadPaises = async() =>
    {
      const paisData = await PaisApi.getPaisForTable();
      paisData.data.unshift({
          id_pais: -1,
          nombre: "Todos los Paises",
        })
      setPaises(paisData.data);
    };

  const loadHospitales = async () => {
    try {
      let response;
      if (selectedPais === -1) {
        response = await HospitalesApi.getHospitalRequest();
      } else {
        response = await HospitalesApi.getHospitalByPais(selectedPais);
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
        setHospitales(listaDeHospitales);
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  useEffect(() => {
    loadCausasVisita();
    loadHospitales();
    loadPaises();
    loadData();
  }, [fechaInicio, fechaFinal, selectedHospital,selectedDepartamento, selectedMunicipio, selectedCausa, genero,selectedPais,selectedLugar,rangoEdad]);

  const fetchDepartamentos = async () => {
      try {
         const pais = await personaApi.getPaisByPersona(usuario.id_persona);
         const departamentosData = await getDepartamentoByPais(pais.data.id_pais);
        setDepartamentos(departamentosData);
        departamentosData.unshift({ departamento_id: -1, nombre: "Todos los Departamentos" });
        setDepartamentos(departamentosData);
        //console.log("Departamentos cargados: ", departamentosData);
      } catch (error) {
        console.error("Error fetching departamentos:", error);
      }
    };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    //console.log("SE CORRIO EL FETCH MUNICIPIOS");
    const fetchMunicipios = async () => {
      //console.log(selectedDepartamento);
      if (selectedDepartamento !== null) {
        try {
          //console.log("Sending", selectedDepartamento);
          const municipiosData = await getMunicipiosByDepartamentoId(
            selectedDepartamento
          );
          municipiosData.unshift({ municipio_id: -1, nombre: "Todos los Municipios" });
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

  const [hombre, setHombres] = useState([]);
  const [mujer, setMujeres] = useState([]);
  const [totalHombre, setTotalHombres] = useState(0.0);
  const [totalMujer, setTotalMujeres] = useState(0.0);

  var accent_map = {
    á: "a",
    é: "e",
    è: "e",
    í: "i",
    ó: "o",
    ú: "u",
    Á: "a",
    É: "e",
    Í: "i",
    Ó: "o",
    Ú: "u",
  };
  function accent_fold(s) {
    if (!s) {
      return "";
    }
    var ret = "";
    for (var i = 0; i < s.length; i++) {
      ret += accent_map[s.charAt(i)] || s.charAt(i);
    }
    return ret;
  }

  const fetchMunicipioById = async (municipioId) => {
    try {
      const municipio = await getMunicipioById(municipioId);
      return municipio;
    } catch (error) {
      console.error("Error fetching municipio by ID:", error);
      return null;
    }
  };

  const fetchDepartamentoById = async (departamentoId) => {
    try {
      const departamento = await getDepartamentoById(departamentoId);
      return departamento;
    } catch (error) {
      console.error("Error fetching departamento by ID:", error);
      return null;
    }
  };

  const cargarProcedenciaHombres = async (dataSource) => {
    try {
      const response = await ProcedenciaApi.getProcedenciasRequest();
      if (!response) {
        throw new Error("No se pudo cargar la informacion de la Persona");
      }
      if (response.status === 201) {
        const Procedencia = response.data.map((item) => ({
          id_procedencia: item.id_procedencia,
          departamento: item.departamento,
          municipio: item.municipio,
        }));

        
        const personasyProcedencia = await Promise.all(
          dataSource.map(async (persona) => {
            const municipio = await fetchMunicipioById(persona.municipio_id);
            const departamento = await fetchDepartamentoById(municipio.departamento_id);
            return {
              ...persona,
              departamento: departamento.nombre,
              municipio: municipio.nombre,
            };
          })
        );
        setTotalHombres(personasyProcedencia);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cargarProcedenciaMujeres = async (dataSource) => {
    try {
      const response = await ProcedenciaApi.getProcedenciasRequest();
      if (!response) {
        throw new Error("No se pudo cargar la informacion de la Persona");
      }
      if (response.status === 201) {
        const Procedencia = response.data.map((item) => ({
          id_procedencia: item.id_procedencia,
          departamento: item.departamento,
          municipio: item.municipio,
        }));

        /* const personasyProcedencia = dataSource.map((persona, index) => ({
          ...persona,
          departamento: Procedencia.find(
            (proc) => proc.id_procedencia === persona.id_procedencia
          ).departamento,
          municipio: Procedencia.find(
            (proc) => proc.id_procedencia === persona.id_procedencia
          ).municipio,
        })); */

        const personasyProcedencia = await Promise.all(
          dataSource.map(async (persona) => {
            const municipio = await fetchMunicipioById(persona.municipio_id);
            const departamento = await fetchDepartamentoById(municipio.departamento_id);
            //console.log("Departamento: ", departamento);
            return {
              ...persona,
              departamento: departamento.nombre,
              municipio: municipio.nombre,
            };
          })
        );

        setTotalMujeres(personasyProcedencia);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async () => {
    setLoading(true);

    try {

      const response = await PacienteApi.getPacienteAndPersonaForTabla(
        fechaInicio,
        fechaFinal
      );

      if (!response || response.status < 200 || response.status >= 300) {
        setLoading(false);
        throw new Error("No se pudo cargar la informacion de la Persona");
      }
      
      let todo = response.data.rows;
      console.log("Ejemplo:", todo);
      if(selectedPais !== -1)
      {
        todo = todo.filter((persona) => 
          persona.PacienteHuesped.Paciente.Persona.Lugar.id_pais === selectedPais
        )
      }
      if(selectedLugar !== -1)
      {
        todo = todo.filter((persona) => 
          persona.PacienteHuesped.Paciente.Persona.id_lugar === selectedLugar
        )
      }
      if (genero !== -1) {
        todo = todo.filter(
          (ofrenda) =>
            ofrenda.PacienteHuesped.Paciente.Persona.genero ===
            (genero === 1 ? "MASCULINO" : "FEMENINO")
        );
      }

      if (selectedDepartamento !== (-1)) {
        const filteredTodo = await Promise.all(
          todo.map(async (ofrenda) => {
            const departamento = await getDepartamentoByMunicipioId(ofrenda.PacienteHuesped.Paciente.Persona.municipio_id);
            return departamento.departamento_id === selectedDepartamento ? ofrenda : null;
          })
        );
      
        todo = filteredTodo.filter(ofrenda => ofrenda !== null);
      }
      if (selectedMunicipio !== (-1)) {
        //console.log("Selected municipio: ", selectedMunicipio);
        todo = todo.filter(
          (ofrenda) =>
            ofrenda.PacienteHuesped.Paciente.Persona.municipio_id ===
            selectedMunicipio
        );
      }
      if(selectedHospital !== -1)
      {
        todo = todo.filter((item) => item.PacienteHuesped.Paciente.id_hospital === selectedHospital)
      }
      if(selectedCausa !== -1)
      {
        todo = todo.filter((item)=> item.PacienteHuesped.Paciente.id_causa_visita === selectedCausa);
      }

      const hoy = new Date();
      todo = todo.filter((item)=> {
        const nacimiento = new Date(item.PacienteHuesped.Paciente.Persona.fecha_nacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        const dia = hoy.getDate() - nacimiento.getDate();
        if (mes < 0 || (mes === 0 && dia < 0)) edad--;

        return edad >= rangoEdad[0] && edad <= rangoEdad[1];
      });

      let Mujerestodos = todo.filter((item) => item.PacienteHuesped.Paciente.Persona.genero === 'FEMENINO');
      
      let Hombrestodos = todo.filter((item) => item.PacienteHuesped.Paciente.Persona.genero === 'MASCULINO');

      if (todo) {
        Hombrestodos = Hombrestodos.map((item) => ({
          key: item.PacienteHuesped.id_paciente,
          dni: item.PacienteHuesped.Paciente.Persona.dni,
          nombre:
            item.PacienteHuesped.Paciente.Persona.primer_nombre +
            " " +
            item.PacienteHuesped.Paciente.Persona.segundo_nombre,
          apellido:
            item.PacienteHuesped.Paciente.Persona.primer_apellido +
            " " +
            item.PacienteHuesped.Paciente.Persona.segundo_apellido,
          procedencia: item.PacienteHuesped.Paciente.Persona.Municipio.Departamento.nombre +
            " " + item.PacienteHuesped.Paciente.Persona.Municipio.nombre,
          hospital: item.PacienteHuesped.Paciente.Hospital.nombre,
          departamento_id: item.PacienteHuesped.Paciente.Persona.Municipio.departamento_id,
          municipio_id: item.PacienteHuesped.Paciente.Persona.Municipio.municipio_id
        }));
        Mujerestodos = Mujerestodos.map((item) => ({
          key: item.PacienteHuesped.id_paciente,
          dni: item.PacienteHuesped.Paciente.Persona.dni,
          nombre:
            item.PacienteHuesped.Paciente.Persona.primer_nombre +
            " " +
            item.PacienteHuesped.Paciente.Persona.segundo_nombre,
          apellido:
            item.PacienteHuesped.Paciente.Persona.primer_apellido +
            " " +
            item.PacienteHuesped.Paciente.Persona.segundo_apellido,
          procedencia: item.PacienteHuesped.Paciente.Persona.Municipio.Departamento.nombre +
            " " + item.PacienteHuesped.Paciente.Persona.Municipio.nombre,
          hospital: item.PacienteHuesped.Paciente.Hospital.nombre,
          departamento_id: item.PacienteHuesped.Paciente.Persona.Municipio.departamento_id,
          municipio_id: item.PacienteHuesped.Paciente.Persona.Municipio.municipio_id
        }));
        await cargarProcedenciaHombres(Hombrestodos);
        setHombres(Hombrestodos.length);
        await cargarProcedenciaMujeres(Mujerestodos);
        setMujeres(Mujerestodos.length);
      } else {
        setTotalHombres([]);
        setHombres(0);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
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

  const columns = [
    {
      title: "No. Identidad",
      dataIndex: "dni",
      key: "dni",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese la identidad"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            <Button
              style={{ marginTop: 5 }}
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              Buscar
            </Button>

            <Button
              style={{ marginTop: 5 }}
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.dni.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese el Nombre"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            <Button
              style={{ marginTop: 5 }}
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              Buscar
            </Button>

            <Button
              style={{ marginTop: 5 }}
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.nombre
          .toLowerCase()
          .includes(accent_fold(value.toLowerCase()));
      },
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese el Nombre"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            <Button
              style={{ marginTop: 5 }}
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              Buscar
            </Button>

            <Button
              style={{ marginTop: 5 }}
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.apellido
          .toLowerCase()
          .includes(accent_fold(value.toLowerCase()));
      },
    },
    {
      title: "Departamento",
      dataIndex: "departamento",
      key: "departamento",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese asi: departamento"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>

            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                confirm();
              }}
              className="buscar_button"
              type="primary"
            >
              Buscar
            </Button>
            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return accent_fold(record.departamento.toLowerCase()).includes(
          accent_fold(value.toLowerCase())
        );
      },
    },
    {
      title: "Municipio",
      dataIndex: "municipio",
      key: "municipio",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese asi: municipio"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>

            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                confirm();
              }}
              className="buscar_button"
              type="primary"
            >
              Buscar
            </Button>
            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return accent_fold(record.municipio.toLowerCase()).includes(
          accent_fold(value.toLowerCase())
        );
      },
    },
    {
      title: "Hospital",
      dataIndex: "hospital",
      key: "hospital",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese asi: Hospital"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>

            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                confirm();
              }}
              className="buscar_button"
              type="primary"
            >
              Buscar
            </Button>
            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return accent_fold(record.patrono.toLowerCase()).includes(
          accent_fold(value.toLowerCase())
        );
      },
    },
  ];

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
          <Collapse
      activeKey={isOpen ? ["1"] : []}
      onChange={() => setIsOpen(!isOpen)}
     // bordered={false}
      expandIconPosition="start"
      className="bg-white rounded shadow-sm"
      expandIcon={({ isActive }) =>
        isActive ? <UpOutlined /> : <DownOutlined />
      }
    >
      <Panel
        header={<span className="text-gray-700 font-medium">Filtros Avanzados</span>}
        key="1"
      >
        <Row 
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 50, height: 50 }}
          >
          <Title level={5} style={{ marginBottom: 20, color: "#4a4a4a" }}>
            Selecciona un rango de edades: <strong>{edad[0]} - {edad[1]}</strong>
          </Title>

          <Slider
            range
            style={{ width: "100%", padding: "0 4px", marginBottom: 20,}}
            min={0}
            max={120}
            defaultValue={edad}
            onChange={(value) =>  setEdad(value)}
            onAfterChange={(value)=> setRangoEdad(value)}
            trackStyle={[{ backgroundColor: "#6EC1E4", height: 5 }]}      
            handleStyle={[
              { borderColor: "#4CAF50", backgroundColor: "#81C784", boxShadow: "0 0 5px #4CAF50" },
              { borderColor: "#4CAF50", backgroundColor: "#81C784", boxShadow: "0 0 5px #4CAF50" }
            ]}
            railStyle={{ backgroundColor: "#eaf4f7", height: 5 }}
          />
        </Row> 
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
                    setSelectedDepartamento(-1);
                    setSelectedMunicipio(-1);
                    setSelectedLugar(-1);
                    setSelectedHospital(-1);
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
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                style={{ width: "100%", height: "100%"}}
                placeholder="Genero"
                size="large"
                options={generos}
                value={genero}
                onChange={(e) => {
                  setGenero(e);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                style={{ width: "100%", height: "100%" }}
                id="selectCausa"
                showSearch
                onSearch={(e) => {
                  setSearchProcedencia(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                placeholder="Causas"
                options={causas}
                size="large"
                value={selectedCausa}
                onChange={(value) => {
                  setSelectedCausa(value);
                }}
              />
            </Col>
          </Row>
          <Row
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
                  <Select
                  style={{ width: "100%", height: "100%" }}
                  id="selectCausa"
                  showSearch
                  onSearch={(e) => {
                    setSearchProcedencia(e);
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  placeholder="Hospitales"
                  disabled={selectedPais === -1}
                  options={hospitales}
                  size="large"
                  value={selectedHospital}
                  onChange={(value) => {
                    setSelectedHospital(value);
                  }}
                />
          </Row>   
      </Panel>
    </Collapse>
        </Card>
      </ConfigProvider>
    );
  };

  const render = () => {
    return (
      <Layout>
        <Header
          style={{
            background: "#fff",
            color: "gray",
            fontSize: 20,
            padding: 5,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
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
        {renderFiltros()}
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
          <Row gutter={16}>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    Hombres <ManOutlined />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#8ce4f3",
                  fontSize: 30,
                  color: "white",
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {hombre > 0 ? (
                  <div>Cantidad: {hombre}</div>
                ) : (
                  <p>Cantidad: 0</p>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    Mujeres <WomanOutlined />{" "}
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#fcb4b4",
                  color: "white",
                  fontSize: 30,
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {mujer > 0 ? <div>Cantidad: {mujer}</div> : <p>Cantidad: 0</p>}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    Total <TeamOutlined />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#74dca4",
                  color: "white",
                  fontSize: 30,
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {mujer + hombre > 0 ? (
                  <div>Cantidad: {mujer + hombre}</div>
                ) : (
                  <p>Cantidad: 0</p>
                )}
              </Card>
            </Col>
          </Row>
        </Content>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#77D9A1",
                cellFontSize: 17,
                headerColor: "#FFFFFF",
                colorText: "#3e3e3e",
              },
              Divider: {
                marginTop: 35,
                fontSize: 34,
                colorTextHeading: "#3e3e3e",
                colorText: "#77D9A1",
              },
            },
          }}
        >
          <Divider style={{ marginTop: 35, fontSize: 34, color: "#8ce4f3" }}>
            Hombres
          </Divider>
          <Table
            style={{ margin: "5px 0", headerBg: "#8ce4f3" }}
            dataSource={totalHombre}
            columns={columns}
            scroll={{ x: true }}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: totalHombre.length,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />

          <Divider style={{ marginTop: 35, fontSize: 34, color: "#fcb4b4" }}>
            Mujeres
          </Divider>
          <Table
            style={{ margin: "5px 0", headerBg: "#fcb4b4" }}
            dataSource={totalMujer}
            columns={columns}
            scroll={{ x: true }}
            pagination={{
              current: page1,
              pageSize: pageSize1,
              total: totalMujer.length,
              onChange: (page1, pageSize1) => {
                setPage1(page1);
                setPageSize1(pageSize1);
              },
            }}
          />
        </ConfigProvider>
      </Layout>
    );
  };
  return (
    <>
      {!loading ? (
        render()
      ) : (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#77d9a1",
            },
          }}
        >
          <Spin
            style={{ height: "90vh", width: "100%", alignContent: "center" }}
            size="large"
          />
        </ConfigProvider>
      )}
    </>
  );
}

export default Pacientes;
