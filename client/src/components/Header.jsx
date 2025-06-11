import {
  Avatar,
  Badge,
  Button,
  ConfigProvider,
  Drawer,
  Flex,
  Typography,
  Card,
} from "antd";
import {
  NotificationOutlined,
  UserAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { useLayout } from "../context/LayoutContext";
import "../App.css";
import { Link } from "react-router-dom";
import { getUserFromToken } from "../utilities/auth.utils";
import LugarApi from "../api/Lugar.api";
import PaisApi from "../api/Pais.api";
const { Meta } = Card;

const CustomHeader = () => {
  const usuario = getUserFromToken();
  const [pais,setPais] = useState({
          nombre_lugar: "",
          nombre_pais: ""
        });
  const [notificationOpen, setNotificationOpen] = useState(false);

  const {
    reservacionesAtrasadas,
    reservacionesHoy,
    reservacionesManana,
    reservacionesTresDias,
    loadNotificaciones,
    collapsed,
    setCollapsed,
    isBroken,
    setIsBroken,
    setVisibleDrawerSideMenu,
    visibleDrawerSideMenu,
    setMarginContent,
    currentPath
  } = useLayout();

  const fetchPais= async() =>
    {
        const pai = await PaisApi.getPais(usuario.id_pais);
        const lugares = await LugarApi.getLugarByPais(usuario.id_pais);
        const lugar = lugares.data.find((l)=> l.id_lugar === usuario.id_lugar);
        console.log("Lugar:", lugar)
        setPais( 
        {
          nombre_lugar: lugar.codigo,
          nombre_pais: pai.data.nombre 
        });
        console.log("Pais",pais.current);  
    }

  useEffect(()=>
    {
      fetchPais();
    },[])
  useEffect(() => {
    loadNotificaciones();
  }, []);

  const renderReservacionesAtrasados = (reservaciones, title) => {
    //console.log(reservaciones);
    return reservaciones.map((reservacion) => (
      <Link
        to={`/huesped/${reservacion.id_reservacion}`}
        key={reservacion.id}
        onClick={() => {
          setNotificationOpen(false);
        }}
      >
        <Card
          className="bg-red-200"
          key={"card" + reservacion.id}
          style={{ marginBottom: 15 }}
        >
          <Meta
            title={
              reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
              " " +
              reservacion.PacienteHuesped.Huesped.Persona.primer_apellido
            }
            description={`
           - Teléfono: ${
             reservacion.PacienteHuesped.Huesped.Persona.telefono || "undefined"
           } \n- Fecha de salida: ${reservacion.fecha_salida}`}
          />
        </Card>
      </Link>
    ));
  };

  const renderReservacionesHoy = (reservaciones, title) => {
    return reservaciones.map((reservacion) => (
      <Link
        to={`/huesped/${reservacion.id_reservacion}`}
        key={reservacion.id_reservacion}
        onClick={() => {
          setNotificationOpen(false);
        }}
      >
        <Card
          className="bg-orange-200"
          key={"card" + reservacion.id_reservacion}
          style={{ marginBottom: 15 }}
        >
          <Meta
            title={
              reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
              " " +
              reservacion.PacienteHuesped.Huesped.Persona.primer_apellido
            }
            description={`
           - Teléfono: ${
             reservacion.PacienteHuesped.Huesped.Persona.telefono || "undefined"
           } \n- Fecha de salida: ${reservacion.fecha_salida}`}
          />
        </Card>
      </Link>
    ));
  };

  const renderReservacionesManana = (reservaciones, title) => {
    return reservaciones.map((reservacion) => (
      <Link
        to={`/huesped/${reservacion.id_reservacion}`}
        key={reservacion.id_reservacion}
        onClick={() => {
          setNotificationOpen(false);
        }}
      >
        <Card
          className="bg-yellow-200"
          key={"card" + reservacion.id_reservacion}
          style={{ marginBottom: 15 }}
        >
          <Meta
            title={
              reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
              " " +
              reservacion.PacienteHuesped.Huesped.Persona.primer_apellido
            }
            description={`
           - Teléfono: ${
             reservacion.PacienteHuesped.Huesped.Persona.telefono || "undefined"
           } \n- Fecha de salida: ${reservacion.fecha_salida}`}
          />
        </Card>
      </Link>
    ));
  };

  const renderReservaciones = (reservaciones, title) => {
    return reservaciones.map((reservacion) => (
      <Link
        to={`/huesped/${reservacion.id_reservacion}`}
        key={reservacion.id_reservacion}
        onClick={() => {
          setNotificationOpen(false);
        }}
      >
        <Card
          className="bg-green-200"
          key={"card" + reservacion.id_reservacion}
          style={{ marginBottom: 15 }}
        >
          <Meta
            title={
              reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
              " " +
              reservacion.PacienteHuesped.Huesped.Persona.primer_apellido
            }
            description={`
           - Teléfono: ${
             reservacion.PacienteHuesped.Huesped.Persona.telefono || "undefined"
           } \n- Fecha de salida: ${reservacion.fecha_salida}`}
          />
        </Card>
      </Link>
    ));
  };

  return (
    <Flex align="center" justify="space-between">
      <Flex align="center" gap="middle">
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: "#77d9a1",
                colorPrimaryHover: "#5eaf81",
                colorPrimaryActive: "#92e1b4",
                defaultHoverColor: "#fafafa",
              },
            },
          }}
        >
          <Button
            className="bg-green-500 hover:bg-green-600"
            type="primary"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined className="text-green-100" />
              ) : (
                <MenuFoldOutlined className="text-green-100" />
              )
            }
            onClick={() => {
              setIsBroken(!isBroken);
              if (isBroken) {
                setVisibleDrawerSideMenu(visibleDrawerSideMenu);
                setMarginContent(0);
              } else {
                setCollapsed(!collapsed);
                if (collapsed) setMarginContent(230);
                else setMarginContent(90);
              }
            }}
          />
        </ConfigProvider>
        <div className="m-0 text-xl text-white-700">
          <span>{currentPath}</span>
        </div>
      </Flex>
      <Flex className="items-center justify-center text-white-700 text-xl font-semibold">
        {pais.nombre_pais} - {pais.nombre_lugar}
      </Flex>
      <Flex align="center" gap="20px">
        <Badge
          count={
            reservacionesHoy.length +
            reservacionesManana.length +
            reservacionesTresDias.length +
            reservacionesAtrasadas.length
          }
        >
          <NotificationOutlined
            onClick={() => setNotificationOpen(true)}
            className="bg-green-500 p-2 rounded text-xl text-white-100 cursor-pointer"
          />
        </Badge>
        <Drawer
          title="Notificaciones"
          open={notificationOpen}
          onClose={() => setNotificationOpen(false)}
        >
          <Typography.Title level={4}>Reservaciones Atrasadas</Typography.Title>
          {renderReservacionesAtrasados(
            reservacionesAtrasadas,
            "Reservaciones Atrasadas"
          )}

          <Typography.Title style={{ marginTop: 50 }} level={4}>
            Reservaciones para hoy
          </Typography.Title>
          {renderReservacionesHoy(reservacionesHoy, "Reservaciones para hoy")}

          <Typography.Title style={{ marginTop: 50 }} level={4}>
            Reservaciones durante el resto de la semana
          </Typography.Title>
          {renderReservacionesManana(
            reservacionesManana,
            "Reservaciones para mañana"
          )}
          {renderReservaciones(reservacionesTresDias, "")}
        </Drawer>
      </Flex>
    </Flex>
  );
};

export default CustomHeader;
