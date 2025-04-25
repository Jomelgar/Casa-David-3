import React, { useEffect, useState } from "react";
import {
  Table,
  ConfigProvider,
  Modal,
  InputNumber,
  Select,
  Form,
  Button,
} from "antd";
import { useLayout } from "../../context/LayoutContext";
import camasByRoom from "../../api/Cama.api";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import ReservacionesApi from "../../api/Reservaciones.api";
import { ConsoleSqlOutlined } from "@ant-design/icons";

const { Column } = Table;
const { Option } = Select;

const Dormitorio = ({ habitacion }) => {
  const { openNotification, setCurrentPath } = useLayout();
  const [dataSource, setDataSource] = useState([]);
  const { id_hab, setId_hab } = useState();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const loadData = async (id_habitacion) => {
    const searchParams = new URLSearchParams(window.location.search);
    const idHabitacionParam = searchParams.get("id_habitacion");
    const data = { id_habitacion: idHabitacionParam };

    try {
      const response = await camasByRoom.getCamaHuespedByRoom(
        data.id_habitacion
      );

      if (!response) {
        openNotification(
          3,
          "Error",
          "No se pudo cargar las camas de esta habitación"
        );
        //throw new Error("No se pudo cargar las camas de esta habitación");
      }

      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        const DatosIn = response.data.map((item) => {
          let primerNombre = "";
          let segundoNombre = "";
          let primerApellido = "";
          let segundoApellido = "";

          if (item.Reservacions && item.Reservacions.length > 0) {
            const reservacion = item.Reservacions[0];
            if (
              reservacion.PacienteHuesped &&
              reservacion.PacienteHuesped.Huesped &&
              reservacion.PacienteHuesped.Huesped.Persona
            ) {
              const persona = reservacion.PacienteHuesped.Huesped.Persona;
              primerNombre = persona.primer_nombre || "";
              segundoNombre = persona.segundo_nombre || "";
              primerApellido = persona.primer_apellido || "";
              segundoApellido = persona.segundo_apellido || "";
            }
          }

          return {
            key: item.id_cama,
            numero: item.id_cama,
            nombre: item.nomre,
            tipo: item.tipo,
            disponible: item.disponible ? "DISPONIBLE" : "NO DISPONIBLE",
            reservacion: item.Reservacions,
            primerNombre: primerNombre,
            segundoNombre: segundoNombre,
            primerApellido: primerApellido,
            segundoApellido: segundoApellido,
          };
        });
        setDataSource(DatosIn);
      }
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const [form] = Form.useForm();

  const handleEditar = (record) => {
    Modal.confirm({
      title: "Editar información de la cama",
      content: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ numero: parseInt(record.numero), tipo: record.tipo }}
        >
          <Form.Item label="No. de Cama" name="numero">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Tipo de Cama" name="tipo">
            <Select>
              <Option value="Camarote (Cama Arriba)">
                Camarote (Cama Arriba)
              </Option>
              <Option value="Camarote (Cama Abajo)">
                Camarote (Cama Abajo)
              </Option>
              <Option value="Individual">Individual</Option>
              <Option value="Matrimonial">Matrimonial</Option>
            </Select>
          </Form.Item>
        </Form>
      ),
      okText: "Guardar",
      cancelText: "Cancelar",
      onOk: () => {
        form.validateFields().then((values) => {
          const newData = dataSource.map((item) => {
            if (item.key === record.key) {
              return {
                ...item,
                numero: values.numero.toString(),
                tipo: values.tipo,
              };
            }
            return item;
          });
          setDataSource(newData);
        });
      },
    });
  };

  const handleFinEstadia = (record) => {
    Modal.confirm({
      title: "¿Este huésped terminó su estadía?",
      content: (
        <div>
          <p>El huesped de la siguiente cama será dado de alta:</p>
          <pre>{record.nombre}</pre>
        </div>
      ),
      okText: "Sí",
      cancelText: "No",
      confirmLoading: loading,

      okType: "primary",
      onOk: async () => {
        try {
          const reservacion =
            await ReservacionesApi.getReservcionActivaByIdCama(record.key);

          if (
            !reservacion ||
            reservacion.status >= 300 ||
            reservacion.status < 200
          ) {
            throw new Error("No se pudo cargar la reservación activa");
          }

          const darAlta = await ReservacionesApi.darDeAltaReservacion(
            reservacion.data.id_reservacion
          );

          if (!darAlta || darAlta.status >= 300 || darAlta.status < 200) {
            throw new Error("No se pudo dar de alta la reservación");
          }

          loadData();
        } catch (error) {}
      },
    });
  };

  const columns = [
    {
      title: "No. de Cama",
      dataIndex: "nombre",
    },
    {
      title: "Tipo de Cama",
      dataIndex: "tipo",
    },
    {
      title: "Nombre de Huesped",
      render: (text, record) => {
        const nombreCompleto =
          `${record.primerNombre} ${record.segundoNombre} ${record.primerApellido} ${record.segundoApellido}`.trim();
        return nombreCompleto || "-";
      },
    },
    {
      title: "Disponibilidad",
      dataIndex: "disponible",
    },
    {
      title: "Opciones",
      render: (text, record) => (
        <div>
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
            {/* <Button
              style={{ marginRight: 8 }}
              type={"primary"}
              onClick={() => handleEditar(record)}
            >
              Editar
            </Button> */}
          </ConfigProvider>
          {record.disponible === "NO DISPONIBLE" && (
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
              <Button type="primary" onClick={() => handleFinEstadia(record)}>
                Dar de Alta
              </Button>
            </ConfigProvider>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadData();
    setCurrentPath("/ Mantenimiento / Habitaciones / ");
  }, []);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#77D9A1",
              cellFontSize: 18,
              headerColor: "#FFFFFF",
              colorText: "#3e3e3e",
            },
            Button: {
              colorPrimary: "#77d9a1",
              colorPrimaryHover: "#5fae81",
              colorPrimaryActive: "#9bd8e5",
              defaultHoverColor: "#fdfdfd",
            },
          },
        }}
      >
        <div>
          <Table columns={columns} dataSource={dataSource} />
        </div>
      </ConfigProvider>

      <style jsx>{`
        .edit-button {
          background-color: #77d9a1;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          height: 40px;
          margin-right: 10px;
        }

        .discharge-button {
          background-color: #77d9a1;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          height: 40px;
        }
      `}</style>
    </>
  );
};

export default Dormitorio;
