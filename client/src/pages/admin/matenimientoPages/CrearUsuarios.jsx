import React, { useEffect, useState, useRef } from "react";
import { useLayout } from "../../../context/LayoutContext";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import OcupacionesApi from "../../../api/Ocupaciones.api";
import { getDepartamentoByPais } from "../../../api/departamentoApi";
import { getMunicipiosByDepartamentoId } from "../../../api/municipioApi";
import { getMunicipioById } from "../../../api/municipioApi";
import hospitalesApi from "../../../api/Hospitales.api";
import usuarioApi from "../../../api/User.api";
import UserApi from "../../../api/User.api";
import personaApi from "../../../api/Persona.api";
import lugarApi from "../../../api/Lugar.api";
import paisApi from "../../../api/Pais.api";
import { getUserFromToken } from "../../../utilities/auth.utils";
import formatearValor from "../../../utilities/formato_dni";
import axios from "axios";
import {COUNTRIES_API} from "../../../api/Huesped.api";

import {
  Card,
  DatePicker,
  ConfigProvider,
  Flex,
  Input,
  Col,
  Row,
  Select,
  Button,
} from "antd";
import {
  LockOutlined,
  PushpinOutlined,
  PhoneOutlined,
  IdcardOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Meta } = Card;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

const dateFormat = "YYYY-MM-DD";
const displayDateFormat = "DD-MM-YYYY";
const telFormat = /\d{4}-\d{4}/;
const dniFormat = /^\d{4}-\d{4}-\d{5}$/;

const CaraEspecial = ["!", "@", "#", "$", "^", "&", "*"];

const generos = [
  { value: 1, label: "Femenino" },
  { value: 2, label: "Masculino" },
];
const master_roles = [
  { value: 1, label: "USUARIO" },
  { value: 2, label: "ADMINISTRADOR" },
  {value: 3, label: "MASTER"}
];

const roles = [
  { value: 1, label: "USUARIO" },
  { value: 2, label: "ADMINISTRADOR" }
];



function CrearUsuarios() {
  const userData = getUserFromToken();
  //para dropbox & calendario de procedencia y ocupaciones
  const [ocupaciones, setOcupaciones] = useState([]);
  const [searchOcupacion, setSearchOcupacion] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [lugar,setLugar] = useState([]);
  const [selectedLugar, setSelectedLugar] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const pais = useRef(userData.id_pais);
  const [paises,setPaises] = useState([]);
  const[countries,setCountries] = useState([]);
  const selectedCountry = useRef();
  const selectedCountryCode = useRef(userData.referencia_telefonica);
  const [dummyState, setDummyState] = useState(false);

  const rolLog = userData.role;


  const loadPaises= async() => 
  {
    const paisData = await paisApi.getPaisForTable();
    console.log(paisData.data);
    setPaises(paisData.data.map((p) =>
      ({
        id_pais: p.id_pais,
        nombre: p.nombre,
        referencia_telefonica: p.referencia_telefonica,
        formato_dni: p.formato_dni
      }))
    );
  }

  const loadRef_Tel=async()=>
  {
    const pa = paises.find((p) => p.id_pais === pais.current);
    selectedCountryCode.current = (pa.referencia_telefonica);
    const selected = countries.find(c => c.code === selectedCountryCode.current);
    selectedCountry.current = selected;
    console.log(selectedCountry.current);
  };
  const loadLugar = async(id_pais = null) => 
      {
        if(id_pais == null){
          const paisData = await personaApi.getPaisByPersona(userData.id_persona);
          const lugares = await lugarApi.getLugarByPais(paisData.data.id_pais);
          setLugar(lugares.data.map((l)=>
            ({
              id_lugar: l.id_lugar,
              codigo: l.codigo,
              direccion: l.direccion
            }))
          ); 
        }
        else
        {
          const lugares = await lugarApi.getLugarByPais(id_pais);
          setLugar(lugares.data.map((l)=>
            ({
              id_lugar: l.id_lugar,
              codigo: l.codigo,
              direccion: l.direccion
            }))
          ); 
        }
      };

  useEffect(()=>
    {
      loadLugar();
    }
  ,[]);

  const loadMunicipios = async () => {
    try {
      const response = await getMunicipiosByDepartamentoId(
        selectedDepartamento
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

  const loadHospitales = async (principio = true) => {
    try {
      const response = await hospitalesApi.getHospitalRequest();
      if(principio)
      {
        const paisData = await personaApi.getPaisByPersona(userData.id_persona);
        if (!response) {
          // deberia lanzar un error
          throw new Error("No se pudo cargar las Hospitales");
        }  
        if (response.status >= 200 && response.status < 300) {
            setHospitales(
            response.data
            .filter((hospital) => hospital.id_pais === paisData.data.id_pais)
            .map((e) => ({
              value: e.id_hospital,
              label: e.nombre + " , " + e.direccion,
            }))
            );
        } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los hospitales");
        } 
      }
      else
      {
        if (response.status >= 200 && response.status < 300) {
            setHospitales(
            response.data
            .filter((hospital) => hospital.id_pais === pais.current)
            .map((e) => ({
              value: e.id_hospital,
              label: e.nombre + " , " + e.direccion,
            }))
            );
        } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los hospitales");
        } 
      }   
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const handleObtenerFechaNacimiento = () => {
    if (isEditable) {
      return user.fecha_nacimiento
        ? dayjs(user.fecha_nacimiento, dateFormat)
        : "";
    }
  };

  const handleCrearOcupacion = async () => {
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

      handleSetChangeUser("id_ocupacion", id_ocupacion_creada);

      document.getElementById("selectOcupacion").blur();

      // Validar que retorna porque tenemos que asignarle ese id al user
    } catch (error) {}

    setLoading(false);
  };

  //para dropbox hospital
  const [hospitales, setHospitales] = useState([]);
  const [searchHospital, setSearchHospital] = useState("");

  const [loading, setLoading] = useState(false);

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

  const handleCrearHospital = async () => {
    setLoading(true);
    if (validarFormatoHospital()) {
      // Deberiamos llamar a la api para crear la procedencia;

      try {
        const hospitalFormat = searchHospital.split(",");

        const response = await hospitalesApi.postHospitalesRequest({
          nombre: hospitalFormat[0],
          direccion: hospitalFormat[1],
          id_pais: userData.id_pais
        });

        if (!response || response.status !== 201) {
          // Deberia lanzar una notificacion de error
          setLoading(false);
          openNotification(2, "Error", "No se pudo crear el hospital");
          return;
        }

        const id_hospital_creado = response.data.id_hospital;
        openNotification(
          1,
          "Hospital Creado",
          "Se creo el hospital correctamente"
        );

        loadHospitales();

        handleSetChangeUser("id_hospital", id_hospital_creado);

        document.getElementById("selectHospital").blur();

        // Validar que retorna porque tenemos que asignarle ese id al user
      } catch (error) {
        openNotification(3, "Error", error);
      }
    }

    setLoading(false);
  };

  //para la contraseña
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordRegex = /^.{9,}$/;

  //para los pop ups & errores
  const { openNotification, setCurrentPath } = useLayout();

  const [isEditable, setIsEditable] = useState(true);

  const [existPerson, setExistPerson] = useState(false);
  const [existUser, setExistUser] = useState(false);

  //para user & persona

  /*
    para manejar la info del usuario los componentes requieren de un objeto
    con los siguiente atributos

    OJO no todos los componentes utilizan todos estos atributos

    const user = 
    {
          dni: value,
          id_ocupacion : value,
          direccion : value,
          fecha_nacimiento : value,
          genero : value (este se debe formatear para que sea un numero que represente el valor en el select),
          id_procedencia : value (este se debe formatear para que sea un numero que represente el valor en el select),
          primer_nombre : value,
          segundo_nombre,
          segundo_apellido,
          primer_apellido,
          segundo_apellido,
          telefono,
          referencia_telefonica
          nickname,
          rol, (este se debe formatear para que sea un numero que represente el valor en el select)
          contrasena,
         confirmContrasena 
      
    }

  */

  const [user, setUser] = useState({});

  const ResetearAtributos = () => {
    const userVacio = {
      dni: "",
      id_ocupacion: null,
      direccion: "",
      fecha_nacimiento: "",
      genero: null,
      id_procedencia: null,
      primer_nombre: "",
      segundo_nombre: "",
      segundo_apellido: "",
      primer_apellido: "",
      segundo_apellido: "",
      municipio_id: null,
      telefono: "",
      nickname: "",
      rol: null,
      contrasena: "",
      confirmContrasena: "",
      id_lugar: null,
    };

    setUser(userVacio);
    setSelectedDepartamento(null);
    setSelectedMunicipio(null);
  };

  const searchDni = async (in_dni) => {
    console.log("Buscando " + in_dni);
    cargarInformacion(in_dni);
  };

  const cargarInformacion = async (in_dni) => {
    try {
      const response = await personaApi.getPersonaByDniRequest(in_dni);
      console.log(response.data);
      if (!response) {
        // deberia lanzar un erro
        setExistPerson(false);
        setExistUser(false);
        return;
      }

      const response2 = await UserApi.getUserByIdPersonaRequest(
        response.data.id_persona
      );

      if (response.status >= 200 && response.status < 300) {
        setExistPerson(true);
        openNotification(
          2,
          "Persona ya Existe",
          "La persona que ingreso ya existe."
        );

        if (response2 && response2.status >= 200 && response2.status < 300) {
          openNotification(
            2,
            "Ya Tiene Usuario",
            "La persona que ingreso ya tiene un usuario: " +
              response2.data.nickname
          );

          setExistUser(true);

          ResetearAtributos();
          return;
        } else {
          setExistUser(false);
        }

        const {
          id_persona,
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
          id_lugar,
          referencia_telefonica
        } = response.data;

        const changeuser = {
          id_persona,
          dni,
          id_ocupacion,
          direccion,
          fecha_nacimiento,
          genero: genero === "FEMENINO" ? "FEMENINO" : "MASCULINO",
          municipio_id,
          primer_apellido,
          segundo_apellido,
          primer_nombre,
          segundo_nombre,
          telefono,
          id_lugar,
          referencia_telefonica
        };
        setSelectedLugar(changeuser.id_lugar);
        const found = countries.find((c) => c.code === changeuser.referencia_telefonica);
        selectedCountry.current = found;   
        handleSetChangeUser("referencia_telefonica",selectedCountryCode.current);
        const municipio = await fetchMunicipioById(municipio_id);
        if (municipio) {
          setSelectedDepartamento(municipio.departamento_id);
          setSelectedMunicipio(municipio_id);
        }

        setUser(changeuser);
      }
    } catch (error) {
      console.log(error);
    }
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

  //hace cambios de formato
  const handleSetChangeUser = (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        searchDni(newValue);
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

      case "municipio_id":
        if (value) {
          console.log("Municipio de usuario cambiado a: " + value);
          setUser({ ...user, municipio_id: value });
        }
        break;
      case "id_lugar":
        if(value)
          {
            setSelectedLugar(newValue);
          }
        break;
      case "id_hospital":
        if(value)
          {
            setSelectedHospital(newValue);
          }
      default:
        break;
    }

  setUser({ ...user, [key]: newValue });
  };

  const validarNicknameExists = async (nickname) => {
    const response = await usuarioApi.getUserByNicknameRequest(nickname);

    if (response) {
      if (response.status === 404) {
        return true;
      }
    }

    return false;
  };

  const ValidaCampoContra = (password) => {
    let Especiales = false;

    if (password.length >= 8) {
      for (let i = 0; i < password.length; i++) {
        if (password[i] === " ") {
          openNotification(
            2,
            "Contraseña",
            "La contraseña no puede tener espacios"
          );
          return false;
        }
        for (let j = 0; j < CaraEspecial.length; j++) {
          if (password[i] === CaraEspecial[j]) {
            Especiales = true;
          }
        }
      }
      if (Especiales) return true;
    } else {
      openNotification(
        2,
        "Error",
        "La contraseña debe tener al menos 8 caracteres"
      );
    }

    openNotification(
      2,
      "Error",
      "La contraseña debe tener un caracter especial"
    );

    return false;
  };

  const validarCampos = async () => {
    for (const [key, value] of Object.entries(user)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido"
      ) {
        openNotification(2, "Campos Vacios", "No puede dejar campos vacios");
        return false;
      }

      if (key === "telefono" && value.match(telFormat) === null) {
        openNotification(2, "Telefono", "El formato del telefono no es valido");
        return false;
      }

      if (key === "nickname") {
        if (!(await validarNicknameExists(value))) {
          openNotification(2, "Usuario Repetido", "El usuario debe ser unico");
          return false;
        }
      }
    }

    if (user.contrasena !== user.confirmContrasena) {
      openNotification(2, "Contraseña", "Las contraseñas no coinciden");
      return false;
    }

    if (!ValidaCampoContra(user.contrasena)) {
      return false;
    }

    return true;
  };

  //agarra el submit aqui va a mandar
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    console.log("Usuario al momento de darle registrar: ", user);
    const persona = {
      dni: user.dni,
      primer_nombre: user.primer_nombre,
      segundo_nombre: user.segundo_nombre,
      primer_apellido: user.primer_apellido,
      segundo_apellido: user.segundo_apellido,
      id_ocupacion: user.id_ocupacion,
      genero: user.genero === 1 ? "FEMENINO" : "MASCULINO",
      fecha_nacimiento: user.fecha_nacimiento,
      telefono: user.telefono,
      direccion: user.direccion,
      municipio_id: user.municipio_id,
      id_lugar: selectedLugar,
      referencia_telefonica: selectedCountryCode.current,
    };

    const usuario = {
      id_persona: user.id_persona,
      nickname: user.nickname,
      contrasena: user.contrasena,
      rol: user.rol === 1 ? "admin" : user.rol === 2? "usuario" : "master",
      id_hospital: selectedHospital,
    };
    console.log("Momento de ingresar Persona", persona);
    if (await validarCampos()) {
      if (!existUser) {
        if (!existPerson) {
          try {
            const response = await UserApi.postUserPersonaRequest(
              usuario,
              persona
            );

            if (!response || response.status !== 201) {
              ResetearAtributos();
              openNotification(3, "Error", "No se pudo crear el usuario");
              setLoading(false);
              return;
            }

            ResetearAtributos();

            openNotification(1, "Exito", "Se pudo crear el usuario");
            setLoading(false);
            return;
          } catch (error) {
            openNotification(3, "Error", error);
          }
        } else {
          openNotification(
            2,
            "Persona ya Existe",
            "La persona que ingreso ya existe."
          );

          try {
            const usuarioP = {
              id_persona: user.id_persona,
              nickname: user.nickname,
              contrasena: user.contrasena,
              rol: user.rol === 1 ? "admin" : user.rol === 2? "usuario" : "master",
              id_hospital: user.id_hospital,
            };

            const responseUN = await UserApi.postUserRequest(usuarioP);

            if (!responseUN || responseUN.status !== 201) {
              openNotification(3, "Error", "No se pudo crear el usuario");

              setLoading(false);
              return;
            }

            ResetearAtributos();

            openNotification(1, "Exito", "Se pudo crear el usuario");
            return;
          } catch (error) {
            openNotification(3, "Error", error);
            setLoading(false);
          }
        }
      } else {
        ResetearAtributos();
        openNotification(
          2,
          "Ya Tiene un Usuario",
          "La persona que ingreso ya tiene un usuario."
        );
        setLoading(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPaises();
    loadOcupaciones();
    loadHospitales();
    loadMunicipios();
    ResetearAtributos();
    cargarInformacion();
    setCurrentPath("/ Mantenimiento / Usuarios / Crear Usuario");
  }, []);

  const fetchDepartamentos = async (id_pais = null) => {
      try {
        if(id_pais !== null)
        {
          const departamentosData =  await getDepartamentoByPais(id_pais);
          setDepartamentos(departamentosData);
        }else 
        {
          const paisData = await personaApi.getPaisByPersona(userData.id_persona);
          const departamentosData = await getDepartamentoByPais(paisData.data.id_pais);
          setDepartamentos(departamentosData);
        }
      } catch (error) {
        console.error("Error fetching departamentos:", error);
      }
  };

  useEffect(() => {
    console.log("SE CORRIO EL FETCH DEPARTAMENTOS");
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    console.log("SE CORRIO EL FETCH MUNICIPIOS");
    const fetchMunicipios = async () => {
      console.log(selectedDepartamento);
      if (selectedDepartamento !== null) {
        try {
          console.log("Sending", selectedDepartamento);
          const municipiosData = await getMunicipiosByDepartamentoId(
            selectedDepartamento
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
  }, [selectedDepartamento]);

  const { isXS } = useLayout();


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

      const selected = await filtered.find(c => c.code === selectedCountryCode.current);
      selectedCountry.current = selected;
      console.log(selectedCountry.current.code);
    } catch (error) {
      console.error('Error al cargar datos de países:', error);
    }
  };

  fetchData();
}, [])

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
        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Informacion Personal" />

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
                type="text"
                style={{ height: "100%" }}
                value={user.dni}
                onChange={(e) => {
                  const value = e.target.value;
                  const esBorrado = e.nativeEvent.inputType === "deleteContentBackward";
                  const pa = paises.find((p) => p.id_pais === pais.current);
                  const dni = formatearValor(value,pa.formato_dni,esBorrado);
                  handleSetChangeUser("dni", dni, user.dni);
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
                onSearch={(e) => {
                  setSearchOcupacion(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                placeholder="Ocupacion"
                size="large"
                notFoundContent={
                  <Button loading={loading} onClick={handleCrearOcupacion}>
                    Crear Ocupacion
                  </Button>
                }
                options={ocupaciones}
                style={{ width: "100%", height: "100%" }}
                value={user.id_ocupacion}
                onChange={(e) => {
                  handleSetChangeUser("id_ocupacion", e);
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
                disabled={isEditable ? false : true}
                placeholder="Primer Nombre"
                type="text"
                style={{ height: "100%" }}
                value={user.primer_nombre}
                onChange={(e) => {
                  handleSetChangeUser("primer_nombre", e.target.value.toUpperCase());
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
                style={{ height: "100%" }}
                value={user.segundo_nombre}
                onChange={(e) => {
                  handleSetChangeUser("segundo_nombre", e.target.value.toUpperCase());
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
                disabled={isEditable ? false : true}
                placeholder="Primer Apellido"
                type="text"
                style={{ height: "100%" }}
                value={user.primer_apellido}
                onChange={(e) => {
                  handleSetChangeUser("primer_apellido", e.target.value.toUpperCase());
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
                disabled={isEditable ? false : true}
                placeholder="Segundo Apellido"
                type="text"
                style={{ height: "100%" }}
                value={user.segundo_apellido}
                onChange={(e) => {
                  handleSetChangeUser("segundo_apellido", e.target.value.toUpperCase());
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
                style={{ width: "100%", height: "100%" }}
                value={user.genero}
                onChange={(e) => {
                  handleSetChangeUser("genero", e);
                }}
              ></Select>
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
            <Select
                id="selectHospital"
                showSearch
                searchValue={searchHospital}
                onSearch={(e) => {
                  setSearchHospital(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
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
                      handleCrearHospital();
                    }}
                  >
                    Crear Hospital
                  </Button>
                }
                placeholder="Hospital"
                disabled={isEditable ? false : true}
                style={{ width: "100%", height: "100%" }}
                options={hospitales}
                size="large"
                value={selectedHospital}
                onChange={(e) => {
                  handleSetChangeUser("id_hospital", e);
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
                showSearch
                value={selectedDepartamento}
                onChange={(value) => {
                  setSelectedDepartamento(value);
                  setSelectedMunicipio(null); // Resetear municipio al cambiar departamento
                }}
                placeholder="Departamento"
                /* style={{
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
                  }} */
                style={{ width: "100%", height: "100%" }}
                size="large"
                options={departamentos.map((d) => ({
                  value: d.departamento_id,
                  label: d.nombre,
                }))}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                showSearch
                value={selectedMunicipio}
                onChange={(value) => {
                  setSelectedMunicipio(value);
                  handleSetChangeUser("municipio_id", value);
                }}
                placeholder="Municipio"
                style={{ width: "100%", height: "100%" }}
                size="large"
                disabled={!selectedDepartamento} // Deshabilitar si no hay departamento seleccionado
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
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: "auto" }}>
              <TextArea
                count={{ show: true }}
                disabled={isEditable ? false : true}
                prefix={<PushpinOutlined />}
                placeholder="Direccion Exacta"
                maxLength={150}
                autoSize={{ minRows: 2, maxRows: 4 }}
                value={user.direccion}
                onChange={(e) => {
                  handleSetChangeUser("direccion", e.target.value.toUpperCase());
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
                style={{ height: "100%", width: "100%" }}
                placeholder="Fecha de nacimiento"
                disabled={isEditable ? false : true}
                format="DD-MM-YYYY"
                allowClear={false}
                className="my-datepicker"
                value={handleObtenerFechaNacimiento()}
                onChange={(date, dateString) =>
                  handleSetChangeUser("fecha_nacimiento", date ? date.format("YYYY-MM-DD") : null)
                } 
               
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                addonBefore=
                {
                  <Select
                      suffixIcon={<PhoneOutlined style={{ color: "#8c8c8c", width:230}} />}
                      disabled={false}
                      placeholder="Referencia Telefonica"
                      showSearch
                      style={{
                        width: 250,
                        height: 48,
                        
                      }}
                      value={selectedCountry.current?.code}
                      onChange={(value) => {
                        const found = countries.find((c) => c.code === value);
                        selectedCountry.current = found;
                        handleSetChangeUser("referencia_telefonica",selectedCountryCode.current);
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
                }
                size="large"
                disabled={isEditable ? false : true}
                placeholder="Telefono"
                maxLength={9}
                type="text"
                style={{
                  height: "100%",
                  borderColor: "#FF0A0A",
                }}
                value={user.telefono}
                onChange={(e) => {
                  handleSetChangeUser(
                    "telefono",
                    e.target.value,
                    user.telefono
                  );
                }}
              />
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Rol y Usuario" />

          <Row gutter={25} style={{ marginTop: 20 }}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                placeholder="Usuario"
                type="text"
                style={{ height: "100%" }}
                value={user.nickname}
                disabled={isEditable ? false : true}
                onChange={(e) => {
                  handleSetChangeUser("nickname", e.target.value);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                placeholder="Rol"
                size="large"
                options={rolLog === "master" ? master_roles : roles}
                style={{ width: "100%", height: "100%" }}
                defaultValue={user.rol}
                value={user.rol}
                disabled={isEditable ? false : true}
                onChange={(e) => {
                  handleSetChangeUser("rol", e);
                }}
              ></Select>
            </Col>
          </Row>

          <Row gutter={25} style={{ marginTop: 20 }}>
            {rolLog === "master" && 
            (
              <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
              >
              <Select
                placeholder="Pais"
                size="large"
                style={{ width: "100%", height: "100%" }}
                value={pais.current}
                onChange={async(e) => {
                  pais.current = e;
                  setSelectedLugar(null);
                  loadHospitales(false);
                  setSelectedHospital(null);
                  setSelectedDepartamento(null);
                  fetchDepartamentos(e);
                  loadRef_Tel();
                  setUser({...user,"dni": ''});
                  loadLugar(e);
                }}
              >
                {paises.map((p) => (
                  <option key={p.id_pais} value={p.id_pais}>
                    {p.nombre}
                  </option>
                ))}
              </Select>
              </Col>
            )}
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                placeholder="Casa"
                size="large"
                style={{ width: "100%", height: "100%" }}
                value={selectedLugar}
                onChange={(e) => {
                  handleSetChangeUser("id_lugar", e);
                }}
              >
                {lugar.map((l) => (
                  <option key={l.id_lugar} value={l.id_lugar}>
                    {l.codigo}
                  </option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Contraseña" />
          <Row gutter={25} style={{ marginTop: 20 }}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<LockOutlined style={styleIconInput} />}
                size="large"
                placeholder="Contraseña"
                type="password"
                style={{ height: "100%" }}
                value={user.contrasena}
                onChange={(e) => {
                  handleSetChangeUser("contrasena", e.target.value);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<LockOutlined style={styleIconInput} />}
                size="large"
                placeholder="Confirmar Contraseña"
                type="password"
                style={{ height: "100%" }}
                value={user.confirmContrasena}
                onChange={(e) => {
                  handleSetChangeUser("confirmContrasena", e.target.value);
                }}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 1 }}>
            <Meta title="Recuerde: " />
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Meta description=" => Debe contener como minimo 8 caracteres " />
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 30 }}>
            <Meta description=" => Debe contener un caracter especial como (! @ # $ % ^ & *) " />
          </Row>

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
                    colorPrimary: "#77d9a1",
                    colorPrimaryHover: "#5fae81",
                    colorPrimaryActive: "#9bd8e5",
                    defaultHoverColor: "#fdfdfd",
                  },
                },
              }}
            >
              <Button
                loading={loading}
                type="primary"
                size={"large"}
                onClick={handleSubmit}
                style={{ marginRight: "20px" }}
              >
                Registrar
              </Button>
            </ConfigProvider>

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
          </div>
        </Card>
      </ConfigProvider>
    </Flex>
  );
}

export default CrearUsuarios;
