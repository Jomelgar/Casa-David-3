import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Tabs, Table } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker } from "antd";

import {
  Card,
  Flex,
  Button,
  ConfigProvider,
  Spin,
  Modal,
  Input,
  Select,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useLayout } from "../../../context/LayoutContext";
import { getUserFromToken } from "../../../utilities/auth.utils";
import InformacionPersonal from "../../../components/perfil/InformacionPersonal";
import AccionesPerfil from "../../../components/perfil/AccionesPerfil";

import Lista_Negra from "../../../api/ListaNegra.api";
import InformacionPaciente from "../../../components/Hospedaje/InformacionPaciente";

// APIs
import HuespedApi from "../../../api/Huesped.api";
import CamaApi from "../../../api/Cama.api";
import PersonaApi from "../../../api/Persona.api";
import PacienteHuesped from "../../../api/pacienteHuesped.api";
import PacienteApi from "../../../api/Paciente.api";
import OfrendaApi from "../../../api/Ofrenda.api";
import DormitorioCamaHuesped from "../../../components/Hospedaje/DormitorioCamaHuesped";
import ReservacionesApi from "../../../api/Reservaciones.api";
import ZonaPeligrosa from "../../../components/Hospedaje/ZonaPeligrosa";

import Reglamento from "../../../api/Reglas.api";
import OfrendasHuesped from "../../../components/Hospedaje/OfrendasHuesped";
import Modalito2 from "../../../components/huesped/infoModal";
import PagarModal from "../../../components/huesped/dateModal";
import PatronoHuesped from "../../../components/Hospedaje/PatronoHuesped";

const { TabPane } = Tabs;

function Huesped() {
  // variables
  const usuario = getUserFromToken();
  const navigate = useNavigate();
  const { idReservacion } = useParams();
  dayjs.extend(customParseFormat);

  const { Meta } = Card;

  const pacienteVacio = {
    id_hospital: "",
    id_sala: "",
    id_piso: "",
    observacion: "",
    causa_visita: "",
  };

  const [reglas, setReglas] = useState([]);
  const [idRegla, setIdRegla] = useState(null);
  const [observaciones, setObservaciones] = useState("");

  const [openModalAddListaNegra, setOpenModalAddListaNegra] = useState(false);

  const fetchReglas = async () => {
    try {
      const response = await Reglamento.getReglasRequest();
      setReglas(
        response.data.map((e) => ({
          value: e.id_regla,
          label: e.descripcion_regla,
        }))
      );
    } catch (error) {
      console.error("Error al obtener las reglas!", error);
    }
  };

  // estados
  const [huesped, setHuesped] = useState(undefined);
  const [changeHuesped, setChangeHuesped] = useState({});

  const [acompanante, setAcompanante] = useState(undefined);
  const [changeAcompanante, setChangeAcompanante] = useState({});

  const [paciente, setPaciente] = useState({});
  const [changePaciente, setChangePaciente] = useState({});

  const [isEditableHuesped, setIsEditableHuesped] = useState(false);
  const [isEditableAcompanante, setIsEditableAcompanante] = useState(false);
  const [isEditablePaciente, setIsEditablePaciente] = useState(false);

  const [isEditableReservacion, setIsEditableReservacion] = useState(false);

  const [ofrendas, setOfrendas] = useState([]);
  const [visibleDepositar, setVisibleDepositar] = useState(false);

  const { openNotification, setCurrentPath, loadNotificaciones } = useLayout();

  const [tieneAcompanante, setTieneAcompanante] = useState(true);
  const [totalOfrendas, setTotalOfrendas] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const [loading, setLoading] = useState(false);

  // --------------------- funciones

  const loadInformacionAcompanante = async () => {
    const resAcompanante =
      await ReservacionesApi.getAcompananteByIdReservacionRequest(
        idReservacion
      );

    if (
      !resAcompanante ||
      resAcompanante.status < 200 ||
      resAcompanante.status >= 300
    ) {
      // mostrar mensaje de error
      setTieneAcompanante(false);
      return;
    }

    console.log(resAcompanante);

    const acompananteCompleto = {
      ...resAcompanante.data.PacienteHuesped.Huesped.Persona,
      ...{ id_reservacion: resAcompanante.data.id_reservacion },
    };

    setAcompanante(acompananteCompleto);
    setChangeAcompanante(acompananteCompleto);

    setTieneAcompanante(true);
  };

  const loadInformacion = async () => {
    // cargar informacion del huesped

    const resReservacion = await ReservacionesApi.getReservacionRequest(
      idReservacion
    );

    if (
      !resReservacion ||
      resReservacion.status < 200 ||
      resReservacion.status >= 300
    ) {
      // mostrar mensaje de error
      navigate("/error404");
      return;
    }

    //console.log(resReservacion);

    let huespedCompleto = {
      id_cama: resReservacion.data.id_cama,
      fecha_entrada: resReservacion.data.fecha_entrada,
      fecha_salida: resReservacion.data.fecha_salida,
      ...resReservacion.data.PacienteHuesped.Huesped.Persona,
      ...resReservacion.data.PacienteHuesped.Huesped,
      ...resReservacion.data.Cama,
      id_habitacion: resReservacion.data.Cama.id_habitacion,
      becado: resReservacion.data.becado,
      id_persona: resReservacion.data.PacienteHuesped.Huesped.id_persona,
    };

    if (resReservacion.data.AfiliadoReservacions[0]) {
      huespedCompleto = {
        ...huespedCompleto,
        dni_afiliado: resReservacion.data.AfiliadoReservacions[0].Afiliado.dni,
        nombre_afiliado:
          resReservacion.data.AfiliadoReservacions[0].Afiliado.nombre,
        id_patrono:
          resReservacion.data.AfiliadoReservacions[0].Afiliado
            .PatronoAfiliados[0].id_patrono,
      };
    }
    setCurrentPath(
      "Huesped / " +
      huespedCompleto.primer_nombre +
      " " +
      huespedCompleto.primer_apellido
    );

    setChangeHuesped(huespedCompleto);
    setHuesped(huespedCompleto);

    // Vamos con la info del pacientte

    const paciente = {
      ...resReservacion.data.PacienteHuesped.Paciente.Persona,
      ...resReservacion.data.PacienteHuesped.Paciente,
    };

    setPaciente(paciente);
    setChangePaciente(paciente);

    await fetchReglas();
    // vamos con las ofrendas
    await loadOfrendas();
    //await loadInformacionAcompanante();

    setTieneAcompanante(false);
  };

  const loadOfrendas = async () => {
    const resOfrendas = await OfrendaApi.getOfrendasByReservacionRequest(
      idReservacion
    );

    if (!resOfrendas || resOfrendas.status < 200 || resOfrendas.status >= 300) {
      // mostrar mensaje de error
      return;
    }

    let total = 0;

    resOfrendas.data.forEach((item) => {
      total += parseInt(item.valor);
    });

    setTotalOfrendas(total);

    setOfrendas(
      resOfrendas.data.map((item) => ({
        ofrenda: item.id_ofrenda,
        key: item.id_ofrenda,
        cantidad: "Lps. " + item.valor,
        fecha: dayjs(item.fecha).format("DD-MM-YYYY"), // Formatear la fecha aquí
        recibo: item.recibo,
        observacion: item.observacion,
      }))
    );
  };

  // ----------------- handlers

  const handleEvangelizacionChange = (field) => async (event) => {
    const updatedValue = event.target.checked;

    // Update the state
    setHuesped((prevState) => ({
      ...prevState,
      Persona: {
        ...prevState.Persona,
        [field]: updatedValue,
      },
    }));

    try {
      // Send PUT request
      const response = await PersonaApi.putPersonaRequest(
        huesped.Persona.id_persona,
        { [field]: updatedValue }
      );
      //console.log('Update successful:', response.data);
      openNotification(
        1,
        "Datos Actualizados",
        "Se actualizó la sección de Evangelización!"
      );
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const DepositarOfrenda = async (donaciones) => {
    console.log("Handle OK | Donaciones recibidas", donaciones);
    for (const donacion of donaciones) {
      const formattedDate = dayjs(donacion.fecha, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      const response = await OfrendaApi.postOfrendaRequest({
        id_pais: usuario.id_pais,
        id_reservacion: idReservacion,
        valor: donacion.monto,
        fecha: formattedDate,
        recibo: donacion.recibo,
        observacion: donacion.observacion ? donacion.observacion : null,
      });
    }

    setVisibleDepositar(false);
    openNotification(0, "Ofrenda", "Ofrenda depositada correctamente");

    await loadOfrendas();
  };

  const handleSetChangeHuesped = (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      case "telefono":
        if (
          previousValue !== null &&
          value.length > previousValue.length &&
          value.length === 4
        ) {
          if (/\d{4}/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      case "id_cama":
        console.log("Cambiando cama", newValue);
        break;

      default:
        break;
    }

    setChangeHuesped({ ...changeHuesped, [key]: newValue });
  };

  const handleSetChangePaciente = (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      case "telefono":
        if (
          previousValue !== null &&
          value.length > previousValue.length &&
          value.length === 4
        ) {
          if (/\d{4}/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      default:
        break;
    }

    setChangePaciente({ ...changePaciente, [key]: newValue });
  };

  const handleSetChangeAcompanante = (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      case "telefono":
        if (
          previousValue !== null &&
          value.length > previousValue.length &&
          value.length === 4
        ) {
          if (/\d{4}/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      default:
        break;
    }

    setChangeAcompanante({ ...changeAcompanante, [key]: newValue });
  };

  // Huespedes
  const handleGuardarHuesped = () => {
    console.log("Guardando huesped");

    setIsEditableHuesped(false);
  };

  const handleCancelarHuesped = () => {
    setChangeHuesped(huesped);
    setIsEditableHuesped(false);
  };

  // acompanante
  const handleGuardarAcompanante = () => {
    console.log("Guardando Acompanante");

    setIsEditableAcompanante(false);
  };

  const handleCancelarAcompanante = () => {
    setChangeAcompanante(acompanante);
    setIsEditableAcompanante(false);
  };

  // acompanante
  const handleGuardarPaciente = async () => {
    try {
      if (!changePaciente || !changePaciente.id_paciente) {
        openNotification(2, "Paciente", "No hay datos válidos para guardar.");
        return;
      }

      const response = await PacienteApi.putPacienteRequest(
        changePaciente.id_paciente,
        changePaciente
      );

      if (!response || response.status >= 400) {
        openNotification(
          1,
          "Paciente",
          "Error al guardar los cambios del paciente. Por favor, inténtelo de nuevo."
        );
        return;
      }

      openNotification(
        0,
        "Paciente",
        "Los cambios se guardaron correctamente."
      );
      setPaciente(changePaciente);
      setIsEditablePaciente(false);
    } catch (error) {
      openNotification(
        1,
        "Paciente",
        "Ocurrió un error inesperado al guardar los cambios: " + error.message
      );
    }
  };

  const handleCancelarPaciente = () => {
    setChangePaciente(paciente);
    setIsEditablePaciente(false);
    openNotification(0, "Paciente", "Los cambios han sido descartados.");
  };

  const handleGuardarReservacion = async () => {
    try {
      if (
        changeHuesped.fecha_entrada === "" ||
        changeHuesped.fecha_salida === ""
      ) {
        openNotification(
          2,
          "Reservacion",
          "Debe ingresar las fechas de entrada y salida"
        );
        return;
      }

      await ReservacionesApi.putReservacionRequest(idReservacion, {
        fecha_entrada: changeHuesped.fecha_entrada,
        fecha_salida: changeHuesped.fecha_salida,
      });

      setHuesped(changeHuesped);

      openNotification(0, "Reservacion", "Fechas actualizadas correctamente");

      loadNotificaciones();

      if (!changeHuesped.id_cama || !changeHuesped.id_habitacion) {
        openNotification(
          2,
          "Reservacion",
          "Debe seleccionar una cama y un dormitorio"
        );
        return;
      }

      if (changeHuesped.id_cama !== huesped.id_cama && changeHuesped.id_cama) {
        await ReservacionesApi.switchCamaRequest(
          idReservacion,
          changeHuesped.id_cama
        );
        setHuesped(changeHuesped);

        openNotification(
          0,
          "Reservacion",
          "Reservacion actualizada correctamente"
        );

        setIsEditableReservacion(false);

        return;
      }

      setIsEditableReservacion(false);
    } catch (error) {
      openNotification(
        1,
        "Reservacion",
        "Error al actualizar la reservacion" + error
      );
    }
  };

  const handleCancelarReservacion = () => {
    setChangeHuesped(huesped);
    setIsEditableReservacion(false);
  };

  const darDeAlta = async () => {
    setLoading(true);

    try {
      const darAlta = await ReservacionesApi.darDeAltaReservacion(
        idReservacion
      );

      if (!darAlta || darAlta.status >= 300 || darAlta.status < 200) {
        throw new Error("No se pudo dar de alta la reservación");
      }

      setLoading(false);

      navigate("/huespedes");

      openNotification(
        0,
        "Reservacion",
        "Reservacion dada de alta correctamente"
      );

      loadNotificaciones();
    } catch (error) {
      openNotification(
        1,
        "Reservacion",
        "Error al dar de alta la reservacion" + error
      );
      setLoading(false);
    }
  };

  const handleDarDeAlta = () => {
    setLoading(true);

    Modal.confirm({
      title: "¿Este huésped terminó su estadía?",
      content: (
        <div>
          <p>Esta Seguro que desea dar de alta ?</p>
        </div>
      ),
      okText: "Sí",
      cancelText: "No",
      confirmLoading: loading,
      centered: true,

      okType: "primary",
      onOk: darDeAlta,
    });
  };

  const mandarListaNegra = async () => {
    setLoading(true);

    if (!idRegla) {
      openNotification(2, "Error", "Debe seleccionar una regla");
      setLoading(false);
      return;
    }

    const response = await Lista_Negra.postListRequest({
      id_persona: huesped.id_persona,
      id_regla: idRegla,
      observaciones: "",
    });

    if (response.status >= 200 && response.status < 300) {
      openNotification(
        0,
        "Éxito",
        "Persona agregada a la lista negra con éxito"
      );
    }

    setLoading(false);

    await darDeAlta();
  };

  const handleListaNegra = () => {
    setOpenModalAddListaNegra(true);
  };

  // -------------------- efectos

  useEffect(() => {
    const loadingData = async () => {
      await loadInformacion();
    };

    loadingData();
  }, [idReservacion]);

  // Botones para editar la informacion
  const renderAcciones = (
    isEditable,
    setIsEditable,
    handleGuardar,
    handleCancelar
  ) => {
    return (
      <Card style={{ marginTop: 10 }} className="shadow-#1">
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
              onClick={() => {
                setIsEditable(true);
              }}
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
  };

  const renderHuesped = () => {
    return (
      <Flex vertical>
        <Flex justify="space-between" align="center">
          <h1 className="text-xl font-bold text-white-800">Huesped</h1>

          <Flex align="center" gap="small">
            <div className="bg-green-500 py-3 px-5 text-lg rounded-md text-white-100 shadow-lg">
              {huesped.becado ? "Becado" : "No es Cortesía"}
            </div>

            <div className="bg-blue-500 py-3 px-5 text-lg rounded-md text-white-100 shadow-lg">
              {huesped.reingreso ? "Reingreso" : "Nuevo"}
            </div>
          </Flex>
        </Flex>
        <InformacionPersonal
          user={huesped}
          changeUser={changeHuesped}
          isEditable={isEditableHuesped}
          handleSetChangeUser={handleSetChangeHuesped}
        />
      </Flex>
    );
  };

  const renderAcompanante = () => {
    if (acompanante)
      return (
        <Flex vertical style={{ marginTop: 40 }}>
          <Flex justify="space-between" align="center">
            <h1 className="text-xl font-bold text-white-800">Acompañante</h1>
          </Flex>
          <InformacionPersonal
            user={acompanante}
            changeUser={changeAcompanante}
            isEditable={isEditableAcompanante}
            handleSetChangeUser={handleSetChangeAcompanante}
          />
        </Flex>
      );
    else
      return (
        <Flex vertical style={{ marginTop: 40 }}>
          <Flex justify="space-between" align="center">
            <h1 className="text-xl font-bold text-white-800">Acompañante</h1>
          </Flex>

          <Flex align="center" vertical>
            <div className="bg-green-500 text-white-100 text-2xl py-4 text-center rounded-md w-1/2 mt-5">
              <h2>No tiene acompañante</h2>
            </div>
          </Flex>
        </Flex>
      );
  };

  const renderPaciente = () => {
    return (
      <Flex vertical style={{ marginTop: 40 }}>
        <Flex justify="space-between" align="center">
          <h1 className="text-xl font-bold text-white-800">Paciente</h1>
        </Flex>
        <InformacionPersonal
          user={paciente}
          changeUser={changePaciente}
          isEditable={isEditablePaciente}
          handleSetChangeUser={handleSetChangePaciente}
        />
        <InformacionPaciente
          user={paciente}
          changeUser={changePaciente}
          isEditable={isEditablePaciente}
          handleSetChangeUser={handleSetChangePaciente}
        />
        {renderAcciones(
          isEditablePaciente,
          setIsEditablePaciente,
          handleGuardarPaciente,
          handleCancelarPaciente
        )}
      </Flex>
    );
  };

  const renderPatrono = () => {
    return huesped.id_patrono ? (
      <PatronoHuesped
        user={huesped}
        changeUser={changeHuesped}
        isEditable={false}
        handleSetChangeUser={handleSetChangeHuesped}
      />
    ) : (
      <></>
    );
  };
  const renderCamaDormitorio = () => {
    return (
      <Flex vertical style={{ marginTop: 40 }}>
        <Flex justify="space-between" align="center">
          <h1 className="text-xl font-bold text-white-800">Estadia</h1>
        </Flex>
        <DormitorioCamaHuesped
          huesped={huesped}
          changeHuesped={changeHuesped}
          isEditable={isEditableReservacion}
          handleSetChangeHuesped={handleSetChangeHuesped}
        />

        {renderAcciones(
          isEditableReservacion,
          setIsEditableReservacion,
          handleGuardarReservacion,
          handleCancelarReservacion
        )}
      </Flex>
    );
  };

  const renderOfrendas = () => {
    const columnsHistorial = [
      { title: "Semana", dataIndex: "semana", key: "semana" },
      { title: "Domingo", dataIndex: "domingo", key: "domingo" },
      { title: "Lunes", dataIndex: "lunes", key: "lunes" },
      { title: "Martes", dataIndex: "martes", key: "martes" },
      { title: "Miércoles", dataIndex: "miercoles", key: "miercoles" },
      { title: "Jueves", dataIndex: "jueves", key: "jueves" },
      { title: "Viernes", dataIndex: "viernes", key: "viernes" },
      { title: "Sábado", dataIndex: "sabado", key: "sabado" },
    ];

    const getHistorialData = () => {
      const semanas = {};
      const dias = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
      ];
      const startOfMonth = selectedMonth.startOf("month"); // Primer día del mes
      const endOfMonth = selectedMonth.endOf("month"); // Último día del mes

      // Inicializar las semanas y los días
      for (let day = 0; day <= endOfMonth.date(); day++) {
        const fecha = startOfMonth.clone().add(day, "days"); // Clonar y añadir el día sin modificar el original
        const weekOfMonth = Math.ceil((fecha.date() + startOfMonth.day()) / 7); // Semana del mes
        const diaSemana = fecha.day(); // Día de la semana (0 a 6)

        if (!semanas[weekOfMonth]) {
          semanas[weekOfMonth] = {
            semana: weekOfMonth,
            domingo: "-",
            lunes: "-",
            martes: "-",
            miercoles: "-",
            jueves: "-",
            viernes: "-",
            sabado: "-",
          };
        }

        // Si la fecha está dentro del mes seleccionado, inicializar con 0
        if (fecha.month() === selectedMonth.month()) {
          semanas[weekOfMonth][dias[diaSemana]] = 0;
        }
      }

      // Procesar las ofrendas para asignarlas a las fechas correspondientes
      ofrendas.forEach((ofrenda) => {
        const fecha = dayjs(ofrenda.fecha, "DD-MM-YYYY"); // Asegurarse de que la fecha esté en formato correcto

        if (
          fecha.month() === selectedMonth.month() &&
          fecha.year() === selectedMonth.year()
        ) {
          const weekOfMonth = Math.ceil(
            (fecha.date() + startOfMonth.day()) / 7
          ); // Semana del mes
          const diaSemana = fecha.day(); // Día de la semana (0 a 6)

          // Sumar la cantidad donada al día correspondiente
          semanas[weekOfMonth][dias[diaSemana]] += parseFloat(
            ofrenda.cantidad.replace("Lps. ", "")
          );
        }
      });

      // Convertir los valores numéricos a cadenas con el formato "Lps. " excepto los guiones
      Object.values(semanas).forEach((semana) => {
        Object.keys(semana).forEach((clave) => {
          if (clave !== "semana" && semana[clave] !== "-") {
            semana[clave] = `Lps. ${semana[clave].toFixed(2)}`;
          }
        });
      });

      return Object.values(semanas);
    };

    return (
      <Flex vertical style={{ marginTop: 40 }}>
        <PagarModal
          idReservacion={idReservacion}
          isVisible={visibleDepositar}
          handleClose={() => {
            setVisibleDepositar(false);
          }}
          handleOk={DepositarOfrenda}
        />
        <Flex justify="space-between" align="center">
          <h1 className="text-xl font-bold text-white-800">Donaciones</h1>
        </Flex>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Historial Donaciones " key="1">
            <OfrendasHuesped
              dataSource={ofrendas}
              setDataSource={setOfrendas}
              handleShowModal={() => {
                setVisibleDepositar(true);
              }}
            />
          </TabPane>
          <TabPane tab="Reporte de Donaciones" key="2">
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: "16px" }}
            >
              {/*     <h2>{selectedMonth.format("MMMM YYYY")}</h2>
               */}{" "}
              <DatePicker
                picker="month"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                format="MMMM YYYY"
                allowClear={false}
              />
            </Flex>
            <Table
              dataSource={getHistorialData()}
              columns={columnsHistorial}
              pagination={false}
              className="custom-table"
            />
          </TabPane>
        </Tabs>

        <Flex justify="" align="center" className="mt-5">
          <h1 className="text-xl py-3 px-2 rounded-bl-md rounded-tl-md font-bold bg-green-500 text-white-100 ">
            Total de Donaciones
          </h1>
          <div className="bg-white-100 py-3 px-5 text-lg rounded-tr-md rounded-br-md text-green-500 border-t border-r border-b border-green-500">
            Lps. {totalOfrendas}
          </div>
        </Flex>
      </Flex>
    );
  };

  const handleSaveObservacion = async () => {
    let observacion = document.getElementById("observacion-textarea").value;

    if (!observacion) observacion = null;

    await PersonaApi.putPersonaRequest(huesped.Persona.id_persona, {
      observacion,
    });
    openNotification(1, "Observación", "Observación guardada correctamente");
  };

  const render = () => {
    //console.log("Campos de Evangelizacion")
    //console.log("Compartio el Evangelio:", huesped.Persona.compartio_evangelio)
    //console.log("Acepto a Cristo:", huesped.Persona.acepto_a_cristo)
    //console.log("Reconciliado:", huesped.Persona.reconcilio)

    return (
      <Flex gap={"large"} vertical>
        {renderHuesped()}

        {/*renderAcompanante()*/}

        {renderPaciente()}

        {renderPatrono()}

        <Flex justify="space-between" align="center">
          <h1 className="text-xl font-bold text-white-800">Evangelización</h1>
        </Flex>

        <div className="bg-white-100 border-0 w-11/12 flex flex-row justify-center content-center h-content rounded-lg shadow mr-12 gap-x-20 p-6">
          <div className="w-fit flex flex-row">
            <span className="mr-3 font-bold">Compartió Evangelio</span>
            <input
              id="compartio_evangelio"
              type="checkbox"
              onChange={handleEvangelizacionChange("compartio_evangelio")}
              checked={huesped.Persona.compartio_evangelio}
            />
          </div>

          <div className="w-fit flex flex-row">
            <span className="mr-3 font-bold">Aceptó a Cristo</span>
            <input
              type="checkbox"
              id="acepto_a_cristo"
              onChange={handleEvangelizacionChange("acepto_a_cristo")}
              checked={huesped.Persona.acepto_a_cristo}
            />
          </div>

          <div className="w-fit flex flex-row">
            <span className="mr-3 font-bold">Reconciliado</span>
            <input
              type="checkbox"
              id="reconcilio"
              onChange={handleEvangelizacionChange("reconcilio")}
              checked={huesped.Persona.reconcilio}
            />
          </div>
        </div>

        <div className="bg-white-100 border-0 w-11/12 flex flex-col justify-center content-center h-content rounded-lg shadow mr-12 gap-x-20 p-6">
          <h1 className="text-xl font-bold text-white-800 mb-3">Observación</h1>

          <textarea
            defaultValue={huesped.Persona.observacion}
            id="observacion-textarea"
            className="w-5/6 h-1/4 border mb-4 shadow-md p-4 rounded"
          />
          <button
            onClick={handleSaveObservacion}
            className="px-4 py-2 rounded text-lg font-bold text-white bg-sky-600 text-white-100 w-fit h-fit ease-in-out duration-150 hover:-translate-y-2"
          >
            Guardar
          </button>
        </div>

        {renderOfrendas()}

        {renderCamaDormitorio()}

        {
          <Flex vertical style={{ marginTop: 40 }}>
            <ZonaPeligrosa
              handleDarDeAlta={handleDarDeAlta}
              handleListaNegra={handleListaNegra}
            />
          </Flex>
        }
      </Flex>
    );
  };

  return (
    <>
      <Modal
        open={openModalAddListaNegra}
        title="Esta seguro de agregar a la lista Negra ?"
        onOk={mandarListaNegra}
        confirmLoading={loading}
        centered
        okText="Aceptar"
        okType="danger"
        cancelText="Cancelar"
        onCancel={() => {
          setObservaciones("");
          setIdRegla(null);
          setLoading(false);
          setOpenModalAddListaNegra(false);
        }}
      >
        <ConfigProvider
          input={{ className: "cursor-default" }}
          theme={{
            token: {
              colorPrimaryHover: "#92e1b4",
              colorPrimary: "#77d9a1",
              colorText: "#626262",
              colorBgContainerDisabled: "#fcfcfc",
              colorTextDisabled: "#939393",
            },
          }}
        >
          <Select
            placeholder="Regla Incumplida"
            options={reglas}
            style={{
              width: "100%",
              marginBottom: "20px",
              height: "100%",
              marginTop: "20px",
            }}
            value={idRegla}
            onChange={(value) => {
              setIdRegla((e) => value);
            }}
          />

          <Input
            className="text-md"
            value={observaciones}
            placeholder="Observaciones"
            onChange={(e) => {
              setObservaciones(e.target.value);
            }}
            style={{ marginBottom: "20px" }}
          />
        </ConfigProvider>
      </Modal>

      {huesped && (tieneAcompanante ? acompanante : true) ? (
        render()
      ) : (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#77d9a1",
            },
          }}
        >
          <Spin
            style={{ height: "90vh", width: "100%", alignContent: "center" }}
            size="large"
          />
        </ConfigProvider>
      )}
    </>
  );
}

export default Huesped;