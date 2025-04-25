import React, { useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { ConfigProvider, Input, Card, Button, Modal, Col, Row } from "antd";

const { Meta } = Card;
const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

const ContraCrear = ({
  userIn,
  changeUserIn,
  isEditable,
  handleSetChangeUser,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [changeUser, setChangeUser] = useState({});
  const [user, setUser] = useState({});

  setUser(userIn);
  setChangeUser(changeUserIn);

  const handleEditar = (event) => {
    event.preventDefault();

    const passwordRegex = /^.{9,}$/;

    if (!passwordRegex.test(password)) {
      setErrorMessage("La contraseña debe tener más de 8 caracteres.");
      setErrorModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setErrorModalVisible(true);
      return;
    }

    // If all checks pass, show success modal
    setSuccessModalVisible(true);
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Col>
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
            <Button type="primary" size={"large"} onClick={handleEditar}>
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
                setPassword("");
                setConfirmPassword("");
              }}
            >
              Cancelar
            </Button>
          </ConfigProvider>
        </div>
      </Card>

      <Modal
        title="Éxito"
        visible={successModalVisible}
        onCancel={() => setSuccessModalVisible(false)}
        onOk={() => setSuccessModalVisible(false)}
      >
        <p>Se ha insertado el usuario.</p>
      </Modal>

      <Modal
        title="Error"
        visible={errorModalVisible}
        onCancel={() => setErrorModalVisible(false)}
        onOk={() => setErrorModalVisible(false)}
      >
        <p>{errorMessage}</p>
      </Modal>
    </ConfigProvider>
  );
};

export default ContraCrear;
