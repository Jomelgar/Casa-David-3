import { Card, Row, Col, Input, Button, Select, ConfigProvider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useLayout } from "../../context/LayoutContext";

import { useEffect } from "react";

import PatronoApi from "../../api/Patrono.api";

function PatronoHuesped({ isEditable, user, changeUser, handleSetChangeUser }) {
  const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };
  const { Meta } = Card;

  const { openNotification } = useLayout();
  const [patronos, setPatronos] = useState([]);

  const [searchPatrono, setSearchPatrono] = useState("");

  const loadPatronos = async () => {
    try {
      const response = await PatronoApi.getPatronosRequest();

      if (!response || response.status < 200 || response.status >= 300) {
        openNotification("error", "Error al cargar los patronos");
        return;
      }

      setPatronos(
        response.data.map((patrono) => ({
          value: patrono.id_patrono,
          label: patrono.nombre,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCrearPatrono = async () => {
    if (searchPatrono === "") {
      openNotification(2, "error", "Debe ingresar un nombre para el patrono");
      return;
    }

    try {
      const response = await PatronoApi.postPatronoRequest({
        nombre: searchPatrono,
      });

      if (!response || response.status < 200 || response.status >= 300) {
        openNotification(2, "error", "Error al crear el patrono");
        return;
      }

      openNotification(0, "success", "Patrono creado exitosamente");

      handleSetChangeUser("id_patrono", response.data.id_patrono);
      document.getElementById("selectPatrono").blur();
      loadPatronos();
    } catch (error) {}
  };

  useEffect(() => {
    loadPatronos();
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
        <Meta title="Patrono y Afiliado" />

        <Row gutter={25} style={{ marginTop: 20 }}>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "100%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Select
              id="selectPatrono"
              showSearch
              searchValue={searchPatrono}
              onSearch={(e) => {
                setSearchPatrono(e.toUpperCase());
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
                  onClick={(e) => {
                    handleCrearPatrono();
                  }}
                >
                  Crear Patrono
                </Button>
              }
              placeholder="Patrono"
              disabled={isEditable ? false : true}
              style={{ width: "100%", height: "100%" }}
              options={patronos}
              size="large"
              value={isEditable ? changeUser.id_patrono : user.id_patrono}
              onChange={(e) => {
                handleSetChangeUser("id_patrono", e);
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
              placeholder="DNI Afiliado"
              maxLength={15}
              type="text"
              style={{ height: "100%" }}
              value={isEditable ? changeUser.dni_afiliado : user.dni_afiliado}
              onChange={(e) => {
                handleSetChangeUser("dni_afiliado", e.target.value, changeUser.dni_afiliado);
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
              placeholder="Nombre Afiliado"
              type="text"
              style={{ height: "100%" }}
              value={
                isEditable ? changeUser.nombre_afiliado : user.nombre_afiliado
              }
              onChange={(e) => {
                handleSetChangeUser("nombre_afiliado", e.target.value.toUpperCase());
              }}
            />
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
}

export default PatronoHuesped;
