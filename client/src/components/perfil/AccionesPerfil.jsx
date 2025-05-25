import React, { useState } from "react";
import { Card, Flex, Button, ConfigProvider } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { useLayout } from "../../context/LayoutContext";
import personaApi from "../../api/Persona.api";
import usuarioApi from "../../api/User.api";

const { Meta } = Card;
function AccionesPerfil({
  changeUser,
  setIsEditable,
  isEditable,
  user,
  setUser,
  setChangeUser,
  crear = false,
  idUser = null,
  idPersona = null,
  forUserLog = true,
}) {
  const { openNotification } = useLayout();

  const [loading, setLoading] = useState(false);

  const telFormat = /\d{4}-\d{4}/;
  const dniFormat = /^\d{4}-\d{4}-\d{5}$/;

  const validarNicknameExists = async (nickname) => {
    const response = await usuarioApi.getUserByNicknameRequest(nickname);

    if (response) {
      if (response.status === 404) {
        return true;
      }
    }

    return false;
  };

  const validarCampos = async () => {
    if (crear) {
      for (let i = 0; i < user.length; i++) {
        if (user[i] === "") {
          return false;
        }
      }
      return true;
    } else {
      for (const [key, value] of Object.entries(changeUser)) {
        if (
          value === "" &&
          key !== "segundo_nombre" &&
          key !== "segundo_apellido" &&
          key !== "iglesia"

        ) {
          openNotification(2, "Campos Vacios", "No puede dejar campos vacios");
          return false;
        }

        if (key === "telefono" && value.match(telFormat) === null) {
          openNotification(
            2,
            "Telefono",
            "El formato del telefono no es valido"
          );
          return false;
        }

        if (key === "nickname" && value !== user.nickname) {
          if (!(await validarNicknameExists(value))) {
            openNotification(
              2,
              "Usuario Repetido",
              "El usuario debe ser unico"
            );
            return false;
          }
        }

        if (key === "dni" && value.match(dniFormat) === null) {
          openNotification(2, "DNI", "El formato del DNI no es valido");
          return false;
        }
      }

      return true;
    }
  };

  const handleEditar = () => {
    setIsEditable(true);
  };

  const formatearPersona = () => {
    const u = {
      ...changeUser,
      genero: changeUser.genero === "MASCULINO" || changeUser.genero === "FEMENINO" ? changeUser.genero : "MASCULINO",
    };

    return u;
  };

  const validarRespuesta = (response) => {
    if (!response) {
      openNotification(2, "Error", "No se pudo actualizar la informacion");
      return false;
    }

    if (response.status !== 200 && response.status !== 201) {
      openNotification(2, "Error", "No se pudo actualizar la informacion");
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    console.log("Guardando cambios");
    setLoading(true);
    if (await validarCampos()) {
      if (crear) {
        // Peticion para crear un nuevo usuario

        return;
      }
      // Peticion para cambiar la informacion del usuario

      const userFormated = {
        ...changeUser,
        rol: changeUser.rol,
      };
      console.log("User Formated", userFormated);

      const PersonaFormated = formatearPersona();
      console.log("Persona Formated", PersonaFormated);

      const response = await personaApi.putPersonaRequest(
        idPersona,
        PersonaFormated
      );

      if (validarRespuesta(response)) {
        const responseUser = await usuarioApi.putUserRequest(
          idUser,
          userFormated
        );

        if (validarRespuesta(responseUser)) {
          setUser(changeUser);
          openNotification(0, "usuario", "Cambios guardados");

          const responseUser = await usuarioApi.getUserRequest(idUser);

          // Actualiza el usuario en el localstorage
          if (responseUser.status === 201 && forUserLog) {
            localStorage.setItem("userData", JSON.stringify(responseUser.data));
          }

          setIsEditable(false);

          // Mostrar modal para cerrar sesión
          openNotification(0, "Alerta", "Vuelve a iniciar sesión para que los cambios sean reflejados.");
        }
      }
    }

    setLoading(false);
  };

  const handleCancelar = () => {
    setChangeUser(user);

    setIsEditable(false);
  };

  return (
    <Card style={{ marginTop: 16 }} className="shadow-#1">
      <Meta title="" />

      <Flex gap="large" justify="center" align="center">
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: "#36b1cc",
                colorPrimaryHover: "#027e99",
                colorPrimaryActive: "#9bd8e5",
                defaultHoverColor: "#fafafa",
              },
            },
          }}
        >
          <Button
            icon={<EditOutlined />}
            type="primary"
            size={"large"}
            style={{ display: isEditable ? "none" : "block" }}
            onClick={handleEditar}
          >
            Editar
          </Button>
        </ConfigProvider>

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
            icon={<SaveOutlined />}
            type="primary"
            size={"large"}
            style={{ display: isEditable ? "block" : "none" }}
            onClick={handleGuardar}
            loading={loading}
          >
            Guardar
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
            icon={<CloseCircleOutlined />}
            type="primary"
            size={"large"}
            style={{ display: isEditable ? "block" : "none" }}
            onClick={handleCancelar}
          >
            Cancelar
          </Button>
        </ConfigProvider>
      </Flex>
    </Card>
  );
}

export default AccionesPerfil;
