import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  ConfigProvider,
  Modal,
  Select,
  Switch,
  message,
  Button,
} from "antd";
import HuespedApi from "../../../api/Huesped.api";
import Disponibilidad from "../../../components/Disponiblidad/Disponibilidad";
import { useNavigate } from "react-router-dom";
import {
  DownloadOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import CamaApi from "../../../api/Cama.api";
import HabitacionApi from "../../../api/Habitacion.api";
import ListaSolicitudApi from "../../../api/ListaSolicitud.api";
import UserApi from "../../../api/User.api";
import PersonApi from "../../../api/Persona.api";
import { getUserFromToken } from "../../../utilities/auth.utils";
import ReservacionesApi from "../../../api/Reservaciones.api";
import { useLayout } from "../../../context/LayoutContext";
import * as XLSX from "xlsx";
import HuespedSolicitud from "../../../components/huesped/HuespedSolicitud";

const { Option } = Select;

function TablaDeSolicitudes() {
  const navigate = useNavigate();

  const { setCurrentPath, userLog } = useLayout();

  const [datos, setDatos] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [selectedHabitacion, setSelectedHabitacion] = useState(null);
  const [camasDisponibles, setCamasDisponibles] = useState([]);
  const [selectedCama, setSelectedCama] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreDeLaPersona, setNombreDeLaPersona] = useState("");
  const [generoHuesped, setGeneroHuesped] = useState(null);
  const [idHuesped, setIdHuesped] = useState(0);
  const [idLista, setIdLista] = useState(0);
  const [camasDisponiblesHombres, setCamasDisponiblesHombres] = useState(0);
  const [camasDisponiblesMujeres, setCamasDisponiblesMujeres] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [dataFilaSolicitud, setDataFilaSolicitud] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [solicitudSelect, setSolicitudSelect] = useState(0);

  const [loading, setLoading] = useState(false);

  const loadCamasDisponibles = async () => {
    try {
      const response = await CamaApi.getCamasByDisponibleRequest();

      if (!response || response.status < 200 || response.status >= 300) {
        navigate("/error");
        return;
      }

      const camasHombre = response.data.data.filter(
        (cama) =>
          cama.Habitacion.genero === "MASCULINO" &&
          cama.Habitacion.id_lugar === userLog.id_lugar
      );

      const camasMujer = response.data.data.filter(
        (cama) =>
          cama.Habitacion.genero === "FEMENINO" &&
          cama.Habitacion.id_lugar === userLog.id_lugar
      );

      setCamasDisponiblesHombres(camasHombre.length);
      setCamasDisponiblesMujeres(camasMujer.length);
    } catch (error) {
      navigate("/error");
    }
  };

  const fetchData = async () => {
    const res = await ListaSolicitudApi.getListaSolicitudTotalRequest();

    const filteredRes = res.data.filter(
      (item) =>
        item.PacienteHuesped.Huesped.Persona.id_lugar === userLog.id_lugar
    );

    if (filteredRes) {
      const flattenedData = filteredRes.map((item) => ({
        id_lista_solicitud: item.id_lista_solicitud,
        fecha_entrada: item.fecha_entrada,
        id_huesped: item.PacienteHuesped.Huesped.id_huesped,
        nombre: item.PacienteHuesped.Huesped.Persona.primer_nombre,
        id: item.PacienteHuesped.Huesped.Persona.dni,
        genero: item.PacienteHuesped.Huesped.Persona.genero,
        observacion: item.observacion,
        apellido: item.PacienteHuesped.Huesped.Persona.primer_apellido,
      }));
      setDatos(flattenedData);
    } else {
      console.error("Error al obtener los huéspedes:", res);
    }
  };

  const fetchHabitaciones = async (genero) => {
    try {
      const response = await HabitacionApi.getAllHabitacionesRequest();
      if (response && response.data) {
        console.log(response);
        const habitacionesFiltradas = response.data.filter(
          (habitacion) =>
            habitacion.genero === genero &&
            habitacion.disponible &&
            habitacion.id_lugar === userLog.id_lugar
        );
        console.log();
        setHabitaciones(habitacionesFiltradas);
      } else {
        console.error("Error al obtener las habitaciones:", response);
      }
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
    }
  };

  const fetchCamasDisponibles = async (idHabitacion) => {
    try {
      const response = await CamaApi.getCamaRequestbyRoom(idHabitacion);
      if (response && response.data) {
        const camasDisponiblesFiltradas = response.data.data.filter(
          (cama) => cama.disponible
        );
        setCamasDisponibles(camasDisponiblesFiltradas);
      } else {
        console.error("Error al obtener las camas disponibles:", response);
      }
    } catch (error) {
      console.error("Error al obtener las camas disponibles:", error);
    }
  };

  const handleHospedarClick = (record) => {
    setGeneroHuesped(record.genero);
    setNombreDeLaPersona(`${record.nombre} ${record.apellido}`);

    setSolicitudSelect(record.id_lista_solicitud);

    setModalVisible(true);
    fetchHabitaciones(record.genero);
  };

  const handleDeleteClick = (record) => {
    setGeneroHuesped(record.genero);
    setNombreDeLaPersona(`${record.nombre} ${record.apellido}`);
    setIdLista(record.id_lista_solicitud);
    setDeleteModal(true);
  };

  const handleInfoClick = (record) => {
    setDataFilaSolicitud(record);
    console.log("Record clickeado: ",record);
    console.log(dataFilaSolicitud);
    setShowInfoModal(true);
  };

  const handleInfoConfirm = () => {
    setShowInfoModal(false);
  };

  const handleRemoveHospedar = async () => {
    setLoading(true);

    try {
      await ListaSolicitudApi.deleteListaSolicitudRequest(idLista);
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
    }

    await fetchData();
    setDeleteModal(false);

    setLoading(false);
  };

  const handleHabitacionChange = (value) => {
    setSelectedCama(null);
    setCamasDisponibles([]);
    setSelectedHabitacion(value);
    fetchCamasDisponibles(value);
  };

  const handleCamaChange = (value) => {
    setSelectedCama(value);
  };

  const handleModalOk = async () => {
    setLoading(true);
    if (!selectedHabitacion || !selectedCama) {
      message.error(
        "Por favor selecciona una habitación y una cama. Revise si la cama pertenece a la habitacion correcta"
      );
      setLoading(false);
      return;
    }

    const response = await ReservacionesApi.postReservacionRequest({
      idSolicitud: solicitudSelect,
      idCama: selectedCama,
    });

    if (!response || response.status < 200 || response.status >= 300) {
      message.error("Error al hospedar al huésped.");
      return;
    }

    setModalVisible(false);
    message.success("Hospedado exitosamente.");
    setSelectedHabitacion(null);
    setSelectedCama(null);
    fetchData();
    loadCamasDisponibles();

    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    loadCamasDisponibles();

    setCurrentPath("Lista de Solicitudes");
  }, []);

  const columns = [
    {
      title: "Fecha de Entrada",
      dataIndex: "fecha_entrada",
      key: "fecha_entrada",
      sorter: (a, b) => new Date(a.fecha_entrada) - new Date(b.fecha_entrada),
      defaultSortOrder: "ascend",
    },
    {
      title: "ID del Residente",
      dataIndex: "id",
      key: "id",
      filters: [],
      filterSearch: true,
    },
    {
      title: "Genero",
      dataIndex: "genero",
      key: "genero",
      filters: [
        { text: "Masculino", value: "Masculino" },
        { text: "Femenino", value: "Femenino" },
      ],
      onFilter: (value, record) => record.genero.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Primer Nombre",
      dataIndex: "nombre",
      key: "nombre",
      filters: [],
      filterSearch: true,
    },
    {
      title: "Primer Apellido",
      dataIndex: "apellido",
      key: "apellido",
      filters: [],
      filterSearch: true,
    },
    {
      title: "Observacion",
      dataIndex: "observacion",
      key: "observacion",
      filters: [],
      filterSearch: true,
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space size="middle">
          <CheckCircleOutlined
            className="text-4xl"
            style={{ color: "#4CAF50" }}
            onClick={() => handleHospedarClick(record)}
          ></CheckCircleOutlined>
          <InfoCircleOutlined
            className="text-4xl"
            style={{ color: "#03A9F4" }}
            onClick={() => handleInfoClick(record)}
          ></InfoCircleOutlined>

          <DeleteOutlined
            className="text-4xl"
            style={{ color: "#EF5350" }}
            onClick={() => handleDeleteClick(record)}
          ></DeleteOutlined>
        </Space>
      ),
    },
  ];

  const exportToExcel = (dataSource) => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lista_de_solicitudes");
    XLSX.writeFile(wb, "Lista_de_solicitudes.xlsx");
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#77D9A1",
              cellFontSize: 15,
              headerColor: "#FFFFFF",
              headerSortActiveBg: "#5fae81",
              headerSortHoverBg: "#5fae81",
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
        <Disponibilidad
          camasDisponiblesHombres={camasDisponiblesHombres}
          camasDisponiblesMujeres={camasDisponiblesMujeres}
          mostrarCantidad={true}
        />
        <Table
          columns={columns}
          dataSource={datos}
          pagination={{ showSizeChanger: true }}
        />

        <Modal
          title={`Hospedar a ${nombreDeLaPersona}`}
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          okText="Hospedar"
          cancelText="Cancelar"
          confirmLoading={loading}
        >
          <p>Selecciona una habitación:</p>
          <Select style={{ width: 200 }} onChange={handleHabitacionChange}>
            {habitaciones.map((habitacion) => (
              <Option
                key={habitacion.id_habitacion}
                value={habitacion.id_habitacion}
              >
                {habitacion.nombre}
              </Option>
            ))}
          </Select>
          <p>Selecciona una cama:</p>
          <Select style={{ width: 200 }} onChange={handleCamaChange}>
            {camasDisponibles.map((cama) => (
              <Option key={cama.id_cama} value={cama.id_cama}>
                {cama.nomre}
              </Option>
            ))}
          </Select>
        </Modal>
        <Modal
          width={"100%"}
          title={`Desea quitar a ${nombreDeLaPersona} de la lista?`}
          visible={deleteModal}
          onOk={handleRemoveHospedar}
          onCancel={() => setDeleteModal(false)}
          okText="Borrar"
          cancelText="Cancelar"
          confirmLoading={loading}
        ></Modal>

        <Modal
          title={``}
          width={1000}
          onOk={handleInfoConfirm}
          footer={
            <Button key="Button" type="primary" onClick={handleInfoConfirm}>
              Aceptar
            </Button>
          }
          open={showInfoModal}
          destroyOnClose={true}
          onCancel={() => setShowInfoModal(false)}
        >
          <HuespedSolicitud
            ListaSolicitud={dataFilaSolicitud}
          ></HuespedSolicitud>
        </Modal>
      </ConfigProvider>
    </>
  );
}

export default TablaDeSolicitudes;
