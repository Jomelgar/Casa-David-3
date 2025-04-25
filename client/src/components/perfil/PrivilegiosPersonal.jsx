import React, { useState, useEffect } from "react";
import { Card, Flex, Checkbox, Input, ConfigProvider } from "antd";
import PrivilegiosApi from "../../api/Privilegios.api";
import { useLayout } from "../../context/LayoutContext";
import { getUserFromToken } from "../../utilities/auth.utils";

const { TextArea } = Input;

function PrivilegiosPersonal({ user }) {
  // Enbase al user vamos a obtener el arreglo
  // de privilegios

  const usuario = getUserFromToken();

  const rolLog = usuario.role;

  const isDisable = rolLog === "admin" ? false : true;

  const [isCheckAll, setIsCheckAll] = useState(false);

  const { openNotification } = useLayout();

  let iniciales = [
    {
      id_privilegio: 2,
      id_usuario_privilegio: null,
      text: "Administrar Dormitorios",
    },
    {
      id_privilegio: 3,
      id_usuario_privilegio: null,
      text: "Administrar Huespedes",
    },
    {
      id_privilegio: 4,
      id_usuario_privilegio: null,
      text: "Administrar Usuarios",
    },
    {
      id_privilegio: 5,
      id_usuario_privilegio: null,
      text: "Administrar Personas",
    },
    {
      id_privilegio: 6,
      id_usuario_privilegio: null,
      text: "Administrar Lista Negra",
    },

    { id_privilegio: 8, id_usuario_privilegio: null, text: "Hospedar" },
    {
      id_privilegio: 9,
      id_usuario_privilegio: null,
      text: "Administrar Solicitudes de Hospedaje",
    },
    {
      id_privilegio: 10,
      id_usuario_privilegio: null,
      text: "Administrar Reportes",
    },
  ];

  const [privilegios, setPrivilegios] = useState(iniciales);

  const handleCheckAll = (p) => {
    for (let i = 0; i < p.length; i++) {
      if (!p[i].id_usuario_privilegio) {
        setIsCheckAll(false);
        return;
      }

      if (i === p.length - 1) setIsCheckAll(true);
    }
  };

  const loadPrivilegios = async () => {
    try {
      const response = await PrivilegiosApi.getPrivilegiosByUser(
        user.id_usuario
      );

      if (!response)
        return openNotification("error", "Error al cargar privilegios");

      let clone = [...iniciales];

      response.data.forEach((p) => {
        clone = clone.map((privilegio) =>
          privilegio.id_privilegio === p.id_privilegio
            ? { ...privilegio, id_usuario_privilegio: p.id_usuario_privilegio }
            : privilegio
        );
      });

      setPrivilegios(clone);

      handleCheckAll(clone);
    } catch (error) {
      openNotification("error", "Error al cargar privilegios");
    }

    // Valida si todos estan checkeados
  };

  const handleChange = async (privilegio, showNotification = true) => {
    try {
      if (privilegio.id_usuario_privilegio) {
        const response = await PrivilegiosApi.deletePrivilegio(
          privilegio.id_usuario_privilegio
        );

        if (response === null) {
          openNotification(4, "Error", "Error al eliminar privilegio");
          return;
        }

        if (showNotification)
          openNotification(
            0,
            "Privelegio",
            "Privilegio eliminado correctamente"
          );

        // Ahora falta actualizar el estado

        loadPrivilegios();
      } else {
        const response = await PrivilegiosApi.postPrivilegio(
          user.id_usuario,
          privilegio.id_privilegio
        );

        if (response === null || response.status !== 201) {
          openNotification(4, "Error", "Error al agregar privilegio");
          return;
        }

        if (showNotification)
          openNotification(
            0,
            "Privelegio",
            "Privilegio agregado correctamente"
          );

        // Ahora falta actualizar el estado

        loadPrivilegios();
      }
    } catch (error) {
      openNotification(4, "Error", "Error al eliminar privilegio");
    }
    // Aqui hiria la peticion
  };

  const itemPrivilegio = (privilegio, text, key) => {
    return (
      <Flex
        justify="flex-start"
        align="center"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f7f7f7",
          padding: 5,
          borderRadius: 8,
        }}
        key={key}
      >
        <ConfigProvider theme={{ token: { colorPrimary: "#36b1cc" } }}>
          <Checkbox
            style={{
              backgroundColor: "#f7f7f7",
              padding: 10,
              height: "100%",
            }}
            disabled={user.rol === 1 ? true : isDisable}
            checked={
              user.rol === 1
                ? true
                : privilegio.id_usuario_privilegio
                ? true
                : false
            }
            onChange={async (e) => {
              await handleChange(privilegio);
            }}
          />
        </ConfigProvider>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainerDisabled: "#f7f7f7",
              colorBorder: "#f7f7f7",
              colorTextDisabled: "#626262",
              fontSize: 18,
            },
          }}
        >
          <TextArea
            value={text}
            autoSize
            disabled
            className="hover:cursor-default xs:hover:cursos-default"
          />
        </ConfigProvider>
      </Flex>
    );
  };

  const handleCheckAlls = async () => {
    if (isCheckAll) return;

    privilegios.forEach(async (privilegio) => {
      if (!privilegio.id_usuario_privilegio)
        await handleChange(privilegio, false);
    });

    openNotification(0, "Privilegios", "Todos los privilegios asignados");
  };

  const handleDesCheckAlls = async () => {
    if (!isCheckAll) return;

    privilegios.forEach(async (privilegio) => {
      if (privilegio.id_usuario_privilegio)
        await handleChange(privilegio, false);
    });

    openNotification(0, "Privilegios", "Todos los privilegios eliminados");
  };

  const loadLabel = () => {
    if (user.rol === 1) {
      return (
        <Flex justify="center" align="center">
          <h2 className="text-lg p-6 bg-gray-100 mb-5 rounded-md text-white-800">
            Como Administrador ustede tiene
            <spa className="text-green-500 font-bold"> TODOS</spa> los
            privilegios
          </h2>
        </Flex>
      );
    } else {
      return (
        <Flex justify="center" align="center">
          <h2 className="text-lg p-6 bg-gray-100 mb-5 rounded-md text-white-800">
            Si requiere de mas privilegios, comuniquese con un
            <spa className="text-green-500 font-bold"> administrador</spa>
          </h2>
        </Flex>
      );
    }
  };

  useEffect(() => {
    if (user.rol !== 1) loadPrivilegios();
  }, [user]);

  return (
    <Card
      style={{ marginTop: 16, paddingLeft: 20, paddingRight: 20 }}
      className="shadow-#1"
    >
      {loadLabel()}
      <Flex>
        <ConfigProvider theme={{ token: { colorPrimary: "#36b1cc" } }}>
          <Checkbox
            style={{
              backgroundColor: "#77d9a1",
              padding: 10,
              height: "100%",
              color: "#fdfdfd",
              marginBottom: 20,
              borderRadius: 15,
            }}
            disabled={user.rol === 1 ? true : isDisable}
            checked={user.rol === 1 ? true : isCheckAll}
            onChange={(e) => {
              if (isCheckAll) handleDesCheckAlls();
              else handleCheckAlls();
            }}
          >
            Seleccionar Todos
          </Checkbox>
        </ConfigProvider>
      </Flex>

      <Flex vertical gap="middle" justify="center" align="center">
        {privilegios.map((privilegio, i) => {
          return itemPrivilegio(privilegio, privilegio.text, i);
        })}
      </Flex>
    </Card>
  );
}

export default PrivilegiosPersonal;
