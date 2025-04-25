import React, { useEffect, useState } from "react";
import { Card, Col, Row, Input, Select, ConfigProvider, Button } from "antd";
import { FileSearchOutlined, TeamOutlined } from "@ant-design/icons";
import hospitalesApi from "../../api/Hospitales.api";
import pisosApi from "../../api/Piso.api";
import SalasApi from "../../api/Salas.api";
import CausaVisitaApi from "../../api/CausaVisita.api";
import { getAllCausas } from "../../api/CausaVisita.api";

import { useLayout } from "../../context/LayoutContext";

const { Meta } = Card;
const { TextArea } = Input;

const roles = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Usuario" },
];
const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

// Array con causas de visita predeterminadas
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

function InformacionPaciente({
  isEditable,
  user,
  changeUser,
  handleSetChangeUser,
}) {
  const [emptyFieldsInfoPaciente, setEmptyFieldsInfoPaciente] = useState(false);
  //console.log("userPa: ", user);

  const validateFields = () => {
    const newEmptyFields = {};
    if (!changeUser.id_hospital && !user.id_hospital)
      newEmptyFields.id_hospital = true;
    if (!changeUser.id_piso && !user.id_piso) newEmptyFields.id_piso = true;
    if (!changeUser.id_sala && !user.id_sala) newEmptyFields.id_sala = true;
    if (!changeUser.parentesco_paciente && !user.parentesco_paciente)
      newEmptyFields.parentesco_paciente = true;
    if (!changeUser.id_causa_visita && !user.id_causa_visita)
      newEmptyFields.id_causa_visita = true;
    if (!changeUser.observacion && !user.observacion)
      newEmptyFields.observacion = true;

    setEmptyFieldsInfoPaciente(newEmptyFields);
    return Object.keys(newEmptyFields).length === 0;
  };

  const { openNotification } = useLayout();
  const [hospitales, setHospitales] = useState([]);
  const [searchHospital, setSearchHospital] = useState("");

  const [pisos, setPisos] = useState([]);
  const [searchPiso, setSearchPiso] = useState("");

  const [salas, setSalas] = useState([]);
  const [searchSala, setSearchSala] = useState("");

  const [causasVisita, setCausasVisita] = useState(causasVisitaPredeterminadas);
  const [searchCausaVisita, setSearchCausaVisita] = useState("");

  const [loading, setLoading] = useState(false);

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

  const handleCrearHospital = async () => {
    setLoading(true);
    if (validarFormatoHospital()) {
      // Deberiamos llamar a la api para crear la procedencia;

      try {
        const hospitalFormat = searchHospital.split(",");

        //console.log(hospitalFormat);

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

        handleSetChangeUser("id_hospital", id_hospital_creado);

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

          //console.log(pisos);

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
    setLoading(true);
    try {
      if (searchPiso === "" || changeUser.id_hospital === "") {
        openNotification(
          2,
          "Error",
          "Debe seleccionar un hospital y un nombre de piso"
        );
        return;
      }

      const response = await pisosApi.postTransaccionRequest({
        id_hospital: changeUser.id_hospital,
        nombre_piso: searchPiso,
      });

      if (!response || response.status !== 201) {
        // Deberia lanzar una notificacion de error
        openNotification(2, "Error", "No se pudo crear el piso");
        return;
      }

      loadPisos(changeUser.id_hospital);
      const id_ocupacion_creada = response.data.id_piso;
      openNotification(0, "Piso Creado", "Se creo la ocupacion correctamente");

      handleSetChangeUser("id_piso", id_ocupacion_creada);

      document.getElementById("selectPiso").blur();

      // Validar que retorna porque tenemos que asignarle ese id al user
    } catch (error) {}

    setLoading(false);
  };

  const loadSalas = async (id_piso) => {
    try {
      const response = await SalasApi.getSalasRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las salas");
      }

      if (response.status >= 200 && response.status < 300) {
        if (id_piso) {
          const salas = response.data.filter((e) => e.id_piso === id_piso);

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
      console.log("Causas de visita: ", causas);
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

      handleSetChangeUser("id_causa_visita", response.data.id_causa_visita);

      document.getElementById("selectCausa").blur();
      loadCausasVisita();
    } catch (error) {}
  };

  const handleCrearSala = async () => {
    setLoading(true);
    try {
      if (searchSala === "" || changeUser.id_piso === "") {
        openNotification(
          2,
          "Error",
          "Debe seleccionar un Piso y un nombre de sala"
        );
        return;
      }

      const response = await SalasApi.postSalasRequest({
        id_piso: changeUser.id_piso,
        nombre_sala: searchSala,
      });

      if (!response || response.status !== 201) {
        // Deberia lanzar una notificacion de error
        openNotification(2, "Error", "No se pudo crear la sala");
        return;
      }

      loadSalas(changeUser.id_piso);

      const id_ocupacion_creada = response.data.id_sala;
      openNotification(0, "Sala Creada", "Se creo la sala correctamente");

      handleSetChangeUser("id_sala", id_ocupacion_creada);

      document.getElementById("selectSala").blur();

      // Validar que retorna porque tenemos que asignarle ese id al user
    } catch (error) {}

    setLoading(false);
  };

  useEffect(() => {
    loadHospitales();
    loadPisos(user ? user.id_hospital : null);
    loadSalas(user ? user.id_piso : null);
    loadCausasVisita();
  }, []);

  return (
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
                    handleCrearHospital(handleSetChangeUser);
                  }}
                >
                  Crear Hospital
                </Button>
              }
              placeholder="Hospital"
              disabled={isEditable ? false : true}
              style={{
                width: "100%",
                height: "100%",
                //borderColor: emptyFields.id_hospital ? "#FF0A0A" : undefined,
              }}
              options={hospitales}
              size="large"
              value={isEditable ? changeUser.id_hospital : user.id_hospital}
              onChange={(e) => {
                handleSetChangeUser("id_hospital", e);
                loadPisos(e);
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
              disabled={isEditable ? false : true}
              style={{
                width: "100%",
                height: "100%",
                //borderColor: emptyFields.id_piso ? "#FF0A0A" : undefined,
              }}
              options={pisos}
              size="large"
              value={isEditable ? changeUser.id_piso : user.id_piso}
              onChange={(e) => {
                loadSalas(e);
                handleSetChangeUser("id_piso", e);
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
              disabled={isEditable ? false : true}
              style={{
                width: "100%",
                height: "100%",
                //borderColor: emptyFields.id_sala ? "#FF0A0A" : undefined,
              }}
              options={salas}
              size="large"
              value={isEditable ? changeUser.id_sala : user.id_sala}
              onChange={(e) => {
                handleSetChangeUser("id_sala", e);
              }}
            />
          </Col>
        </Row>

        <Row gutter={25}>
          {/* <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Input
              prefix={<TeamOutlined style={styleIconInput} />}
              size="large"
              disabled={isEditable ? false : true}
              placeholder="Parentesco"
              maxLength={15}
              type="text"
              style={{
                height: "100%",
                //borderColor: emptyFields.parentesco ? "#FF0A0A" : undefined,
              }}
              value={
                isEditable
                  ? changeUser.parentesco_paciente
                  : user.parentesco_paciente
              }
              onChange={(e) => {
                handleSetChangeUser("parentesco", e.target.value.toUpperCase());
              }}
            />
          </Col> */}
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "100%" }}
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
              disabled={isEditable ? false : true}
              style={{
                width: "100%",
                height: "100%",
                /* borderColor: emptyFields.id_causa_visita
                  ? "#FF0A0A"
                  : undefined, */
              }}
              options={causasVisita}
              size="large"
              value={
                isEditable ? changeUser.id_causa_visita : user.id_causa_visita
              }
              onChange={(e) => {
                handleSetChangeUser("id_causa_visita", e);
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col flex={"100%"} style={{ marginBottom: 25, height: "auto" }}>
            <TextArea
              disabled={isEditable ? false : true}
              prefix={<FileSearchOutlined />}
              placeholder="Observacion Sobre El Paciente"
              maxLength={150}
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={
                {
                  //borderColor: emptyFields.observacion ? "#FF0A0A" : undefined,
                }
              }
              value={isEditable ? changeUser.observacion : user.observacion}
              onChange={(e) => {
                handleSetChangeUser(
                  "observacion",
                  e.target.value.toUpperCase()
                );
              }}
            />
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
}

export default InformacionPaciente;
