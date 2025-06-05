import React, { useEffect, useState, useRef } from "react";
import { saveAs } from "file-saver";
import { Card, Col, Row, Modal } from 'antd';
import { useLayout } from '../../context/LayoutContext';
import { UserOutlined, HomeOutlined, DiffOutlined, GlobalOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import HondurasIcon from "../../../src/assets/honduras.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomCountryMap from "../../components/Mapa";
import SalidasModal from "../../components/Tablas/salidasProximasModal";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PersonApi from "../../api/Persona.api";
import UserApi from "../../api/User.api";
import { getUserFromToken } from "../../utilities/auth.utils";

dayjs.extend(customParseFormat);

const displayDateFormat = "DD-MM-YYYY";
const formatDate = (date) => {
  return dayjs(date).format(displayDateFormat);
};

function App() {
  const { setCurrentPath } = useLayout();
  const [activeHuespedes, setActiveHuespedes] = useState(0);
  const [personasBeneficiadas, setPersonasBeneficiadas] = useState(0);
  const [camasDisponibles, setCamasDisponibles] = useState(0);
  const [numeroCamas, setNumeroCamas] = useState(0);
  const [proximosASalir, setProximosASalir] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [departamentosRegistrados, setDepartamentosRegistrados] = useState([]);
  const [departamentosTotales, setDeptoTot] = useState(0);
  const pais = useRef();
  const [idlugar, setLugar] = useState(null);

  useEffect(() => {
    setCurrentPath("/ Inicio");

    const fetchData = async () => {
      try {
        const userToken = getUserFromToken();
        const userProp = await UserApi.getUserRequest(userToken.userId);
        const personaId = userProp.data.id_persona;

        const resUser = await PersonApi.getPersonaRequest(personaId);
        const lugar = resUser.data.id_lugar;
        setLugar(lugar);

        const paisResponse = await axiosInstance.get(`/personas/${personaId}/pais`);
        pais.current = paisResponse.data; 

        const activeHuespedesResponse = await axiosInstance.get('active-huespedes', { params: { id_lugar: lugar } });
        setActiveHuespedes(activeHuespedesResponse.data.activeHuespedesCount);

        const personasBeneficiadasResponse = await axiosInstance.get('personas-beneficiadas', { params: { id_lugar: lugar } });
        setPersonasBeneficiadas(personasBeneficiadasResponse.data.personasBeneficiadasCount);

        const camasDisponiblesResponse = await axiosInstance.get('camas-disponibles', { params: { id_lugar: lugar } });
        setCamasDisponibles(camasDisponiblesResponse.data.camasDisponiblesCount);

        const numeroCamasResponse = await axiosInstance.get('numero-camas', { params: { id_lugar: lugar } });
        setNumeroCamas(numeroCamasResponse.data.numeroCamasCount);

        const proximosASalirResponse = await axiosInstance.get(`top3-salidas/${lugar}`);
        setProximosASalir(proximosASalirResponse.data);

        if (paisResponse.data && paisResponse.data.id_pais) {
          const DRResponse = await axiosInstance.get(`/departamentos_registrados/${pais.current.id_pais}`);
          setDepartamentosRegistrados(DRResponse.data);
        }

        setDeptoTot(pais.current.total_departamentos);
      } catch (error) {
        console.error("Error al conseguir info:", error);
      }
    };

    fetchData();
  }, [setCurrentPath]);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="bg-gray-100 p-4 md:p-10">
      {/* Primera fila de tarjetas */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Card
            title="Huespedes activos"
            bordered={false}
            headStyle={{ color: "white" }}
            className="h-full"
            style={{
              backgroundColor: "#9AD9B5",
              color: "white",
              minHeight: "172px"
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-4xl md:text-5xl">{activeHuespedes}</span>
              <UserOutlined className="text-5xl md:text-6xl" />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Card
            title="Personas beneficiadas"
            bordered={false}
            headStyle={{ color: "white" }}
            className="h-full"
            style={{
              backgroundColor: "#9AD9B5",
              color: "white",
              minHeight: "172px"
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-4xl md:text-5xl">{personasBeneficiadas}</span>
              <HomeOutlined className="text-5xl md:text-6xl" />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            title="Disponibilidad"
            bordered={false}
            headStyle={{ color: "white" }}
            className="h-full"
            style={{
              backgroundColor: "#9AD9B5",
              color: "white",
              minHeight: "172px"
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-4xl  md:text-5xl">{camasDisponibles}/{numeroCamas}</span>
              <HomeOutlined className="text-5xl md:text-6xl" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Segunda fila de tarjetas */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={12} xl={12}>
          <Card
            title={<h3 className="text-md m-0">Departamentos Alcanzados</h3>}
            bordered={false}
            headStyle={{ color: "white" }}
            className="h-full"
            style={{
              backgroundColor: "#049DBF",
              color: "white",
              minHeight: "230px"
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between h-full">
              <span className="text-4xl md:text-5xl font-bold ml-14 mb-4 md:mb-0 text-grey-10 drop-shadow-sm ">
                {departamentosRegistrados}/{departamentosTotales}
              </span>
              <div className="w-full md:w-1/2 h-32 md:h-40 flex items-center overflow-hidden rounded-lg">
              {pais.current?.nombre === "HONDURAS" || pais.current?.nombre === "GUATEMALA" || pais.current?.nombre === "EL SALVADOR"? (
                <CustomCountryMap className="w-full" countryName={pais.current?.nombre || ''} />
              ) : (
                <GlobalOutlined className="ml-5 text-[120px] text-white opacity-80" />
              )
              }
            </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={12} xl={12}>
          <Card
            title={
              <div className="flex justify-between items-center w-full">
                <h3 className="text-md m-0">Próximos a salir</h3>
                <button
                  className="font-medium flex items-center gap-1 transition-colors hover:underline"
                  style={{ color: "white" }}
                  onClick={handleOpenModal}
                >
                  Mostrar más
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            }
            bordered={false}
            headStyle={{ color: "white" }}
            className="h-full"
            style={{
              backgroundColor: "#049DBF",
              color: "white",
              minHeight: "230px"
            }}
          >
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
              {proximosASalir.length === 0 ? (
                <div className="text-center text-white-500 text-extrabold">
                  No hay personas hospedándose actualmente.
                </div>
              ) : (
                proximosASalir.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded transition-colors border-b"
                    style={{ borderColor: '#3ab7d1' }}
                  >
                    <span className="font-medium truncate max-w-[150px] md:max-w-[200px]">
                      {item.nombre}
                    </span>
                    <span className="text-sm">
                      {dayjs(item.fecha_salida).format(displayDateFormat)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <SalidasModal 
        isVisible={isModalVisible} 
        handleClose={handleCloseModal}
        id_lugar={idlugar}
      />
    </div>
  );
}

export default App;