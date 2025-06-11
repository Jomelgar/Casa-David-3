import React, { useEffect, useState,useRef } from "react";
import {
  UserOutlined,
  IdcardOutlined,
  PushpinOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Input,
  Select,
  Button,
  DatePicker,
  ConfigProvider,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLayout } from "../../context/LayoutContext";
import OcupacionesApi from "../../api/Ocupaciones.api";
import LugarApi from "../../api/Lugar.api";
import { getDepartamentos,getDepartamentoByPais } from "../../api/departamentoApi";
import {
  getMunicipiosByDepartamentoId,
  getMunicipioById,
} from "../../api/municipioApi";
import { getUserFromToken } from "../../utilities/auth.utils";
import formatearValor from "../../utilities/formato_dni";
import axios from "axios";
import axiosInstance from '../../api/axiosInstance';
import { COUNTRIES_API } from "../../api/Huesped.api";
import personaApi from "../../api/Persona.api";
import paisApi from "../../api/Pais.api";


const { Meta } = Card;
const { TextArea } = Input;

dayjs.extend(customParseFormat);


const InformacionPersonal = ({
  user,
  changeUser,
  isEditable,
  handleSetChangeUser,
}) => {
  const usuario = getUserFromToken();
  const rolLog = usuario.rol;
  console.log(usuario);
  const [countries,setCountries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedCountry,setSelectedCountry] = useState(null);
  const selectedCountryCode = useRef(user.referencia_telefonica);
  const [paises,setPaises] = useState([]);
  const pais = useRef(null);

  const loadPaises= async() => 
    {
      const paisData = await paisApi.getPaisForTable();
      setPaises(paisData.data.map((p) =>
        ({
          id_pais: p.id_pais,
          nombre: p.nombre,
          referencia_telefonica: p.referencia_telefonica,
          formato_dni: p.formato_dni
        }))
      );
      pais.current = await personaApi.getPaisByPersona(user.id_persona);
      pais.current = pais.current.data;
    }

  useEffect(() => {
    const fetchLugar= async()=>
      {
        try {
            setSelectedMunicipio(null);
            setSelectedDepartamento(null);
            const response = await LugarApi.getPaisByLugar(changeUser.id_lugar);
            console.log(response);
            const p = response.data;
            const departamentoData = await getDepartamentoByPais(p.id_pais); 
            setDepartamentos(departamentoData);
        } catch (error) {
          console.error('Error al cargar datos de países:', error);
        }
      }
    fetchLugar();
  }
  ,[changeUser.id_lugar])

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
        await loadPaises();
        const pais = await personaApi.getPaisByPersona(user?.id_persona || usuario.id_persona);
        console.log(pais);
        const selected = await filtered.find(c => c.code === pais.data.referencia_telefonica);
        setSelectedCountry(selected || filtered[0]);
      } catch (error) {
        console.error('Error al cargar datos de países:', error);
      }
    };
  
    fetchData();
  }, [user]);
  
  const generos = [
    { value: "MASCULINO", label: "MASCULINO" },
    { value: "FEMENINO", label: "FEMENINO" },
  ];

  const [ocupaciones, setOcupaciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(user.municipio_id);
  const [searchOcupacion, setSearchOcupacion] = useState("");
  const [loading, setLoading] = useState(false);

  const { openNotification } = useLayout();

  const loadOcupaciones = async () => {
    try {
      const response = await OcupacionesApi.getOcupacionesRequest();
      if (response.status >= 200 && response.status < 300) {
        setOcupaciones(
          response.data.map((e) => ({
            value: e.id_ocupacion,
            label: e.descripcion,
          }))
        );
      } else {
        throw new Error("No se pudo cargar las ocupaciones");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadMunicipioAndDepartamento = async () => {
    if (user.municipio_id) {
      try {
        const municipioData = await getMunicipioById(user.municipio_id);
        setSelectedMunicipio(municipioData.municipio_id);

        const p = await personaApi.getPaisByPersona(user.id_persona);
        const paisId = p.data.id_pais;

        let departamentosData = await getDepartamentoByPais(paisId);
        departamentosData = departamentosData.filter(
          (d) => d.id_pais === paisId
        ); 
        let departamento = departamentosData.find(
          (d) => d.departamento_id === municipioData.departamento_id
        );
        console.log(departamento)
        if (departamento) {
          setSelectedDepartamento(departamento.departamento_id);
          setDepartamentos(departamentosData);
          const municipios = await getMunicipiosByDepartamentoId(departamento.departamento_id);
          setMunicipios(municipios);
        } else {
          departamentosData = await getDepartamentoByPais(paisId); // sin let
          console.log("Departamentos corregidos:", departamentosData);
          setDepartamentos(departamentosData);
          setSelectedDepartamento(null);
          setSelectedMunicipio(null);
          setMunicipios([]);
          handleSetChangeUser("municipio_id", {});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    loadOcupaciones();
    loadMunicipioAndDepartamento();

  }, [user]);

  useEffect(() => {
  const fetchDepAndMun = async () => {
    if (!isEditable && user.municipio_id) {
      const p = await personaApi.getPaisByPersona(user.id_persona);
      const paisId = p.data.id_pais;
      const municipio = await getMunicipioById(user.municipio_id);
      const departamentosData = await getDepartamentoByPais(paisId);
      const departamento = departamentosData.find(
        (d) => d.departamento_id === municipio.departamento_id
      );

      setDepartamentos(departamentosData);
      setMunicipios(await getMunicipiosByDepartamentoId(departamento.departamento_id));

      // Solo establece si no está seteado manualmente antes
      setSelectedDepartamento(departamento.departamento_id);
      setSelectedMunicipio(user.municipio_id);
    }
  };

  fetchDepAndMun();
}, [isEditable]);

  const handleCrearOcupacion = async () => {
    setLoading(true);
    try {
      const response = await OcupacionesApi.postOcupacionRequest({
        descripcion: searchOcupacion,
      });

      if (!response || response.status !== 201) {
        openNotification(2, "Error", "No se pudo crear la ocupacion");
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
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

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
      }}
    >
      <Card style={{ marginTop: 16 }} className="shadow-#1 w-[100%]">
        <Meta title="Informacion Personal" />

        <Row gutter={25} style={{ marginTop: 20 }}>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Input
              prefix={<IdcardOutlined style={styleIconInput} />}
              disabled={isEditable ? false : true}
              size="large"
              placeholder="No. de Identidad"
              maxLength={15}
              type="text"
              style={{ height: "100%" }}
              value={isEditable ? changeUser.dni : user.dni}
              onChange={(e) => {
                const value = e.target.value;
                const esBorrado = e.nativeEvent.inputType === "deleteContentBackward";
                const dni = formatearValor(value,pais.current.formato_dni,esBorrado);
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
              disabled={isEditable ? false : true}
              size="large"
              searchValue={searchOcupacion}
              onSearch={(e) => {
                setSearchOcupacion(e.toUpperCase());
              }}
              notFoundContent={
                rolLog === "admin" || rolLog === "master" ? (
                  <Button loading={loading} onClick={handleCrearOcupacion}>
                    Crear Ocupacion
                  </Button>
                ) : (
                  <p className="p-3">No se encontro</p>
                )
              }
              options={ocupaciones}
              style={{ width: "100%", height: "100%" }}
              value={isEditable ? changeUser.id_ocupacion : user.id_ocupacion}
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
              value={isEditable ? changeUser.primer_nombre : user.primer_nombre}
              onChange={(e) => {
                handleSetChangeUser(
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
              disabled={isEditable ? false : true}
              placeholder="Segundo Nombre"
              type="text"
              style={{ height: "100%" }}
              value={
                isEditable ? changeUser.segundo_nombre : user.segundo_nombre
              }
              onChange={(e) => {
                handleSetChangeUser(
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
              disabled={isEditable ? false : true}
              placeholder="Primer Apellido"
              type="text"
              style={{ height: "100%" }}
              value={
                isEditable ? changeUser.primer_apellido : user.primer_apellido
              }
              onChange={(e) => {
                handleSetChangeUser(
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
              disabled={isEditable ? false : true}
              placeholder="Segundo Apellido"
              type="text"
              style={{ height: "100%" }}
              value={
                isEditable ? changeUser.segundo_apellido : user.segundo_apellido
              }
              onChange={(e) => {
                handleSetChangeUser(
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
              disabled={isEditable ? false : true}
              options={generos}
              style={{ width: "100%", height: "100%" }}
              value={isEditable ? changeUser.genero : user.genero}
              onChange={(value) => {
                handleSetChangeUser("genero", value);
              }}
            ></Select>
          </Col>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Input
              placeholder="Iglesia"
              size="large"
              disabled={isEditable ? false : true}
              type="text"
              style={{ width: "100%", height: "100%" }}
              value={isEditable ? changeUser.iglesia : user.iglesia}
              onChange={(e) =>
                handleSetChangeUser("iglesia", e.target.value.toUpperCase())
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
              placeholder="Departamento"
              size="large"
              disabled={!isEditable}
              value={selectedDepartamento}
              options={(departamentos || []).map((d) => ({
                value: d.departamento_id,
                label: d.nombre.toUpperCase(),
              }))}
              style={{ width: "100%", height: "100%" }}
              onChange={async (value) => {
                setSelectedDepartamento(value);
                setSelectedMunicipio(null);
                const municipios = await getMunicipiosByDepartamentoId(value);
                setMunicipios(municipios);
              }}
            />
          </Col>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Select
              showSearch
              placeholder="Municipio"
              size="large"
              value={selectedMunicipio}
              onChange={(value) => {
                setSelectedMunicipio(value);
                handleSetChangeUser("municipio_id", value);
              }}
              options={(municipios || []).map((m) => ({
                value: m.municipio_id,
                label: m.nombre.toUpperCase(),
              }))}
              disabled={!selectedDepartamento || !isEditable}
              style={{ width: "100%", height: "100%" }}
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
              value={isEditable ? changeUser.direccion : user.direccion}
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
              disabled={!isEditable}
              format="DD-MM-YYYY"
              allowClear={false}
              value={
                isEditable
                  ? dayjs(changeUser.fecha_nacimiento, "YYYY-MM-DD")
                  : dayjs(user.fecha_nacimiento, "YYYY-MM-DD")
              }
              onChange={(date, dateString) =>
                handleSetChangeUser("fecha_nacimiento", date ? date.format("YYYY-MM-DD") : null)
              }
            />
          </Col>
          <Col
            xs={{ flex: "100%", width: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Row gutter={0} style={{ width: '100%' }}>
              <Col span={12}>
                <Select
                placeholder="Referencia Telefónica"
                disabled={!isEditable}
                showSearch
                value={selectedCountryCode.current}
                onChange={(value) => {
                  const found = countries.find((c) => c.code === value);
                  setSelectedCountry(found);
                  selectedCountryCode.current = value;
                  handleSetChangeUser("referencia_telefonica", value);
                }}
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                style={{
                  width: "100%",
                  height: 48,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderRight: "none",
                  boxShadow: "none",
                }}
              >
                {countries.map(({ code, name, flag }) => (
                  <Select.Option
                    key={code}
                    value={code}
                    label={
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <PhoneOutlined style={{ color: "#8c8c8c" , marginRight: '15px'}} />
                        {name} ({code})
                      </span>
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img
                        src={flag}
                        alt={name}
                        style={{
                          width: 20,
                          height: 15,
                          borderRadius: 2,
                          objectFit: "cover",
                        }}
                      />
                      {name} ({code})
                    </div>
                  </Select.Option>
                ))}
              </Select>
              </Col>
              <Col span={12}>
                <Input
                  size="large"
                  disabled={!isEditable}
                  placeholder="Teléfono"
                  maxLength={9}
                  type="text"
                  
                  value={isEditable ? changeUser.telefono : user.telefono}
                  onChange={(e) => {
                    handleSetChangeUser("telefono", e.target.value, changeUser.telefono);
                  }}
                  style={{
                    height: 48,
                    width: '100%',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeft: "none",
                    boxShadow: "none",
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
};

export default InformacionPersonal;
