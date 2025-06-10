import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Layout,
  Breadcrumb,
  DatePicker,
  Input,
  Table,
  Button,
  Spin,
  ConfigProvider,
  Select,
  Collapse,
  InputNumber
} from "antd";
import { getPacienteAndPersonaForTabla } from "../../../api/Paciente.api";
import { FaFemale, FaMale, FaUsers } from "react-icons/fa";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "../../../api/axiosInstance";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BiDollar, BiDonateHeart, BiMoney } from "react-icons/bi";
import OfrendasApi from "../../../api/Ofrenda.api";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import PatronoApi from "../../../api/Patrono.api";

import ProcedenciaApi from "../../../api/Procedencia.api";
import { getDepartamentos, getDepartamentoById } from '../../../api/departamentoApi';
import { getMunicipiosByDepartamentoId, getMunicipioById } from '../../../api/municipioApi';

import { useLayout } from "../../../context/LayoutContext";
import PopUpExport from "./PopUpsInformes/PopUpExport";

dayjs.extend(customParseFormat);

const { Panel } = Collapse;
const dateFormat = "YYYY/MM/DD";
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

function Pacientes() {
  const[exportVisible, setExportVisible] = useState(false);
  
  const { setCurrentPath } = useLayout();

  const abrirModal  = () => {
    setExportVisible(true); 
  };

  const exportarExcel = async (tasa, moneda) => {
    
    const donacionesConvertidas = totalDonacion * tasa;
    const becasConvertidas = totalBeca * tasa;
    const pagosConvertidos = dataSource.map(pago => ({
      ...pago,
      monto: (parseFloat(pago.monto) * tasa).toFixed(2),
    }));
    
    const data = {
      donaciones: donacionesConvertidas.toFixed(2),
      cortesia: becasConvertidas.toFixed(2),
      datosPagos: pagosConvertidos,
      moneda: moneda,
    };
    console.log(tasa, moneda);
    console.log(data);

    const res = await axiosInstance.post("/excelPagosGenerales", data, { responseType: "arraybuffer" });

    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_Pagos_${fechaInicio}_${fechaFinal}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const columns = [
  {
    title: "Paciente",
    dataIndex: "nombre",
    key: "nombre",
    sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-5">
        <Input
          autoFocus
          placeholder="Buscar paciente"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          onBlur={() => confirm()}
          style={{ marginBottom: 5 }}
        />
        <Button className="buscar_button" onClick={() => confirm()}>Buscar</Button>
        <Button className="delete_button" onClick={() => clearFilters()} type="danger">Borrar</Button>
      </div>
    ),
    filterIcon: () => <SearchOutlined />,
    onFilter: (value, record) => record.nombre.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Hospital",
    dataIndex: "hospital",
    key: "hospital",
    sorter: (a, b) => a.hospital.localeCompare(b.hospital),
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-5">
        <Input
          autoFocus
          placeholder="Buscar hospital"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          onBlur={() => confirm()}
          style={{ marginBottom: 5 }}
        />
        <Button className="buscar_button" onClick={() => confirm()}>Buscar</Button>
        <Button className="delete_button" onClick={() => clearFilters()} type="danger">Borrar</Button>
      </div>
    ),
    filterIcon: () => <SearchOutlined />,
    onFilter: (value, record) => record.hospital.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Género",
    dataIndex: "genero",
    key: "genero",
    render: (genero) => <p>{genero === "MASCULINO" ? "MASCULINO" : "FEMENINO"}</p>,
    filters: [
      { text: "MASCULINO", value: "MASCULINO" },
      { text: "FEMENINO", value: "FEMENINO" },
    ],
    onFilter: (value, record) => record.genero === value,
  },
  {
    title: "Edad",
    dataIndex: "edad",
    key: "edad",
    sorter: (a, b) => a.edad - b.edad,
  },
  {
    title: "Acciones",
    key: "acciones",
    render: () => <Button>👁️</Button>,
  },
];



  const [becados, setBecados] = useState([]);
  const [donacions, setDonacions] = useState([]);
  const { userLog } = useLayout();
  const [totalBeca, setTotalBeca] = useState(0.0);
  const [totalDonacion, setTotalDonacion] = useState(0.0);

  const [procedencia, setProcedencia] = useState(-1);
  const [patrono, setPatrono] = useState(-1);

  const [genero, setGenero] = useState(-1);

  const [patronos, setPatronos] = useState([]);
  const [procedencias, setProcedencias] = useState([]);
  const [generos, setGeneros] = useState([
    { value: -1, label: "Todos los Generos" },
    { value: 1, label: "Masculino" },
    { value: 2, label: "Femenino" },
  ]);

  const [searchProcedencia, setSearchProcedencia] = useState("");
  const [searchPatrono, setSearchPatrono] = useState("");

  const [loading, setLoading] = useState(false);

  const [departamentos, setDepartamentos] = useState([]);
  const [searchDepartamento, setSearchDepartamento] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState(-1);
  const [municipios, setMunicipios] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState(-1);
  const [searchMunicipio, setSearchMunicipio] = useState("");


  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString());
  const [fechaFinal, setFechaFinal] = useState(new Date().toISOString());

  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [totalFemeninos, setTotalFemeninos] = useState(0);
const [totalMasculinos, setTotalMasculinos] = useState(0);
const [totalPacientes, setTotalPacientes] = useState(0);


  const loadProcedencias = async () => {
    try {
      const response = await ProcedenciaApi.getProcedenciasRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las procedencias");
      }

      if (response.status === 201) {
        const data = response.data.map((e) => ({
          value: e.id_procedencia,
          label: e.departamento + ", " + e.municipio,
        }));

        data.unshift({ value: -1, label: "Todas las Procedencias" });

        setProcedencias(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadPatronos = async () => {
    try {
      const response = await PatronoApi.getPatronosRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los patronos");
      }

      if (response.status === 201) {
        const data = response.data.map((e) => ({
          value: e.id_patrono,
          label: e.nombre,
        }));

        data.unshift({ value: -1, label: "Todos los Patronos" });

        setPatronos(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  ////                       CAMNBIOSSSSSSSSSSSSSSSSSSSSSSSSSS
  const loadDepartamentos = async () => {
    try {
      const response = await getDepartamentos();
      setDepartamentos([{ value: -1, label: "Todos los Departamentos" }, ...response.map(d => ({ value: d.departamento_id, label: d.nombre }))]);
    } catch (error) {
      console.error("Error fetching departamentos:", error);
    }
  };

  const loadMunicipios = async (departamentoId) => {
    try {
      const response = await getMunicipiosByDepartamentoId(departamentoId);
      setMunicipios([{ value: -1, label: "Todos los Municipios" }, ...response.map(m => ({ value: m.municipio_id, label: m.nombre }))]);
    } catch (error) {
      console.error("Error fetching municipios:", error);
    }
  };

  useEffect(() => {
    loadDepartamentos();
    loadPatronos();
  }, []);

  useEffect(() => {
    if (selectedDepartamento !== -1) {
      loadMunicipios(selectedDepartamento);
    } else {
      setMunicipios([{ value: -1, label: "Todos los Municipios" }]);
    }
    // Reiniciar municipio seleccionado al cambiar el departamento
    setSelectedMunicipio(-1);
  }, [selectedDepartamento]);
  
  const compararPatrono = (ofrenda) => {
    if (ofrenda.Reservacion.AfiliadoReservacions[0]) {
      return (
        ofrenda.Reservacion.AfiliadoReservacions[0].Afiliado.PatronoAfiliados[0]
          .id_p === patrono
      );
    }

    return false;
  };
  const loadData = async () => {
    setLoading(true);
  
    const data = [];
  
    const reponseDonaciones = await OfrendasApi.getOfrendasDonaciones(
      fechaInicio,
      fechaFinal
    );
  
    if (
      !reponseDonaciones &&
      reponseDonaciones.status < 200 &&
      reponseDonaciones.status >= 300
    ) {
      setLoading(false);
      return;
    }
  
    let donaciones =
      reponseDonaciones.data.donacion.filter(
        (ofrenda) =>
          ofrenda.Reservacion.Cama.Habitacion.id_lugar === userLog.id_lugar
      ) || [];
  
    if (genero !== -1) {
      donaciones = donaciones.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.genero ===
          (genero === 1 ? "MASCULINO" : "FEMENINO")
      );
    }
  
    // Obtener los municipios y departamentos para las personas
    const personasyProcedencia = await Promise.all(
      donaciones.map(async (ofrenda) => {
        const municipioId = ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.municipio_id;
        if (!municipioId) {
          console.error('Municipio ID is undefined for ofrenda:', ofrenda);
          return ofrenda;
        }
        const municipio = await getMunicipioById(municipioId);
        const departamento = await getDepartamentoById(municipio.departamento_id);
        return {
          ...ofrenda,
          Reservacion: {
            ...ofrenda.Reservacion,
            PacienteHuesped: {
              ...ofrenda.Reservacion.PacienteHuesped,
              Huesped: {
                ...ofrenda.Reservacion.PacienteHuesped.Huesped,
                Persona: {
                  ...ofrenda.Reservacion.PacienteHuesped.Huesped.Persona,
                  departamento_id: departamento.departamento_id,
                  municipio_id: municipio.municipio_id,
                },
              },
            },
          },
        };
      })
    );
  
    if (selectedDepartamento !== -1) {
      donaciones = personasyProcedencia.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.departamento_id ===
          selectedDepartamento
      );
    }
  
    if (selectedMunicipio !== -1) {
      donaciones = personasyProcedencia.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.municipio_id ===
          selectedMunicipio
      );
    }
  
    if (patrono !== -1) {
      donaciones = donaciones.filter(compararPatrono);
    }
  
    donaciones.forEach((ofrenda) => {
      data.push({
  key: ofrenda.id_ofrenda,
  nombre: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
    " " +
    ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_apellido,
  genero: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.genero,
  edad: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.edad,
  hospital: "Del Valle", 
});


    });
  
    const totalDonaciones = donaciones.reduce(
      (total, reservacion) => total + parseFloat(reservacion.valor),
      0
    );
  
    setTotalDonacion(totalDonaciones);
    setDonacions(donaciones);
  
    const responseBecados = await OfrendasApi.getOfrendasBecados(
      fechaInicio,
      fechaFinal
    );
  
    if (
      !responseBecados &&
      responseBecados.status < 200 &&
      responseBecados.status >= 300
    ) {
      setLoading(false);
      return;
    }
  
    console.log(responseBecados);
  
    let becados =
      responseBecados.data.becados.filter((ofrenda) =>
        ofrenda.Reservacion.Cama
          ? ofrenda.Reservacion.Cama.Habitacion.id_lugar === userLog.id_lugar
          : false
      ) || [];
  
    if (genero !== -1) {
      becados = becados.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.genero ===
          (genero === 1 ? "MASCULINO" : "FEMENINO")
      );
    }
  
    // Obtener los municipios y departamentos para las personas
    const becadosyProcedencia = await Promise.all(
      becados.map(async (ofrenda) => {
        const municipioId = ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.municipio_id;
        if (!municipioId) {
          console.error('Municipio ID is undefined for ofrenda:', ofrenda);
          return ofrenda;
        }
        const municipio = await getMunicipioById(municipioId);
        const departamento = await getDepartamentoById(municipio.departamento_id);
        return {
          ...ofrenda,
          Reservacion: {
            ...ofrenda.Reservacion,
            PacienteHuesped: {
              ...ofrenda.Reservacion.PacienteHuesped,
              Huesped: {
                ...ofrenda.Reservacion.PacienteHuesped.Huesped,
                Persona: {
                  ...ofrenda.Reservacion.PacienteHuesped.Huesped.Persona,
                  departamento_id: departamento.departamento_id,
                  municipio_id: municipio.municipio_id,
                },
              },
            },
          },
        };
      })
    );
  
    if (selectedDepartamento !== -1) {
      becados = becadosyProcedencia.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.departamento_id ===
          selectedDepartamento
      );
    }
  
    if (selectedMunicipio !== -1) {
      becados = becadosyProcedencia.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.municipio_id ===
          selectedMunicipio
      );
    }
  
    if (patrono !== -1) {
      becados = becados.filter(compararPatrono);
    }
  
    becados.forEach((ofrenda) => {
      data.push({
  key: ofrenda.id_ofrenda,
  nombre: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
    " " +
    ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_apellido,
  genero: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.genero,
  edad: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.edad,
  hospital: "Del Valle", 
});


    });
  
    const totalBecados = becados.reduce(
      (total, ofrenda) => total + parseFloat(ofrenda.valor),
      0
    );
  
    setTotalBeca(totalBecados);
    setBecados(becados);
setDataSource(data);

setTotalFemeninos(data.filter(p => p.genero === "FEMENINO").length);
setTotalMasculinos(data.filter(p => p.genero === "MASCULINO").length);
setTotalPacientes(data.length);

setLoading(false);

  };
  useEffect(() => {
    loadData();
  }, [fechaInicio, fechaFinal, genero, selectedDepartamento, selectedMunicipio, patrono]);

  

  // useEffect(() => {
  //   const total = becados.reduce((accumulator, becado) => accumulator + parseFloat(becado.valor), 0);
  //   setTotalBeca(total);
  // }, [becados]);

  // useEffect(() => {
  //   const total = donacions.reduce((accumulator, dona) => accumulator + parseFloat(dona.valor), 0);
  //   setTotalDonacion(total);
  // }, [donacions]);

  const onChange = (dates, dateStrings) => {
    if (dates) {
      const newFechaInicio = dateStrings[0];
      const newFechaFinal = dateStrings[1];
      setFechaInicio(newFechaInicio);
      setFechaFinal(newFechaFinal);
    }
  };

  const renderFiltros = () => {
  return (
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
      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        style={{
          background: "white",
          borderRadius: "8px",
          marginTop: "30px", 
          marginBottom: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
        }}
      >
        <Panel header="Filtros Avanzados" key="1">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                showSearch
                value={selectedDepartamento}
                onChange={(value) => setSelectedDepartamento(value)}
                placeholder="Todos los Departamentos"
                size="large"
                options={departamentos}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Col>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                showSearch
                value={selectedMunicipio}
                onChange={(value) => setSelectedMunicipio(value)}
                placeholder="Todos los Municipios"
                size="large"
                options={municipios}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Col>

            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                placeholder="Todos los Géneros"
                options={generos}
                value={genero}
                onChange={(e) => setGenero(e)}
              />
            </Col>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                placeholder="Todas las Ocupaciones"
                options={[{ value: -1, label: "Todas las Ocupaciones" }]}
              />
            </Col>

            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                placeholder="Todos los Hospitales"
                options={[{ value: -1, label: "Todos los Hospitales" }]}
              />
            </Col>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                placeholder="Todas las Causas"
                options={[{ value: -1, label: "Todas las Causas" }]}
              />
            </Col>

            <Col span={12}>
              <label><b>Edad desde:</b></label>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Col>
            <Col span={12}>
              <label><b>Edad hasta:</b></label>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </ConfigProvider>
  );
};


  const render = () => {
    return (
      <Layout>
        <Header
          style={{
            background: "#fff",
            color: "gray",
            fontSize: 20,
            padding: 5,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "right",
            borderRadius: 20,
          }}
        >
          <div>Fechas</div>
          <RangePicker
            defaultValue={[
              dayjs(fechaInicio, dateFormat),
              dayjs(fechaFinal, dateFormat),
            ]}
            style={{ color: "gray", fontSize: 20, alignItems: "center" }}
            onChange={(value) => setSelectedMunicipio(value)}
            format={dateFormat}
          />
        </Header>

        {renderFiltros()}

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
          <Row gutter={16}>
            <Col span={8}>
              <Card
  title={
    <span style={{ display: "flex", alignItems: "center" }}>
      Pacientes Femeninos <FaFemale style={{ marginLeft: 8 }} />
    </span>
  }
  bordered={false}
  style={{
    backgroundColor: "#fcb4b4",
    fontSize: 30,
    color: "white",
  }}
  headStyle={{ color: "white", fontSize: 30 }}
>
  <div>{totalFemeninos}</div>
</Card>

            </Col>
            <Col span={8}>
              <Card
  title={
    <span style={{ display: "flex", alignItems: "center" }}>
      Pacientes Masculinos <FaMale style={{ marginLeft: 8 }} />
    </span>
  }
  bordered={false}
  style={{
    backgroundColor: "#8ce4f3",
    fontSize: 30,
    color: "white",
  }}
  headStyle={{ color: "white", fontSize: 30 }}
>
  <div>{totalMasculinos}</div>
</Card>

            </Col>
            <Col span={8}>
              <Card
  title={
    <span style={{ display: "flex", alignItems: "center" }}>
      Total Pacientes <FaUsers style={{ marginLeft: 8 }} />
    </span>
  }
  bordered={false}
  style={{
    backgroundColor: "#74dca4",
    fontSize: 30,
    color: "white",
  }}
  headStyle={{ color: "white", fontSize: 30 }}
>
  <div>{totalPacientes}</div>
</Card>

            </Col>
          </Row>

          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#77D9A1",
                  cellFontSize: 18,
                  headerColor: "#FFFFFF",
                  colorText: "#3e3e3e",
                  headerSortActiveBg: "#5fae81",
                  headerSortHoverBg: "#5fae81",
                },
              },
            }}
          >
            <div className="mt-10">
              <Table
                responsive="true"
                scroll={{ x: true }}
                dataSource={dataSource}
                columns={columns}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  total: dataSource.length,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                  },
                  showSizeChanger: true,
                }}
              />
            </div>
          </ConfigProvider>
          <button onClick={abrirModal} className="bg-red-400 font-bold text-lg mt-12 rounded-md shadow pl-6 pr-8 h-fit py-4 text-white-100 text-start hover:-translate-y-2 transition-all ease-in-out duration-150">EXPORTAR A EXCEL</button>

        </Content>
      </Layout>
    );
  };

  return (
    <>
      {!loading ? (
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
      <PopUpExport
        visible={exportVisible}
        onConfirm={exportarExcel}
        onCancel={() => setExportVisible(false)}
      />
    </>
    
  );
}

export default Pacientes;
