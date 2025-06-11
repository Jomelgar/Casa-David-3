import React, { useState, useEffect } from "react";
import {
  Layout,
  DatePicker,
  Select,
  Input,
  Table,
  Spin,
  Card,
  Row,
  Col,
  Collapse,
  InputNumber,
  Button,
  ConfigProvider,
  Breadcrumb,         
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaFemale, FaMale, FaUsers } from "react-icons/fa";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getPacientesRequest } from "../../../api/Paciente.api";

import PaisApi from "../../../api/Pais.api";
import { getUserFromToken } from "../../../utilities/auth.utils";
import { validarPrivilegio } from "../../../utilities/validarUserLog";

dayjs.extend(customParseFormat);

const { Header, Content } = Layout;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const dateFormat = "YYYY/MM/DD";

function Pacientes() {

  // Estados principales
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtros avanzados
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState("all");
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [ocupaciones, setOcupaciones] = useState([]);
  const [causas, setCausas]           = useState([]);
  const [hospitales, setHospitales]   = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("all");
  const [selectedMunicipio, setSelectedMunicipio] = useState("all");
  const [selectedOcupacion, setSelectedOcupacion] = useState("all");
const [selectedCausa, setSelectedCausa]         = useState("all");
const [selectedHospital, setSelectedHospital]   = useState("all");
  
  const [genero, setGenero] = useState("all");
  const [edadDesde, setEdadDesde] = useState("");
  const [edadHasta, setEdadHasta] = useState("");
  const [fechas, setFechas] = useState([dayjs(), dayjs()]);

  // Estadísticas
  const [totalFemeninos, setTotalFemeninos] = useState(0);
  const [totalMasculinos, setTotalMasculinos] = useState(0);
  const [totalPacientes, setTotalPacientes] = useState(0);

  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString());
    const [fechaFinal, setFechaFinal] = useState(new Date().toISOString());

// Opciones de género (filter)
const generos = [
  { value: "all", label: "Todos los Géneros" },
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
];


// Control del RangePicker
const onChange = (dates, dateStrings) => {
  setFechas(dates ?? [dayjs(), dayjs()]);
};

// Stub para el botón de exportar (si decidieras conservarlo)
const abrirModal = () => {
  console.log("Exportar Excel pulsado");
};

  // Carga de datos desde backend
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getPacientesRequest();
      const pacientes = res?.data || [];

      // Opciones de filtro
      const pais = await PaisApi.getPaisForTable();
      const listaPaises = pais.data.map((e) => ({
        value: e.nombre,
        label: e.nombre,
        }));
      listaPaises.unshift({
          value: "all",
          label: "Todos los Paises",
        });
      setPaises(listaPaises);

      // Departments y Municipios (ya tenías)
    const deps = [...new Set(pacientes.map(p => p.departamento).filter(Boolean))];
    setDepartamentos([
      { value: "all", label: "Todos los Departamentos" },
      ...deps.map(d => ({ value: d, label: d })),
    ]);
    const muns = [...new Set(pacientes.map(p => p.municipio).filter(Boolean))];
    setMunicipios([
      { value: "all", label: "Todos los Municipios" },
      ...muns.map(m => ({ value: m, label: m })),
    ]);

    // -------------------------------
    // 1) Opciones de Ocupaciones
    const occs = [...new Set(pacientes.map(p => p.ocupacion).filter(Boolean))];
    setOcupaciones([
      { value: "all", label: "Todas las Ocupaciones" },
      ...occs.map(o => ({ value: o, label: o })),
    ]);

    // 2) Opciones de Causas
    const causasSet = [...new Set(pacientes.map(p => p.causa).filter(Boolean))];
    setCausas([
      { value: "all", label: "Todas las Causas" },
      ...causasSet.map(c => ({ value: c, label: c })),
    ]);

    // 3) Opciones de Hospitales
    const hospSet = [...new Set(pacientes.map(p => p.hospital).filter(Boolean))];
    setHospitales([
      { value: "all", label: "Todos los Hospitales" },
      ...hospSet.map(h => ({ value: h, label: h })),
    ]);
    // -------------------------------

    // Filtrado
    const filtrado = pacientes.filter(p => {
       if (selectedPais !== "all" && p.pais !== selectedPais) return false;
      if (selectedDepartamento !== "all" && p.departamento !== selectedDepartamento) return false;
      if (selectedMunicipio  !== "all" && p.municipio   !== selectedMunicipio)  return false;
      if (genero             !== "all" && p.genero      !== genero)             return false;

      // Nuevo: filtro por ocupación, causa y hospital
      if (selectedOcupacion !== "all" && p.ocupacion !== selectedOcupacion) return false;
      if (selectedCausa      !== "all" && p.causa      !== selectedCausa)      return false;
      if (selectedHospital   !== "all" && p.hospital   !== selectedHospital)   return false;

      if (
        fechas?.length === 2 &&
        p.fechaEntrada &&
        dayjs(p.fechaEntrada).isValid() &&
        !dayjs(p.fechaEntrada).isBetween(
          dayjs(fechas[0]).startOf("day"),
          dayjs(fechas[1]).endOf("day"),
          "day",
          "[]"
        )
      ) {
        return false;
      }
      if (edadDesde && p.edad < Number(edadDesde)) return false;
      if (edadHasta && p.edad > Number(edadHasta)) return false;
      return true;
    });

    setDataSource(filtrado.map((p, idx) => ({ ...p, key: p.id ?? idx })));
    setTotalFemeninos(filtrado.filter(p => p.genero === "FEMENINO").length);
    setTotalMasculinos(filtrado.filter(p => p.genero === "MASCULINO").length);
    setTotalPacientes(filtrado.length);
  } catch (error) {
    console.error("Error cargando pacientes:", error);
  }
  setLoading(false);
};

  // Efecto de carga
  useEffect(() => {
    loadData();
  }, [selectedPais, selectedDepartamento, selectedMunicipio, genero, edadDesde, edadHasta, fechas]);

  // Columnas de tabla
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

 const renderPaisFilter = () => {
     if (!validarPrivilegio(getUserFromToken(), 11)) return null;
     
       return (
        <Col flex={"100%"} >
          <Select
            style={{ width: "100%", height: "100%", fontSize: "16px" }}
            showSearch
            value={selectedPais}
            onChange={(value) => {
              setSelectedPais(value);
            }}
            placeholder="Pais"
            size="large"
            options={paises}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Col>
       );
   }

  // Filtros avanzados
 const renderFiltros = () => (
  <ConfigProvider
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
        borderRadius: 8,
        marginTop: 30,
        marginBottom: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Panel header="Filtros Avanzados" key="1">
        <Row gutter={[16, 16]}>
          {renderPaisFilter()}
          {/* Departamento */}
          <Col span={12}>
            <Select
              showSearch
              optionFilterProp="label"
              style={{ width: "100%" }}
              value={selectedDepartamento}
              onChange={setSelectedDepartamento}
              placeholder="Todos los Departamentos"
              size="large"
              options={departamentos}
            />
          </Col>

          {/* Municipio */}
          <Col span={12}>
            <Select
              showSearch
              optionFilterProp="label"
              style={{ width: "100%" }}
              value={selectedMunicipio}
              onChange={setSelectedMunicipio}
              placeholder="Todos los Municipios"
              size="large"
              options={municipios}
            />
          </Col>

          {/* Género */}
          <Col span={12}>
            <Select
              style={{ width: "100%" }}
              value={genero}
              onChange={setGenero}
              options={generos}
              placeholder="Todos los Géneros"
            />
          </Col>

          {/* Ocupación (placeholder, si luego agregas opciones reales) */}
          <Col span={12}>
  <Select
    showSearch
    optionFilterProp="label"
    style={{ width: "100%" }}
    value={selectedOcupacion}
    onChange={setSelectedOcupacion}
    options={ocupaciones}
    placeholder="Todas las Ocupaciones"
  />
</Col>

          {/* Hospital (placeholder) */}
          <Col span={12}>
  <Select
    showSearch
    optionFilterProp="label"
    style={{ width: "100%" }}
    value={selectedHospital}
    onChange={setSelectedHospital}
    options={hospitales}
    placeholder="Todos los Hospitales"
  />
</Col>

          {/* Causa (placeholder) */}
          <Col span={12}>
  <Select
    showSearch
    optionFilterProp="label"
    style={{ width: "100%" }}
    value={selectedCausa}
    onChange={setSelectedCausa}
    options={causas}
    placeholder="Todas las Causas"
  />
</Col>

          {/* Edad desde */}
          <Col span={12}>
            <label><b>Edad desde:</b></label>
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              value={edadDesde}
              onChange={setEdadDesde}
            />
          </Col>

          {/* Edad hasta */}
          <Col span={12}>
            <label><b>Edad hasta:</b></label>
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              value={edadHasta}
              onChange={setEdadHasta}
            />
          </Col>
        </Row>
      </Panel>
    </Collapse>
  </ConfigProvider>
);


  // Render principal
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
             onChange={onChange}
             format={dateFormat}
           />
         </Header>
 
         {renderFiltros()}
 
         <Content style={{ margin: "0 16px" }}>
           <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
           <Row gutter={16} className="mb-4">
  {/* Pacientes Femeninos */}
  <Col span={8}>
    <Card
      title={
        <span style={{ display: "flex", alignItems: "center" }}>
          Pacientes Femeninos <FaFemale style={{ marginLeft: 8 }} />
        </span>
      }
      bordered={false}
      headStyle={{ color: "white", fontSize: 30 }}
      style={{ backgroundColor: "#fcb4b4", color: "white", fontSize: 30 }}
    >
      <div>Cantidad: {totalFemeninos}</div>
    </Card>
  </Col>

  {/* Pacientes Masculinos */}
  <Col span={8}>
    <Card
      title={
        <span style={{ display: "flex", alignItems: "center" }}>
          Pacientes Masculinos <FaMale style={{ marginLeft: 8 }} />
        </span>
      }
      bordered={false}
      headStyle={{ color: "white", fontSize: 30 }}
      style={{ backgroundColor: "#8ce4f3", color: "white", fontSize: 30 }}
    >
      <div>Cantidad: {totalMasculinos}</div>
    </Card>
  </Col>

  {/* Total Pacientes */}
  <Col span={8}>
    <Card
      title={
        <span style={{ display: "flex", alignItems: "center" }}>
          Total Pacientes <FaUsers style={{ marginLeft: 8 }} />
        </span>
      }
      bordered={false}
      headStyle={{ color: "white", fontSize: 30 }}
      style={{ backgroundColor: "#74dca4", color: "white", fontSize: 30 }}
    >
      <div>Cantidad: {totalPacientes}</div>
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
    
 
         </Content>
       </Layout>
     );
   };

  // Retorno condicional de carga
  return loading ? (
    <div className="flex items-center justify-center h-full">
      <Spin size="large" />
    </div>
  ) : (
    render()
  );
}

export default Pacientes;