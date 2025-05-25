import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Input, Select, ConfigProvider, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import hospitalesApi from '../../api/Hospitales.api';
import { useLayout } from '../../context/LayoutContext';
import { getUserFromToken } from '../../utilities/auth.utils';

const { Meta } = Card;

const master_roles = [
  {value: "master", label: "MASTER"},
  { value: "admin", label: "ADMINISTRADOR" },
  { value: "usuario", label: "USUARIO" },
];

const admin_roles = [
  { value: "admin", label: "ADMINISTRADOR" },
  { value: "usuario", label: "USUARIO" },
];
const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

/*

OJO necesita un objeto user que tenga los siguientes atributos

nickname
rol

Se necesita una copia de este mismo en el caso de que se editen estos valores
y se quiere volver a los originales.

(se podria volver a los originales,  realizando un peticion al servidor, pero asi nos ahorramos esa peticion xD)

*/

function InformacionPersonalForm({
  handleSetChangeUser,
  isEditable,
  user,
  changeUser,
}) {
  const { openNotification } = useLayout();
  const [hospitales, setHospitales] = useState([]);
  const [searchHospital, setSearchHospital] = useState("");
  const [loading, setLoading] = useState(false);

  const usuario = getUserFromToken();

  const rolLog = usuario.role;

  const loadHospitales = async () => {
    try {
      const response = await hospitalesApi.getHospitalRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las Hospitales");
      }

      if (response.status === 200) {
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

        console.log("paso el split");

        console.log(hospitalFormat);

        const response = await hospitalesApi.postHospitalesRequest({
          nombre: hospitalFormat[0],
          direccion: hospitalFormat[1],
        });

        if (!response || response.status !== 201) {
          // Deberia lanzar una notificacion de error
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
        console.error(error);
        openNotification(3, "Error", error);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadHospitales();
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
              value={isEditable ? changeUser.nickname : user.nickname}
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
              options={rolLog === "master" ? master_roles : admin_roles}
              style={{ width: "100%", height: "100%" }}
              defaultValue={user.rol}
              value={isEditable ? changeUser.rol : user.rol}
              disabled={isEditable ? (rolLog === "admin" || rolLog === "master" ? false : true) : true}
              onChange={(value) => {
                handleSetChangeUser("rol", value);
              }}
            ></Select>
          </Col>
        </Row>

        <Row gutter={25} style={{ marginTop: 20 }}>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Select
              id="selectHospital"
              showSearch
              //searchValue={searchHospital}
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
                rolLog === "admin" || rolLog === "master" ? (
                  <Button loading={loading} onClick={handleCrearHospital}>
                    Crear Hospital
                  </Button>
                ) : (
                  <p className="p-3">No se encontro</p>
                )
              }
              placeholder="Hospital"
              disabled={isEditable ? false : true}
              style={{ width: "100%", height: "100%" }}
              options={hospitales}
              size="large"
              value={isEditable ? changeUser.id_hospital : user.id_hospital}
              onChange={(e) => {
                handleSetChangeUser("id_hospital", e);
                setSearchHospital(e);
              }}
            />
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
}

export default InformacionPersonalForm;
