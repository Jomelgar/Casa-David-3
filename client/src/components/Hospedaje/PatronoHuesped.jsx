// src/components/Hospedaje/PatronoHuesped.jsx

import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Input,
  ConfigProvider,
  Checkbox,
} from "antd";

import { useLayout } from "../../context/LayoutContext";
import PatronoApi from "../../api/Patrono.api";


function PatronoHuesped({ isEditable, user, changeUser, handleSetChangeUser, Segundapersona}) {
  

  const { openNotification } = useLayout();
  const { Meta } = Card;

  // — estados lista de patronos —
  const [patronos, setPatronos] = useState([]);
  const [searchPatrono, setSearchPatrono] = useState("");

  // — estados de los checkboxes —
  const [huespedMarcado, setHuespedMarcado] = useState(false);
  const [acompananteMarcado, setAcompananteMarcado] = useState(false);

  
  // carga inicial
  useEffect(() => {
    async function load() {
      try {
        const resp = await PatronoApi.getPatronosRequest();
        if (!resp || resp.status < 200 || resp.status >= 300) {
          openNotification("error", "Error al cargar los patronos");
          return;
        }
        setPatronos(
          resp.data.map(p => ({ value: p.id_patrono, label: p.nombre }))
        );
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [openNotification]);

  // crear patrono
  const handleCrearPatrono = async () => {
    if (searchPatrono.trim() === "") {
      openNotification("error", "Debe ingresar un nombre para el patrono");
      return;
    }
    try {
      const resp = await PatronoApi.postPatronoRequest({ nombre: searchPatrono });
      if (!resp || resp.status < 200 || resp.status >= 300) {
        openNotification("error", "Error al crear el patrono");
        return;
      }
      openNotification("success", "Patrono creado exitosamente");
      handleSetChangeUser("id_patrono", resp.data.id_patrono);
      document.getElementById("selectPatrono")?.blur();
      // recargar lista
      const nuevaLista = await PatronoApi.getPatronosRequest();
      setPatronos(
        nuevaLista.data.map(p => ({ value: p.id_patrono, label: p.nombre }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // handlers de checkboxes
 // ————— Handlers de los checkboxes —————
const handleHuespedChange = (e) => {
  const checked = e.target.checked;
  setHuespedMarcado(checked);
  if (checked) {
    // si marcaste "Huésped", desmarca "Acompañante"
    handleSetChangeUser("nombre_afiliado",  Segundapersona.primer_nombre);
    handleSetChangeUser("dni_afiliado", Segundapersona.dni);
    isEditable=true;
    setAcompananteMarcado(false);
  }
};

const handleAcompananteChange = (e) => {
  const checked = e.target.checked;
  setAcompananteMarcado(checked);
  if (checked) {
    // si marcaste "Acompañante", desmarca "Huésped"
    handleSetChangeUser("nombre_afiliado", changeUser.primer_nombre)
    handleSetChangeUser("dni_afiliado", changeUser.dni)
    isEditable=true;
    setHuespedMarcado(false);
  }
};

  // sólo UI
  const OpcionesMarcado = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 20,
        marginTop: 16,
      }}
    >
      <Checkbox
        style={{ width: 270, height: 45 }}
        checked={huespedMarcado}
        onChange={handleHuespedChange}
        className="text-lg px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200 text-gray-800 font-semibold"
      >
        Marcar Acompañante
      </Checkbox>

      <Checkbox
        style={{ width: 270, height: 45 }}
        checked={acompananteMarcado}
        onChange={handleAcompananteChange}
        className="text-lg px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200 text-gray-800 font-semibold"
      >
        Marcar Huésped
      </Checkbox>
    </div>
  );

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
      <Card style={{ marginTop: 16 }}>
        <Meta title="Patrono y Afiliado" />
        <OpcionesMarcado />
        <Row gutter={25} style={{ marginTop: 20 }}>
          <Col xs={{ flex: "100%" }} lg={{ flex: "100%" }} style={{ marginBottom: 25, height: 50 }}>
            

            <Select
              id="selectPatrono"
              showSearch
              searchValue={searchPatrono}
              onSearch={val => setSearchPatrono(val.toUpperCase())}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent={<Button onClick={handleCrearPatrono}>Crear Patrono</Button>}
              placeholder="Patrono"
              disabled={!isEditable}
              style={{ width: "100%", height: "100%" }}
              options={patronos}
              size="large"
              value={isEditable ? changeUser.id_patrono : user.id_patrono}
              onChange={val => handleSetChangeUser("id_patrono", val)}
            />
          </Col>
        </Row>

        <Row gutter={25}>
          <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
            <Input
              prefix={<UserOutlined style={{ fontSize: 24, color: "#dedede", paddingRight: 10 }} />}
              size="large"
              disabled={!isEditable}
              placeholder="Identidad del Afiliado"
              style={{ height: "100%" }}
              // en lugar de la ternaria:
              
              value={
              // Si el checkbox Huésped está marcado, siempre uso Segundapersona.dni
                huespedMarcado ? Segundapersona.dni :
                // Si el checkbox Acompañante está marcado, uso changeUser.dni
                acompananteMarcado ? changeUser.dni_afiliado :
                // En cualquier otro caso, muestro el valor de user (lectura por defecto)
                isEditable ? changeUser.dni_afiliado:
                user.dni_afiliado
              }
              onChange={e => handleSetChangeUser("dni_afiliado", e.target.value)}
            />
          </Col>

          <Col xs={{ flex: "100%" }} lg={{ flex: "50%" }} style={{ marginBottom: 25, height: 50 }}>
            <Input
              prefix={<UserOutlined style={{ fontSize: 24, color: "#dedede", paddingRight: 10 }} />}
              size="large"
              disabled={!isEditable}
              placeholder="Nombre Afiliado"
              style={{ height: "100%" }}
              // en lugar de la ternaria:
              //value={isEditable ? changeUser.nombre_afiliado : user.nombre_afiliado}
              value={
              // Si el checkbox Huésped está marcado, siempre uso Segundapersona.dni
                huespedMarcado ? Segundapersona.primer_nombre :
                // Si el checkbox Acompañante está marcado, uso changeUser.dni
                acompananteMarcado ? changeUser.primer_nombre :
                // En cualquier otro caso, muestro el valor de user (lectura por defecto)
                isEditable ? changeUser.nombre_afiliado:
                user.nombre_afiliado
              }

              onChange={e =>
                handleSetChangeUser("nombre_afiliado", e.target.value.toUpperCase())
              }
            />
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
}

export default PatronoHuesped;
