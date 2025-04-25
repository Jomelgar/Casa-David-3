import React from "react";
import { Card, ConfigProvider, Table, Button } from "antd";
import { HeartOutlined, DownloadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { URL_HOSTING } from "../../config";
import OfrendaApi from "../../api/Ofrenda.api"
import { useLayout } from "../../context/LayoutContext"

function OfrendasHuesped({ dataSource, handleShowModal, setDataSource }) {
  const { openNotification } = useLayout();
  const { idReservacion } = useParams();

  const columns = [
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Recibo",
      dataIndex: "recibo",
      key: "recibo",
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
    },
  ];

  async function handleDelete(ofrenda) {

    try {
      const r = await OfrendaApi.deleteOfrenda(ofrenda);
      openNotification(0, "Ofrenda Borrada", "Se ha borrado la ofrenda.")
      setDataSource(dataSource.filter(item => item.ofrenda !== ofrenda));

    } catch (error) {
      openNotification(1, "Error al borra la ofrenda", "")
      console.error(error)
    }
  }

  const columnsWithDelete = [
    ...columns,
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.ofrenda)}>
          Borrar
        </Button>
      ),
    },
  ];

  console.warn("Data source", dataSource)
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#77D9A1",
            cellFontSize: 15,
            headerColor: "#FFFFFF",
            colorText: "#3e3e3e",
          },
        },
        token: {
          colorPrimaryHover: "#92e1b4",
          colorPrimary: "#77d9a1",
          colorText: "#626262",
          colorBgContainerDisabled: "#fcfcfc",
          colorTextDisabled: "#939393",
        },
      }}
    >
      <Card>
        <div className="select-none mb-5">
          <Table
            dataSource={dataSource}
            rowKey="ofrenda"
            columns={columnsWithDelete}
            pagination={{ pageSize: 7 }} z
          />
        </div>

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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              icon={<HeartOutlined />}
              type="primary"
              size={"large"}
              onClick={handleShowModal}
            >
              Realizar Donación
            </Button>

            {idReservacion ? (
              <a
                href={`${URL_HOSTING}api/downloadDonations/${idReservacion}`}
                download={`Donaciones_Reservacion_${idReservacion}.xlsx`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  type="primary"
                  size={"large"}
                  icon={<DownloadOutlined />}
                >
                  Descargar Excel
                </Button>
              </a>
            ) : (
              <p style={{ color: "red", fontWeight: "bold" }}>
                ID de reservación no válido. Verifica la URL.
              </p>
            )}
          </div>
        </ConfigProvider>
      </Card>
    </ConfigProvider>
  );
}

export default OfrendasHuesped;
