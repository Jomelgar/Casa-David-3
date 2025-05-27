import React, { createContext, useContext, useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RiHome2Line,
  RiHomeHeartLine,
  RiCalendarScheduleLine,
  RiSettings3Line,
  RiFileChartLine,
  RiAccountCircleLine,
  RiUserForbidLine,
  RiLogoutBoxLine,
  RiHomeGearLine,
} from "react-icons/ri";
import { MdTableRows } from "react-icons/md";
import { notification } from "antd";
import { getUserFromToken } from "../utilities/auth.utils.js";

import ReservacionesApi from "../api/Reservaciones.api";

export const LayoutContext = createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useLayout must be used within a LayoutContextProvider");
  }

  return context;
};

export const LayoutContextProvider = ({ children }) => {
  // Estado que guarda la ruta de la pagina actual
  // Esto es lo que se muestra en el header de la pagina

  const [userLog, setUserLog] = useState(false);
  const navigate = useNavigate();

  const [currentPath, setCurrentPath] = useState("Inicio");
  const [idLugar, setIdLugar] = useState(null);

  const [reservacionesHoy, setReservacionesHoy] = useState([]);
  const [reservacionesManana, setReservacionesManana] = useState([]);

  const [reservacionesTresDias, setReservacionesTresDias] = useState([]);

  const [reservacionesAtrasadas, setReservacionesAtrasadas] = useState([]);

  const location = useLocation();
  useEffect(() => {
  const pathMap = {
    "/": "Inicio",
    "/hospedar": "Hospedar",
    "/tabla-de-solicitudes": "Lista de Solicitudes",
    "/huespedes": "Huespedes",
    "/mantenimiento/usuarios": "Mantenimiento / Usuarios",
    "/mantenimiento/habitaciones": "Mantenimiento / Habitaciones",
    "/mantenimiento/paises": "Mantenimiento / Países",
    "/reportes/pagos": "Reportes / Pagos",
    "/reportes/reporte-de-huespedes": "Reportes / Huéspedes Totales",
    "/reportes/personas": "Reportes / Personas",
    "/reportes/informes": "Reportes / Informes",
    "/reportes/pacientes": "Reportes / Pacientes",
    "/lista-negra": "Lista Negra",
    "/perfil": "Mi Perfil",
    "/auth/": "Cerrar Sesión",
  };
  setCurrentPath(pathMap[location.pathname]);
  }, [location.pathname]);

  const loadNotificaciones = async () => {
    try {
      const response = await ReservacionesApi.getReservacionesActivas();

      if (response.status === 403) navigate("/auth/login");

      const reservaciones = response.data;

      const hoy = new Date().getDate() - 1;
      const manana = new Date().getDate();
      const semana = new Date().getDate() + 7;

      const hoyArray = [];
      const mananaArray = [];
      const semanaArray = [];
      const atrasados = [];

      reservaciones.forEach((reservacion) => {
        const fechaSalida = new Date(reservacion.fecha_salida).getDate();

        if (fechaSalida) {
          if (fechaSalida < new Date().getDate() - 1) {
            atrasados.push({
              ...reservacion,
            });
          } else if (fechaSalida === hoy)
            hoyArray.push({
              ...reservacion,
            });
          else if (fechaSalida === manana)
            mananaArray.push({
              ...reservacion,
            });
          else if (fechaSalida <= semana)
            semanaArray.push({
              ...reservacion,
            });
        }
      });

      setReservacionesHoy(hoyArray);
      setReservacionesManana(mananaArray);
      setReservacionesTresDias(
        semanaArray.sort(
          (a, b) => new Date(a.fecha_salida) - new Date(b.fecha_salida)
        )
      );
      setReservacionesAtrasadas(atrasados);
    } catch (error) {
      console.log(error);
      if (error.response.status === 403) navigate("/auth/login");

    }
  };
  // Componente para mostrar una notificacion
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (tipo, title, message) => {
    if (tipo === 0) {
      api.success({
        message: title,
        description: message,
        placement: "topRight",
      });
    } else if (tipo === 1) {
      api.info({
        message: title,
        description: message,
        placement: "topRight",
        duration: 3,
      });
    } else if (tipo === 2) {
      api.warning({
        message: title,
        description: message,
        placement: "topRight",
        duration: 3,
      });
    } else if (tipo === 3) {
      api.error({
        message: title,
        description: message,
        placement: "topRight",
        duration: 3,
      });
    }
  };

  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  let isXS = useMediaQuery({ query: "(max-width: 480px)" });
  const [collapsed, setCollapsed] = useState(isTabletMid ? true : false);
  const [isBroken, setIsBroken] = useState(false);
  const [visibleDrawerSideMenu, setVisibleDrawerSideMenu] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [marginContent, setMarginContent] = useState(() => {
    if (!isBroken) {
      if (collapsed) return 90;
      else return 230;
    }
    return 0;
  });

  const [stateOpenKeys, setStateOpenKeys] = useState(["2", "23"]);

  useEffect(() => {
    const userData = getUserFromToken();
    if (userData) {
      setUserRole(userData.role);

      setUserLog(userData);
    }
  }, []);

  const masterItems = [
    { type: "divider" },
    { key: "/", icon: <RiHome2Line />, label: "Inicio" },
    { key: "/hospedar", icon: <RiHomeHeartLine />, label: "Hospedar" },
    {
      key: "/tabla-de-solicitudes",
      icon: <MdTableRows />,
      label: "Lista de Solicitudes",
    },
    {
      key: "/huespedes",
      icon: <RiHomeGearLine />,
      label: "Huespedes",
    },
    {
      key: "6",
      icon: <RiSettings3Line />,
      label: "Mantenimiento",
      children: [
        { key: "/mantenimiento/usuarios", label: "Usuarios" },
        { key: "/mantenimiento/habitaciones", label: "Habitaciones" },
        { key: "/mantenimiento/paises", label: "Países" }//Deberia estar en master
      ],
    },
    {
      key: "/reportes",
      icon: <RiFileChartLine />,
      label: "Reportes",
      children: [
        { key: "/reportes/pagos", label: "Pagos" },
        { key: "/reportes/reporte-de-huespedes", label: "Huesped Totales" },
        { key: "/reportes/personas", label: "Personas" },
        { key: "/reportes/informes", label: "Informes" },
        { key: "/reportes/pacientes", label: "Pacientes" }
      ],
    },
    {
      key: "/lista-negra",
      label: "Lista Negra",
      icon: <RiUserForbidLine />,
    },

    {
      key: "group-personal",
      label: "Personal",
      type: "group",
      children: [
        { key: "/perfil", icon: <RiAccountCircleLine />, label: "Mi Perfil" },
        { key: "/auth/", icon: <RiLogoutBoxLine />, label: "Cerrar Sesion" },
      ],
    },
  ];

  const adminItems = [
    { type: "divider" },
    { key: "/", icon: <RiHome2Line />, label: "Inicio" },
    { key: "/hospedar", icon: <RiHomeHeartLine />, label: "Hospedar" },
    {
      key: "/tabla-de-solicitudes",
      icon: <MdTableRows />,
      label: "Lista de Solicitudes",
    },
    {
      key: "/huespedes",
      icon: <RiHomeGearLine />,
      label: "Huespedes",
    },
    {
      key: "6",
      icon: <RiSettings3Line />,
      label: "Mantenimiento",
      children: [
        { key: "/mantenimiento/usuarios", label: "Usuarios" },
        { key: "/mantenimiento/habitaciones", label: "Habitaciones" }
      ],
    },
    {
      key: "/reportes",
      icon: <RiFileChartLine />,
      label: "Reportes",
      children: [
        { key: "/reportes/pagos", label: "Pagos" },
        { key: "/reportes/reporte-de-huespedes", label: "Huesped Totales" },
        { key: "/reportes/personas", label: "Personas" },
        { key: "/reportes/informes", label: "Informes" },
        { key: "/reportes/pacientes", label: "Pacientes" }
      ],
    },
    {
      key: "/lista-negra",
      label: "Lista Negra",
      icon: <RiUserForbidLine />,
    },

    {
      key: "group-personal",
      label: "Personal",
      type: "group",
      children: [
        { key: "/perfil", icon: <RiAccountCircleLine />, label: "Mi Perfil" },
        { key: "/auth/", icon: <RiLogoutBoxLine />, label: "Cerrar Sesion" },
      ],
    },
  ];

  const loadItems = () => {
    const userData = getUserFromToken();
    if (userData) {
      if (userData.role === "master") {
        return masterItems; 
      }
      else if (userData.role === "admin") {
        return adminItems;
      } else {
        let items = [adminItems[0], adminItems[1], adminItems[2]];

        if (userData.privilegios.includes(9)) {
          items.push(adminItems[3]);
        }

        if (userData.privilegios.includes(3)) {
          items.push(adminItems[4]);
        }

        if (
          userData.privilegios.includes(4) &&
          userData.privilegios.includes(2)
        ) {
          items.push(adminItems[5]);
        } else if (
          userData.privilegios.includes(4) ||
          userData.privilegios.includes(2)
        ) {
          items.push({
            key: "6",
            icon: <RiSettings3Line />,
            label: "Mantenimiento",
            children: userData.privilegios.includes(4)
              ? [{ key: "/mantenimiento/usuarios", label: "Usuarios" }]
              : [{ key: "/mantenimiento/habitaciones", label: "Habitaciones" }],
          });
        }

        if (
          userData.privilegios.includes(5) ||
          userData.privilegios.includes(10)
        ) {
          items.push({
            key: "/reportes",
            icon: <RiFileChartLine />,
            label: "Reportes",
            children: userData.privilegios.includes(5)
              ? [{ key: "/historiales/personas", label: "Personas" }]
              : [
                { key: "/reportes/pagos", label: "Pagos" },
                {
                  key: "/reportes/reporte-de-huespedes",
                  label: "Huesped Totales",
                },
              ],
          });
        }

        if (userData.privilegios.includes(6)) {
          items.push(adminItems[7]);
        }

        items.push(adminItems[8]);

        return items;
      }
    }
  };

  const items = loadItems();

  const getLevelKeys = (items) => {
    const key = {};
    const func = (items, level = 1) => {
      items.forEach((item) => {
        if (item.key) key[item.key] = level;
        if (item.children) func(item.children, level + 1);
      });
    };
    func(items);
    return key;
  };

  const levelKeys = getLevelKeys(items);

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  return (
    <LayoutContext.Provider
      value={{
        reservacionesHoy,
        reservacionesAtrasadas,
        reservacionesManana,
        reservacionesTresDias,
        loadNotificaciones,
        idLugar,
        setIdLugar,
        isTabletMid,
        isXS,
        collapsed,
        setCollapsed,
        isBroken,
        setIsBroken,
        userLog,
        visibleDrawerSideMenu,
        setVisibleDrawerSideMenu,
        onOpenChange,
        stateOpenKeys,
        items,
        marginContent,
        setMarginContent,

        contextHolder,
        openNotification,

        currentPath,
        setCurrentPath,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
