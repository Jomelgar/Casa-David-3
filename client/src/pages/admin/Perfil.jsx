import { Tabs, ConfigProvider, Flex, Input, Card } from "antd";
import { UserOutlined, SettingOutlined, LockOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import InformacionPersonal from "../../components/perfil/InformacionPersonal";
import RolUsuario from "../../components/perfil/RolUsuario";
import { useLayout } from "../../context/LayoutContext";
import AccionesPerfil from "../../components/perfil/AccionesPerfil";
import PrivilegiosPersonal from "../../components/perfil/PrivilegiosPersonal";
import ContraPersonal from "../../components/perfil/ContraPersonal";
import { useParams, userParams } from "react-router-dom";

import personaApi from "../../api/Persona.api";
import userApi from "../../api/User.api";
import { getUserFromToken } from "../../utilities/auth.utils";
import { getMunicipioById } from "../../api/municipioApi";

function Perfil() {
  const { setCurrentPath, isXS, openNotification} = useLayout();

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
          id_procedencia : value (este se debe formatear para que sea un numero que represente el valor en el select),
          primer_nombre : value,
          segundo_nombre,
          segundo_apellido,
          primer_apellido,
          telefono,
          nickname,
          rol, (este se debe formatear para que sea un numero que represente el valor en el select)
      
    }

  */

  const [user, setUser] = useState({});

  const [changeUser, setChangeUser] = useState({});

  const [userId, setUserId] = useState(null);
  const [personaId, setPersonaId] = useState(null);

  const usuario = getUserFromToken();

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
        const { username, role, id_hospital } = userProp;
        const id_usuario = userProp.userId;

        const {
          id_persona,
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
          id_lugar,
          iglesia,
          referencia_telefonica
        } = userInformacionPersonal;

        const user = {
          id_persona,
          dni,
          id_ocupacion,
          id_hospital,
          direccion,
          fecha_nacimiento,
          genero: genero === "FEMENINO" ? "FEMENINO" : "MASCULINO",
          municipio_id,
          primer_apellido,
          segundo_apellido,
          primer_nombre,
          segundo_nombre,
          id_usuario: id_usuario,
          telefono,
          rol: role,
          nickname: username,
          id_lugar: id_lugar,
          iglesia: iglesia,
          id_usuario: id_usuario,
          referencia_telefonica
        };

        if (user) {
          setUser(user);
          console.log("AAAAAAAAAA USER SETEADO ES: ", user);
          setChangeUser(user);
        }

        setUserId(userProp.userId);
        setPersonaId(userProp.id_persona);
      }
    } catch (error) {
      //Mostrar una notificacion de error

      console.log(error);
    }
  };

  // Funcion usada para obtener el municipio y el departamento de la persona al ingresar el DNI (si ya existe la persona)
  const fetchMunicipioById = async (municipioId) => {
    try {
      const municipio = await getMunicipioById(municipioId);
      return municipio;
    } catch (error) {
      console.error("Error fetching municipio by ID:", error);
      return null;
    }
  };

  const existDNI = async (dni) => {
    try {
      const response = await personaApi.getPersonaByDniRequest(dni);

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar la informacion del usuario");
      }

      if (response.status >= 200 && response.status < 300) {
        openNotification(2, "Error", "Ya existe un usuario con ese DNI");
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      if (params.id) {
        setCurrentPath("Mantenimiento/Usuario/" + params.id);
        // Obtiene el usuario por id
        const response = await userApi.getUserByNicknameRequest(params.id);

        if (!response) {
          // deberia lanzar un error
          throw new Error("No se pudo cargar la informacion del usuario");
        }

        console.log(response);

        const userProp = response.data;

        setUserProp(userProp);
        cargarInformacion(userProp);

        setUserId(userProp.id_usuario);
        setPersonaId(userProp.id_persona);
      } else {
        // Obtiene el usuario logeado
        const userProp = usuario;
        setUserProp(userProp);
        cargarInformacion(userProp);

        setUserId(userProp.userId);
        setPersonaId(userProp.id_persona);
      }
    };

    loadUser();
  }, []);

 const [hoveredUser, setHoveredUser] = useState(false);
 const [hoveredPriv, setHoveredPriv] = useState(false);
 const [hoveredPassW, setHoveredPassW] = useState(false);
 const handleSetChangeUser = (e, value, anterior = null) => {
    switch (e) {
      case "id_lugar":
        setChangeUser({...changeUser,...{id_lugar: value}});
        break;
      case "dni":
        setChangeUser({...changeUser,...{dni:value}});
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
      case "referencia_telefonica":
        setChangeUser({...changeUser,...{referencia_telefonica: value}});
        break;
      default:
        break;
    }
    console.log(changeUser);
  };

  const items = [
    {
      key: 0,
      label:  <span
              style={{ color: hoveredUser ? "#77d9a1" : "#555", cursor: "pointer" }}
              onMouseEnter={() => setHoveredUser(true)}
              onMouseLeave={() => setHoveredUser(false)}
            >
              Cuenta
            </span>,
      icon: <UserOutlined style={{ fontSize: isXS ? 16 : 24, color: hoveredUser ? "#77d9a1" : "#555"}} />,
    },
    {
      key: 1,
      label: <span
                style={{ color: hoveredPriv ? "#77d9a1" : "#555", cursor: "pointer" }}
                onMouseEnter={() => setHoveredPriv(true)}
                onMouseLeave={() => setHoveredPriv(false)}
              >
                Privilegios
              </span>, 
      icon: <SettingOutlined style={{ fontSize: isXS ? 16 : 24, color: hoveredPriv ? "#77d9a1" : "#555" }} />,
    },
    {
      key: 2,
      label: <span
                style={{ color: hoveredPassW ? "#77d9a1" : "#555", cursor: "pointer" }}
                onMouseEnter={() => setHoveredPassW(true)}
                onMouseLeave={() => setHoveredPassW(false)}
              >
                  Contraseñas
              </span>,
      icon: <LockOutlined style={{ fontSize: isXS ? 16 : 24, color: hoveredPassW ? "#77d9a1" : "#555" }} />,
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

export default Perfil;
