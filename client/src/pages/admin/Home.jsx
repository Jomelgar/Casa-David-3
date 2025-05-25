import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";

import { Card, Col, Row, Modal } from 'antd';
import { useLayout } from '../../context/LayoutContext';
import { UserOutlined, HomeOutlined, DiffOutlined } from '@ant-design/icons'; // Import icons from Ant Design
import axiosInstance from '../../api/axiosInstance';
import HondurasIcon from "../../../src/assets/honduras.png";
import SalidasModal from "../../components/Tablas/salidasProximasModal"; // Import the SalidasModal component
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
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

  useEffect(() => {

    const fetchData = async () => {
      try {
        const activeHuespedesResponse = await axiosInstance.get('active-huespedes');
        setActiveHuespedes(activeHuespedesResponse.data.activeHuespedesCount);

        const personasBeneficiadasResponse = await axiosInstance.get('personas-beneficiadas');
        setPersonasBeneficiadas(personasBeneficiadasResponse.data.personasBeneficiadasCount);

        const camasDisponiblesResponse = await axiosInstance.get('camas-disponibles');
        setCamasDisponibles(camasDisponiblesResponse.data.camasDisponiblesCount);

        const numeroCamasResponse = await axiosInstance.get('numero-camas');
        setNumeroCamas(numeroCamasResponse.data.numeroCamasCount);

        const proximosASalirResponse = await axiosInstance.get('top3-salidas');
        setProximosASalir(proximosASalirResponse.data);

        const DRResponse = await axiosInstance.get('departamentos-registrados');
        setDepartamentosRegistrados(DRResponse.data);
        console.log(DRResponse);
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

      <Row gutter={16} className="w-full mt-4">
        <Col span={8} offset={0}>
          <Card
            title="Departamentos Alcanzados"
            bordered={false}
            headStyle={{ color: "white" }}
            style={{
              backgroundColor: "#049DBF",
              color: "white",
              width: 540,
              height: 207,
            }}
          >
            <div className="flex items-center" style={{ fontSize: "55px" }}>
              {departamentosRegistrados + "/18"}

              <img
                src={HondurasIcon}
                alt="Honduras Icon"
                style={{
                  width: "230px",
                  height: "130px",
                  marginRight: "10px",
                  marginLeft: "100px",
                  marginTop: "-15px",
                }}
              />
            </div>
          </Card>
        </Col>

        <Col span={8} offset={4}>
          <Card
            title="Próximos a salir"
            bordered={false}
            headStyle={{ color: "white" }}
            style={{
              backgroundColor: "#049DBF",
              color: "white",
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

      <Row gutter={16} className="w-full mt-4">
        <Col span={8} offset={0}>
          <Card
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
          />
        </Col>
      </Row>

      <SalidasModal isVisible={isModalVisible} handleClose={handleCloseModal} />
    </div>
  );
}

export default App;
