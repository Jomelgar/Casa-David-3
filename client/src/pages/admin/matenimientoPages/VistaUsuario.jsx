import { Tabs, ConfigProvider, Flex, Input, Card } from "antd";
import { UserOutlined, SettingOutlined, LockOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import InformacionPersonal from "../../../components/perfil/InformacionPersonal";
import RolUsuario from "../../../components/perfil/RolUsuario";
import { useLayout } from "../../../context/LayoutContext";
import AccionesPerfil from "../../../components/perfil/AccionesPerfil";
import PrivilegiosPersonal from "../../../components/perfil/PrivilegiosPersonal";
import ContraPersonal from "../../../components/perfil/ContraPersonal";
import { useParams, userParams } from "react-router-dom";
import { getUserFromToken } from "../../../utilities/auth.utils";

import personaApi from "../../../api/Persona.api";
import userApi from "../../../api/User.api";

function VistaUsuario() {
  const { setCurrentPath, isXS } = useLayout();

  const [tab, setTab] = useState(0);

  const [isEditable, setIsEditable] = useState(false);

  const params = useParams();
  const [userProp, setUserProp] = useState({});
  /*
    para manejar la info del usuario los componentes requieren de un objeto
    con los siguiente atributos

    OJO no todos los componentes utilizan todos estos atributos

    const user = 
    {
          dni: value,
          id_ocupacion : value,
          direccion : value,
          fecha_nacimiento : value,
          genero : value (este se debe formatear para que sea un numero que represente el valor en el select),
          primer_nombre : value,
          segundo_nombre,
          segundo_apellido,
          primer_apellido,
          telefono,
          nickname,
          rol, (este se debe formatear para que sea un numero que represente el valor en el select),
          municipio_id
    }

  */

  const [user, setUser] = useState({});

  const [changeUser, setChangeUser] = useState({});

  const [userId, setUserId] = useState(null);
  const [personaId, setPersonaId] = useState(null);

  let userInformacionPersonal;

  const cargarInformacion = async (userProp) => {
    try {
      const response = await personaApi.getPersonaRequest(userProp.id_persona);

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar la informacion del usuario");
      }

      if (response.status >= 200 && response.status < 300) {
        userInformacionPersonal = response.data;

        const { nickname, rol, id_hospital, id_usuario } = userProp;

        const {
          dni,
          id_ocupacion,
          direccion,
          fecha_nacimiento,
          genero,
          municipio_id,
          primer_nombre,
          segundo_nombre,
          segundo_apellido,
          primer_apellido,
          telefono,
          iglesia
        } = userInformacionPersonal;

        const user = {
          dni,
          id_ocupacion,
          municipio_id,
          id_hospital,
          direccion,
          fecha_nacimiento,
          genero: genero === "FEMENINO" ? "FEMENINO" : "MASCULINO",
          primer_apellido,
          segundo_apellido,
          primer_nombre,
          segundo_nombre,
          id_usuario,
          telefono,
          rol: rol === "admin" ? "admin" : "usuario",
          nickname,
          iglesia
        };
        console.log("Usuario pasandose a informacion personal: ", user);
        setUser(user);
        setChangeUser(user);

        setUserId(userProp.id_usuario);
        setPersonaId(userProp.id_persona);
      }
    } catch (error) {
      //Mostrar una notificacion de error

      console.log(error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      if (params.id) {
        setCurrentPath("/Mantenimiento/Usuario/" + params.id);
        // Obtiene el usuario por id
        const response = await userApi.getUserByNicknameRequest(params.id);

        if (!response) {
          // deberia lanzar un error
          throw new Error("No se pudo cargar la informacion del usuario");
        }

        const userProp = response.data;

        setUserProp(userProp);
        cargarInformacion(userProp);
      } else {
        // Obtiene el usuario logeado
        setCurrentPath("/Mi Perfil");
        const userProp = getUserFromToken();
        setUserProp(userProp);
        cargarInformacion(userProp);
      }
    };

    loadUser();
  }, []);

  const handleSetChangeUser = (e, value, anterior = null) => {
    switch (e) {
      case "dni":
        if (
          value.length > anterior.length &&
          (value.match(/^\d{4}$/) !== null ||
            value.match(/^\d{4}-\d{4}$/) !== null)
        )
          value = value + "-";
        setChangeUser({ ...changeUser, ...{ dni: value } });
        break;
      case "id_hospital":
        setChangeUser({ ...changeUser, ...{ id_hospital: value } });
        break;

      case "direccion":
        setChangeUser({ ...changeUser, ...{ direccion: value } });
        break;

      case "id_ocupacion":
        setChangeUser({ ...changeUser, ...{ id_ocupacion: value } });
        break;

      case "primer_nombre":
        setChangeUser({ ...changeUser, ...{ primer_nombre: value } });
        break;

      case "segundo_nombre":
        setChangeUser({ ...changeUser, ...{ segundo_nombre: value } });
        break;

      case "primer_apellido":
        setChangeUser({ ...changeUser, ...{ primer_apellido: value } });
        break;

      case "genero":
        setChangeUser({ ...changeUser, ...{ genero: value } });
        break;
      case "rol":
        setChangeUser((prevState) => ({
          ...prevState,
          rol: value,
        }));
        break;


      case "segundo_apellido":
        setChangeUser({ ...changeUser, ...{ segundo_apellido: value } });
        break;

      case "telefono":
        console.log(anterior);
        if (
          value.length > anterior.length &&
          value.length === 4 &&
          value.match(/\d{4}/) !== null
        )
          value = value + "-";
        console.log(value);

        setChangeUser({ ...changeUser, ...{ telefono: value } });
        break;

      case "nickname":
        setChangeUser({ ...changeUser, ...{ nickname: value } });
        break;
      case "fecha_nacimiento":
        setChangeUser({ ...changeUser, ...{ fecha_nacimiento: value } });
        break;
      case "iglesia":
        setChangeUser({ ...changeUser, ...{ iglesia: value } });
        break;

      case "municipio_id":
        setChangeUser({ ...changeUser, ...{ municipio_id: value } });
        break;

      default:
        break;
    }
  };

  const items = [
    {
      key: 0,
      label: "Cuenta",
      icon: <UserOutlined style={{ fontSize: isXS ? 16 : 24 }} />,
    },
    {
      key: 1,
      label: "Privilegios",
      icon: <SettingOutlined style={{ fontSize: isXS ? 16 : 24 }} />,
    },

    {
      key: 2,
      label: "Contraseña",
      icon: <LockOutlined style={{ fontSize: isXS ? 16 : 24 }} />,
    },
  ];

  const content = [
    <div>
      <RolUsuario
        handleSetChangeUser={handleSetChangeUser}
        isEditable={isEditable}
        user={user}
        changeUser={changeUser}
      />
      {Object.keys(user).length > 0 && (
        <InformacionPersonal
          user={user}
          changeUser={changeUser}
          isEditable={isEditable}
          handleSetChangeUser={handleSetChangeUser}
        />
      )}
      <AccionesPerfil
        changeUser={changeUser}
        setIsEditable={setIsEditable}
        isEditable={isEditable}
        user={user}
        setUser={setUser}
        setChangeUser={setChangeUser}
        idUser={userId}
        idPersona={personaId}
        forUserLog={false}
      />
    </div>,
    <div>
      <PrivilegiosPersonal user={user} />
    </div>,
    <div>
      <ContraPersonal id_user={userId} />
    </div>,
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: { inkBarColor: "#77d9a1" },
        },
      }}
    >
      <Flex vertical>
        <Tabs
          accessKey={tab}
          onChange={(key) => {
            setTab(key);
          }}
          items={items}
          size={isXS ? "small" : "large"}
          style={{ width: "100%" }}
        />

        {content[tab]}
      </Flex>
    </ConfigProvider>
  );
}

export default VistaUsuario;
