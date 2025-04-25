import React, { useEffect, useState } from "react";
import { Table, ConfigProvider } from "antd";
import ReservacionesApi from "../../api/Reservaciones.api";
import HuespedAPI from "../../api/Huesped.api";

import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const displayDateFormat = "DD-MM-YYYY";

const TablaReservacion = ({ idpersona = null }) => {
  const columns = [
    {
      title: "# de Visita",
      dataIndex: "id_reservacion",
      key: "id_reservacion",
    },
    {
      title: "Fecha de Entrada",
      dataIndex: "fecha_entrada",
      key: "fecha_entrada",
      render: (text) => dayjs(text).format(displayDateFormat),
    },
    {
      title: "Fecha de Salida",
      dataIndex: "fecha_salida",
      key: "fecha_entrada",
      render: (text) => dayjs(text).format(displayDateFormat),
    },
    {
      title: "Estado de Reservacion",
      dataIndex: "activa",
      key: "activa",
      render: (activa) => {
        return <p>{activa == 1 ? "Activo" : "Inactivo"}</p>;
      },
    },
  ];
  const [dataSource, setDataSource] = useState([]);

  const cargarHuespued = async (idpersona) => {
    try {
      const response = await HuespedAPI.getVisitasHuesped(idpersona);
      console.log("Aqui esta la persona:" + idpersona);
      if (!response) {
        throw new Error("No se pudo cargar la informacion del huesped");
      }

      if (response.status === 201) {
        const Huespede = response.data.map((e) => ({
          key: e.id_reservacion,
          id_reservacion: e.id_reservacion,
          fecha_entrada: e.fecha_entrada,
          fecha_salida: e.fecha_salida,
          activa: e.activa,
        }));
        console.log(Huespede);
        setDataSource(Huespede);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  /*
    const cargarReservaciones = async(id_huesped) => {
        try{
            const response = await ReservacionesApi.getReservacionRequest(id_huesped);
            console.log('Prueba' + id_huesped)
            if(!response){
                throw new Error('No se pudo cargar la informacion de las Reservacion de esa Persona')
            }
            if(response.status === 201){
                console.log('aqui inicia reservacion')
                const Reservaciones = Reservaciones.data.map((e)=> ({
                    
                    key : e.id_reservacion,
                    id_reservacion: e.id_reservacion,
                    fecha_entrada: e.fecha_entrada,
                    fecha_salida: e.fecha_salida,
                    activa: e.activa

                }))
                console.log('aqui termina reservacion')
                console.log(Reservaciones.id_reservacion);
                setDataSource(Reservaciones);
            }
        } catch(error){
            console.log(error);
        }
    }
    */

  useEffect(() => {
    if (idpersona) cargarHuespued(idpersona);
  }, [idpersona]);

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#77D9A1",
              cellFontSize: 17,
              headerColor: "#FFFFFF",
              colorText: "#3e3e3e",
            },
          },
        }}
      >
        <Table columns={columns} dataSource={dataSource}>
          pagination=
          {{
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "10", "15", "20"],
          }}
        </Table>
      </ConfigProvider>
    </div>
  );
};
export default TablaReservacion;
