import React, { useEffect, useState, useRef} from "react";
import { saveAs } from "file-saver";

import CountryMap from "../../components/Mapa";

import { Card, Col, Row, Modal } from 'antd';
import { useLayout } from '../../context/LayoutContext';
import { UserOutlined, HomeOutlined, DiffOutlined } from '@ant-design/icons'; // Import icons from Ant Design
import axiosInstance from '../../api/axiosInstance';
import HondurasIcon from "../../../src/assets/honduras.png";
//import gtMap from '../../assets/gt.svg';
//import svMap from '../../assets/sv.svg';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SalidasModal from "../../components/Tablas/salidasProximasModal"; // Import the SalidasModal component
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

  
  //const { pais, lugar } = useLayout();
  //const [lugar, setLugar] = useState({ id_lugar: 1 });
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
      console.log('Pais recibido:', pais);

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
        console.log('Departamentos registrados:', DRResponse.data);
      }

      setDeptoTot(pais.current.total_departamentos);
    } catch (error) {
      console.error("Error al conseguir info:", error);
    }
  };

  fetchData();
}, [setCurrentPath]);

  const handleGetDownloadExcelRequest = async () => {
    try {
      const response = await axiosInstance.get("downloadExcel", {
        responseType: "blob", 
      });

   
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Reporte.xlsx"); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const downloadExcelFile = async () => {
    handleGetDownloadExcelRequest();
    console.log("WENO");
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 pt-10">
      <Row gutter={16} className="w-full">
        <Col span={8}>
          <Card
            title="Huespedes activos"
            bordered={false}
            headStyle={{ color: "white" }}
            style={{
              backgroundColor: "#9AD9B5",
              color: "white",
              width: "100%",
              height: 172,
            }}
          >
            <div className="flex items-center" style={{ fontSize: "55px" }}>
              {activeHuespedes}
              <UserOutlined
                style={{
                  fontSize: "65px",
                  marginRight: "10px",
                  marginLeft: "50px",
                }}
              />
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="Personas beneficiadas"
            bordered={false}
            headStyle={{ color: "white" }}
            style={{
              backgroundColor: "#9AD9B5",
              color: "white",
              width: "100%",
              height: 172,
            }}
          >
            <div className="flex items-center" style={{ fontSize: "55px" }}>
              {personasBeneficiadas}
              <HomeOutlined
                style={{
                  fontSize: "65px",
                  marginRight: "10px",
                  marginLeft: "50px",
                }}
              />
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="Disponibilidad"
            bordered={false}
            headStyle={{ color: "white" }}
            style={{
              backgroundColor: "#9AD9B5",
              color: "white",
              width: "100%",
              height: 172,
            }}
          >
            <div className="flex items-center" style={{ fontSize: "55px" }}>
              {camasDisponibles}/{numeroCamas}
              <HomeOutlined
                style={{
                  fontSize: "65px",
                  marginRight: "10px",
                  marginLeft: "50px",
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="w-sm mt-4 mr-4">
        <Col span={8} offset={0}>
          <Card
            title="Departamentos Alcanzados"
            bordered={false}
            headStyle={{ color: "white" }}
            style={{
              backgroundColor: "#049DBF",
              color: "white",
              width: 500,
              marginRight: 5,
              height: 207,
            }}
          >
            <div className="flex items-center " style={{ fontSize: "55px" }}>
              {departamentosRegistrados + "/" + departamentosTotales}

              {/* Reemplazamos la imagen por el mapa */}
              <div
                className="flex items-center"
                style={{
                  width: "230px",
                  height: "130px",
                  marginRight: "10px",
                 display: "flex",
                  justifyContent: "center",
                  marginLeft: "100px",
                  marginTop: "-15px",
                  overflow: "hidden",
                  borderRadius: "12px",
                }}
              >
              {pais.current?.nombre === "HONDURAS" ? (
                <img
                src={HondurasIcon}
                alt="Honduras Icon"
                style={{
                  width: "230px",
                  height: "130px",
                  marginLeft: "10px",
                  marginTop: "-15px",
                }}
              />
              ) : (
                <CountryMap countryName={pais.current?.nombre || ''} />
              )}
              </div>
            </div>
          </Card>
        </Col>

        <Col span={6} offset={4}>
          <Card
            title="Próximos a salir"
            bordered={false}
            headStyle={{ color: "white" }}
            style={{
              backgroundColor: "#049DBF",
              color: "white",
              marginLeft: 5,
              width: 540,
              height: 207,
            }}
          >
            <div>
              {proximosASalir.map((item, index) => (
                <div key={index} style={{ fontSize: "18px" }}>
                  {item.nombre} -{" "}
                  {dayjs(item.fecha_salida).format(displayDateFormat)}
                </div>
              ))}
              <div
                style={{
                  marginTop: "10px",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
                onClick={handleOpenModal}
              >
                Ir a tabla &gt;
              </div>
            </div>
          </Card>
        </Col>
      </Row>
{/*         Exportar quitado
      <Row gutter={16} className="w-full mt-4">
        <Col span={8} offset={0}>
            title={
              <button>
                <div>
                  <span
                    onClick={downloadExcelFile}
                    style={{ marginRight: "10px" }}
                  >
                    Exportar a Excel
                  </span>
                  <DiffOutlined
                    style={{ fontSize: "24px", verticalAlign: "middle" }}
                    onClick={downloadExcelFile}
                  />
                </div>
              </button>
            }
            bordered={false}
            headStyle={{ color: "white" }}
            style={{
              backgroundColor: "#FA8787",
              color: "white",
              width: 1096,
              height: 47,
            }}
        </Col>
      </Row>
*/}
      <SalidasModal 
        isVisible={isModalVisible} 
        handleClose={handleCloseModal}
        id_lugar={idlugar}
      />
    </div>
  );
}

export default App;