import React, { useState } from "react";
import {
  Card,
  ConfigProvider,
  Row,
  Col,
  Input,
  Button,
  Flex,
  Modal,
} from "antd";
import { LockOutlined, SaveOutlined } from "@ant-design/icons";
import { useLayout } from "../../context/LayoutContext";
import UserApi from "../../api/User.api";

//const crypto = require('crypto');
const { Meta } = Card;

const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

const CaraEspecial = ["!", "@", "#", "$", "^", "&", "*"];

const ContraPersonal = ({ id_user }) => {
  const { openNotification } = useLayout();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (Igual()) {
      if (ValidaCampo()) {
        // Aqui se debe hacer la peticion para cambiar la contraseña
        setLoading(true);
        SaveContra();
      }
    } else {
      openNotification(2, "Error", "Las contraseñas no coinciden");
    }

    return;
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const Igual = () => {
    if (password === password2) {
      return true;
    }

    return false;
  };

  const ValidaCampo = () => {
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

  let usuario;

  const SaveContra = async () => {
    try {
      setLoading(true);
      console.log(id_user);
      const response = await UserApi.getUserRequest(id_user);

      if (!response) {
        throw new Error("No se pudo cargar el usuario");
      }

      if (response.status === 201) {
        const contrasena = {
          contrasena: password,
        };

        const responsePut = await UserApi.putUserRequest(id_user, contrasena);

        if (responsePut.status === 201) {
          setLoading(false);
          openNotification(0, "Contraseña Cambiada");
          setPassword("");
          setPassword2("");
        } else {
          openNotification(2, "Error", "No se pudo cambiar la contraseña");
          
        }

        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  /*
  function encrpyt(contra) {
    let cipher = crypto.createCipher('aes192', 'a password');
    let encriptado = cipher.update(contra, 'utf8', 'hex');
    encriptado = cipher.final('hex');
    return encriptado;
  };*/

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
        <Meta title="Cambiar Contraseña" />
        <Row gutter={25} style={{ marginTop: 20 }}>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Input.Password
              prefix={<LockOutlined style={styleIconInput} />}
              //disabled={isEditable ? false : true}
              size="large"
              placeholder="Nueva Contraseña"
              type="text"
              style={{ height: "100%" }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
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
            <Input.Password
              prefix={<LockOutlined style={styleIconInput} />}
              //disabled={isEditable ? false : true}
              size="large"
              placeholder="Confirmar Nueva Contraseña"
              type="text"
              style={{ height: "100%" }}
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
              
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 50 }}>
          <Meta title="Recuerde: " />
        </Row>
        <Row style={{ marginTop: 30 }}>
          <Meta description=" => Debe contener como minimo 8 caracteres " />
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Meta description=" => Debe contener un caracter especial como (! @ # $ % ^ & *) " />
        </Row>

        <Flex
          gap="large"
          justify="center"
          align="center"
          style={{ marginTop: 50 }}
        >
          <Button
            icon={<SaveOutlined />}
            type="primary"
            size={"large"}
            //style={{ display: isEditable ? "block" : "none" }}
            //onClick={handleGuardar}
            onClick={showModal}
            loading={loading}
          >
            Guardar Contraseña
          </Button>
          <Modal
            title="Contraseña"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Guardar"
            cancelText="Regresar"
            confirmLoading={loading}
          >
            <p>Esta seguro que quiere guardar la contraseña?</p>
          </Modal>
        </Flex>
      </Card>
    </ConfigProvider>
  );
};

export default ContraPersonal;
