import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, Flex, Button, ConfigProvider } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { useLayout } from "../../context/LayoutContext";


import InformacionPersonal from "../perfil/InformacionPersonal"
import AccionesPerfil from "../perfil/AccionesPerfil"
import InformacionPaciente from "../Hospedaje/InformacionPaciente"
// APIs

import HuespedApi from "../../api/Huesped.api";
import CamaApi from "../../api/Cama.api";
import PersonaApi from "../../api/Persona.api";
import PacienteHuesped from "../../api/pacienteHuesped.api";
import PacienteApi from "../../api/Paciente.api";
import DormitorioCamaHuesped from "../../components/Hospedaje/DormitorioCamaHuesped";
import ReservacionesApi from "../../api/Reservaciones.api";
import ZonaPeligrosa from "../../components/Hospedaje/ZonaPeligrosa";
import OfrendasHuesped from "../../components/Hospedaje/OfrendasHuesped";
import ListaSolicitudApi from "../../api/ListaSolicitud.api";
import { getMunicipioById } from "../../api/municipioApi";
import { getDepartamentoById } from "../../api/departamentoApi";
import PacienteHuespedApi from "../../api/pacienteHuesped.api"



function HuespedSolicitud({ListaSolicitud}) {
  // variables
 console.log(ListaSolicitud.id_lista_solicitud)

  const { Meta } = Card;

  const pacienteVacio = {
    id_hospital: "",
    id_sala: "",
    id_piso: "",
    observacion: "",
    causa_visita: "",
  };

  // estados
  const [huesped, setHuesped] = useState({});
  const [changeHuesped, setChangeHuesped] = useState({});

  const [acompanante, setAcompanante] = useState({});
  const [changeAcompanante, setChangeAcompanante] = useState({});

  const [paciente, setPaciente] = useState({});
  const [changePaciente, setChangePaciente] = useState({});

  const [isEditableHuesped, setIsEditableHuesped] = useState(false);
  const [isEditableAcompanante, setIsEditableAcompanante] = useState(false);
  const [isEditablePaciente, setIsEditablePaciente] = useState(false);

  const [isEditableReservacion, setIsEditableReservacion] = useState(false);

  const [ofrendas, setOfrendas] = useState([]);

  
  

  const { openNotification, setCurrentPath } = useLayout();

  // --------------------- funciones

  const loadInformacion = async () => {
    // cargar informacion del huesped
    console.log("Cargando informacion de huesped solicitud con: ", ListaSolicitud);
 
  
    const resSolicitud = await ListaSolicitudApi.getListaSolicitudRequest(ListaSolicitud.id_lista_solicitud)
   console.log("resSolicitud: ",resSolicitud);
    
    const resHuespedData = resSolicitud.data.PacienteHuesped.Huesped.Persona;
    const resPacienteData = resSolicitud.data.PacienteHuesped.Paciente.Persona;
    const PacienteData = resSolicitud.data.PacienteHuesped.Paciente;
    const PacienteHuespedData= resSolicitud.data.PacienteHuesped;

    const reshuespedPaciente= await PacienteHuespedApi.getPHRequest(PacienteHuespedData.id_paciente_huesped)

    console.log('reshuespedPacienteeeeeeeeeeeeeeeeeeeeeee: ', reshuespedPaciente)
    console.log('pacienteeeeeeeeeeeeeeeeeeeee res: ', PacienteHuespedData)

    console.log('pacinte res: ', resPacienteData)
    if (
      !resSolicitud ||
      resSolicitud.status < 200 ||
      resSolicitud.status >= 300
    ) {
      // mostrar mensaje de error
      return;
    }
    const municipioHuesped = await getMunicipioById(resHuespedData.municipio_id);
    const departamentoHuesped = await getDepartamentoById(municipioHuesped.departamento_id);


    const huespedCompleto = {
      id_persona: resHuespedData.id_persona,
      primer_nombre: resHuespedData.primer_nombre,
      segundo_nombre: resHuespedData.segundo_nombre,
      primer_apellido: resHuespedData.primer_apellido,
      segundo_apellido: resHuespedData.segundo_apellido,
      dni: resHuespedData.dni,
      direccion: resHuespedData.direccion,
      telefono: resHuespedData.telefono,
      referencia_telefonica: resHuespedData.referencia_telefonica,
      genero: resHuespedData.genero,
      fecha_nacimiento: resHuespedData.fecha_nacimiento,
      municipio_id: resHuespedData.municipio_id,
      lugar: resHuespedData.Lugar.codigo,
      id_ocupacion: resHuespedData.id_ocupacion,
      iglesia: resHuespedData.iglesia,
    };


   // setChangeHuesped(huespedCompleto);
    setHuesped(huespedCompleto);
    console.log(huespedCompleto)
    console.warn("paciente data", resPacienteData)
    // Vamos con la info del pacientte
    
    const municipioPaciente = await getMunicipioById(resPacienteData.municipio_id);
    const departamentoPaciente = await getDepartamentoById(municipioPaciente.departamento_id);


    const paciente = {
      id_persona: resPacienteData.id_persona,
      primer_nombre: resPacienteData.primer_nombre,
      segundo_nombre: resPacienteData.segundo_nombre,
      primer_apellido: resPacienteData.primer_apellido,
      segundo_apellido: resPacienteData.segundo_apellido,
      dni: resPacienteData.dni,
      direccion: resPacienteData.direccion,
      telefono: resPacienteData.telefono,
      genero: resPacienteData.genero,
      fecha_nacimiento: resPacienteData.fecha_nacimiento,
      municipio_id: resPacienteData.municipio_id,
      lugar: resPacienteData.Lugar.codigo,
      id_ocupacion: resPacienteData.id_ocupacion,
      id_sala: PacienteData.id_sala,
      id_hospital: PacienteData.id_hospital,
      id_piso: PacienteData.id_piso,
      iglesia: resPacienteData.iglesia,
      observacion: PacienteData.observacion,
      referencia_telefonica: resPacienteData.referencia_telefonica,
      id_causa_visita: PacienteData.id_causa_visita,
      parentesco_paciente: reshuespedPaciente.data.parentesco_paciente,
    };

    setPaciente(paciente);
    //setChangePaciente(paciente);

    /*

    if (!resReservacion|| resReservacion.status < 200 || resReservacion.status >= 300) {
      // mostrar mensaje de error
      navigate("/error404");
      return;
    }

    const h = resHuesped.data;

    const resPersona = await PersonaApi.getPersonaRequest(h.id_persona);

    if (!resPersona || resPersona.status < 200 || resPersona.status >= 300) {
      // mostrar mensaje de error
      navigate("/error404");
      return;
    }

    const p = { ...h, ...resPersona.data };

    setCurrentPath("/ Huesped / " + p.primer_nombre + " " + p.primer_apellido);

    // const resReservacion =
    //  await ReservacionesApi.getReservacionByIdHuespedActivoRequest(idHuesped);

    if (
      !resReservacion ||
      resReservacion.status < 200 ||
      resReservacion.status >= 300
    ) {
      navigate("/error404");
      return;
    }

    // Hay que encontra la habitacion en la que esta

    const resCama = await CamaApi.getCamaRequest(resReservacion.data.id_cama);

    if (!resCama || resCama.status < 200 || resCama.status >= 300) {
      navigate("/error404");
      return;
    }

    const cama = resCama.data;

    const huespedCompleto = {
      ...p,
      ...resReservacion.data,
      id_habitacion: cama.Habitacion.id_habitacion,
    };

    setChangeHuesped(huespedCompleto);
    setHuesped(huespedCompleto);

    */
  };

  // ----------------- handlers
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
  const handleGuardarPaciente = () => {
    console.log("Guardando Paciente");

    setIsEditablePaciente(false);
  };

  const handleCancelarPaciente = () => {
    setChangePaciente(paciente);
    setIsEditablePaciente(false);
  };

  // Reservacion (dormitorio, cama y fechas)
  const handleGuardarReservacion = () => {
    console.log("Guardando Reservacion");

    setIsEditableReservacion(false);
  };

  const handleCancelarReservacion = () => {
    setChangeHuesped(huesped);
    setIsEditableReservacion(false);
  };

  const handleDarDeAlta = () => {
    console.log("Dar de alta");
  };

  const handleListaNegra = () => {
    console.log("Mandar a lista negra");
  };

  // -------------------- efectos

  useEffect(() => {
    const loadingData = async () => {
      await loadInformacion();
    };

    loadingData();
  }, [ListaSolicitud.id_lista_solicitud]);

  // Botones para editar la informacion
  const renderAcciones = (
    isEditable,
    setIsEditable,
    handleGuardar,
    handleCancelar
  ) => {
    return (
      <Card style={{ marginTop: 10 }} className="shadow-#1 ">
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
      <Flex vertical className="w-full">
        <Flex justify="space-between" align="center">
          <h1 className="text-xl font-bold text-white-800">Huesped</h1>

          <Flex align="center" gap="small" className="mr-5">
            <div className="bg-blue-500 py-3 px-5 text-lg rounded-md text-white-100 shadow-lg">
              {huesped.becada ? "Becada" : "No es Becada"}
            </div>
            <div className="bg-green-500 py-3 px-5 text-lg rounded-md text-white-100 shadow-lg">
              {huesped.reingreso ? "Regingreso" : "Nuevo"}
            </div>
          </Flex>
        </Flex>
        {Object.keys(huesped).length > 0 && (
        <InformacionPersonal
          className="w-full"
          user={huesped}
          changeUser={changeHuesped}
          isEditable={isEditableHuesped}
          handleSetChangeUser={handleSetChangeHuesped}
        />
        )}
        
      </Flex>
    );
  };

  const renderAcompanante = () => {
    if (acompanante.dni)
      return (
        <Flex vertical style={{ marginTop: 40 }}>
          <Flex justify="space-between" align="center">
            <h1 className="text-xl font-bold text-white-800">Acompañante</h1>
          </Flex>
          {Object.keys(acompanante).length > 0 && (
          <InformacionPersonal
            user={acompanante}
            changeUser={changeAcompanante}
            isEditable={isEditableAcompanante}
            handleSetChangeUser={handleSetChangeAcompanante}
          />
          )}
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
        {Object.keys(paciente).length > 0 && (
        <InformacionPersonal
          user={paciente}
          changeUser={changePaciente}
          isEditable={isEditablePaciente}
          handleSetChangeUser={handleSetChangePaciente}
        />
        )}
        {Object.keys(paciente).length > 0 && (
        <InformacionPaciente
          user={paciente}
          changePaciente={changePaciente}
          isEditable={isEditablePaciente}
          handleSetChangeUser={handleSetChangePaciente}
        />
        )}
      </Flex>
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
    return (
      <Flex vertical style={{ marginTop: 40 }}>
        <Flex justify="space-between" align="center">
          <h1 className="text-xl font-bold text-white-800">Ofrendas</h1>
        </Flex>

        <OfrendasHuesped dataSource={ofrendas} />
      </Flex>
    );
  };

  return (
    <Flex className="w-full" gap={"large"} vertical>
      {renderHuesped()}

      

      {renderPaciente()}
 

     

    </Flex>
  );
}

export default HuespedSolicitud;
