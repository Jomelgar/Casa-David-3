import React, { useEffect, useState } from "react";
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
//import customParseFormat from "dayjs/plugin/customParseFormat";
import OcupacionesApi from "../../api/Ocupaciones.api";
import { getDepartamentos } from "../../api/departamentoApi";
import {
  getMunicipiosByDepartamentoId,
  getMunicipioById,
} from "../../api/municipioApi";
import { getUserFromToken } from "../../utilities/auth.utils";

const { Meta } = Card;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";



const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

const InformacionPersonal = ({
  user,
  changeUser,
  isEditable,
  handleSetChangeUser,
}) => {
  const usuario = getUserFromToken();
  const rolLog = usuario.rol;

  const generos = [
    { value: "MASCULINO", label: "MASCULINO" },
    { value: "FEMENINO", label: "FEMENINO" },
  ];

  const [ocupaciones, setOcupaciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [iglesia, setIglesia] = useState(user.iglesia || "");

  const [selectedDepartamento, setSelectedDepartamento] = useState(
    user?.municipio_id?.departamento_id || null
  );
  const [selectedMunicipio, setSelectedMunicipio] = useState(
    user?.municipio_id?.nombre || null
  );

  //const [selectedDepartamento, setSelectedDepartamento] = useState(user.municipio_id ? user.municipio_id.departamento_id : null);
  //const [selectedMunicipio, setSelectedMunicipio] = useState(user.municipio_id || null);

  const { openNotification } = useLayout();

  const [searchOcupacion, setSearchOcupacion] = useState("");
  const [loading, setLoading] = useState(false);

  

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
        return;
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
        // Obtener los datos del municipio por ID
        const municipioData = await getMunicipioById(user.municipio_id);
        //console.log("municipioData", municipioData);
        setSelectedMunicipio(municipioData.nombre);

        // Ahora, obtener el nombre del departamento con el departamento_id del municipio
        const departamentoData = await getDepartamentos();
        const departamentoNombre = departamentoData.find(
          (d) => d.departamento_id === municipioData.departamento_id
        )?.nombre;

        // Almacenar el nombre del departamento en el estado
        setSelectedDepartamento(departamentoNombre || null);
        setDepartamentos(departamentoData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    loadOcupaciones();
    loadMunicipioAndDepartamento();
    //console.log("Abriendo informacion personal con user:", user);
    //console.log("Abriendo informacion personal con changeUser:", changeUser);
  }, []);

  const formattedDate = user.fecha_nacimiento
    ? dayjs(user.fecha_nacimiento).format("DD-MM-YYYY")
    : null;

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
              disabled={isEditable ? false : true}
              size="large"
              placeholder="No. de Identidad"
              maxLength={15}
              type="text"
              style={{ height: "100%" }}
              value={isEditable ? changeUser.dni : user.dni}
              onChange={(e) => {
                handleSetChangeUser("dni", e.target.value, changeUser.dni);
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
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Input
              prefix={<PhoneOutlined style={styleIconInput} />}
              size="large"
              disabled={isEditable ? false : true}
              placeholder="Telefono"
              maxLength={9}
              type="text"
              style={{ height: "100%" }}
              value={isEditable ? changeUser.telefono : user.telefono}
              onChange={(e) => {
                handleSetChangeUser(
                  "telefono",
                  e.target.value,
                  changeUser.telefono
                );
              }}
            />
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
};

export default InformacionPersonal;
