import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  DatePicker,
  Select,
  Input,
  Table,
  Spin,
  ConfigProvider,
  Button,
} from "antd";
import dayjs from "dayjs";
import {
  ManOutlined,
  WomanOutlined,
  TeamOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getPacientesRequest } from "../../../api/Paciente.api";

const { RangePicker } = DatePicker;

export default function Pacientes() {
  // Estado de fechas
  const [fechas, setFechas] = useState([dayjs(), dayjs()]);
  // Filtros
  const [departamento, setDepartamento] = useState("all");
  const [municipio, setMunicipio] = useState("all");
  const [ocupacion, setOcupacion] = useState("all");
  const [causa, setCausa] = useState("all");
  const [hospital, setHospital] = useState("all");
  const [genero, setGenero] = useState("all");
  const [edadDesde, setEdadDesde] = useState("");
  const [edadHasta, setEdadHasta] = useState("");
  // Opciones selects
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [ocupaciones, setOcupaciones] = useState([]);
  const [causas, setCausas] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  // Pacientes y tabla
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Cargar datos
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getPacientesRequest();
      if (res?.data) {
        setPacientes(res.data);
        setDepartamentos([
          ...new Set(res.data.map((p) => p.departamento).filter(Boolean)),
        ]);
        setMunicipios([
          ...new Set(res.data.map((p) => p.municipio).filter(Boolean)),
        ]);
        setOcupaciones([
          ...new Set(res.data.map((p) => p.ocupacion).filter(Boolean)),
        ]);
        setCausas([
          ...new Set(res.data.map((p) => p.causa).filter(Boolean)),
        ]);
        setHospitales([
          ...new Set(res.data.map((p) => p.hospital).filter(Boolean)),
        ]);
      }
      setLoading(false);
    })();
  }, []);

  // Filtro final
  const dataFiltrada = pacientes.filter((p) => {
    if (departamento !== "all" && p.departamento !== departamento) return false;
    if (municipio !== "all" && p.municipio !== municipio) return false;
    if (ocupacion !== "all" && p.ocupacion !== ocupacion) return false;
    if (causa !== "all" && p.causa !== causa) return false;
    if (hospital !== "all" && p.hospital !== hospital) return false;
    if (genero !== "all" && p.genero !== genero) return false;
    if (
      fechas &&
      fechas.length === 2 &&
      p.fechaEntrada &&
      dayjs(p.fechaEntrada).isValid()
    ) {
      const entrada = dayjs(p.fechaEntrada);
      if (
        !entrada.isBetween(
          dayjs(fechas[0]).startOf("day"),
          dayjs(fechas[1]).endOf("day"),
          "day",
          "[]"
        )
      )
        return false;
    }
    if (edadDesde && p.edad < Number(edadDesde)) return false;
    if (edadHasta && p.edad > Number(edadHasta)) return false;
    return true;
  });

  // Stats para tarjetas
  const hombres = dataFiltrada.filter((p) => p.genero === "MASCULINO").length;
  const mujeres = dataFiltrada.filter((p) => p.genero === "FEMENINO").length;
  const total = dataFiltrada.length;

  // Columnas: Paciente, Hospital, Género, Edad, Acciones
  const columns = [
    {
      title: "Paciente",
      dataIndex: "nombre",
      key: "nombre",
      width: 320,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="p-5">
          <Input
            autoFocus
            placeholder="Buscar paciente"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            onBlur={() => confirm()}
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={() => confirm()} type="primary" size="small">Buscar</Button>
            <Button onClick={() => clearFilters()} size="small">Resetear</Button>
          </div>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) =>
        (record.nombre || "")
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "Hospital",
      dataIndex: "hospital",
      key: "hospital",
      width: 260,
    },
    {
      title: "Género",
      dataIndex: "genero",
      key: "genero",
      width: 100,
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
      width: 80,
      sorter: (a, b) => a.edad - b.edad,
      align: "center",
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 80,
      render: (_, record) => <EyeOutlined />,
    },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Franja de fechas */}
      <div className="w-[97%] max-w-[1500px] mx-auto mt-6 rounded-3xl">
        <Card className="rounded-3xl p-0 m-0 bg-white">
          <div className="flex items-center w-full p-0">
            <span className="font-semibold text-xl text-[#888] mr-4 min-w-[80px]">Fechas</span>
            <RangePicker
              value={fechas}
              onChange={(vals) => setFechas(vals ?? [dayjs(), dayjs()])}
              style={{ height: 40, borderRadius: 12, fontSize: 17, width: 260 }}
              format="YYYY/MM/DD"
            />
          </div>
        </Card>
      </div>

      {/* Card de filtros y tarjetas */}
      <div className="w-[97%] max-w-[1500px] mx-auto mt-4 rounded-3xl">
        <Card className="rounded-3xl bg-white p-8">
          <Row gutter={[16, 16]}>
            <Col span={24}><Select className="w-full h-11" value={departamento} onChange={setDepartamento} placeholder="Todos los Departamentos" showSearch>{[<Select.Option value="all" key="all">Todos los Departamentos</Select.Option>, ...departamentos.map((v) => <Select.Option value={v} key={v}>{v}</Select.Option>)]}</Select></Col>
            <Col span={24}><Select className="w-full h-11" value={municipio} onChange={setMunicipio} placeholder="Todos los Municipios" showSearch>{[<Select.Option value="all" key="all">Todos los Municipios</Select.Option>, ...municipios.map((v) => <Select.Option value={v} key={v}>{v}</Select.Option>)]}</Select></Col>
            <Col span={24}><Select className="w-full h-11" value={ocupacion} onChange={setOcupacion} placeholder="Todas las Ocupaciones" showSearch>{[<Select.Option value="all" key="all">Todas las Ocupaciones</Select.Option>, ...ocupaciones.map((v) => <Select.Option value={v} key={v}>{v}</Select.Option>)]}</Select></Col>
            <Col span={24}><Select className="w-full h-11" value={causa} onChange={setCausa} placeholder="Todas las Causas" showSearch>{[<Select.Option value="all" key="all">Todas las Causas</Select.Option>, ...causas.map((v) => <Select.Option value={v} key={v}>{v}</Select.Option>)]}</Select></Col>
            <Col span={24}>
              <Row gutter={16}>
                <Col span={12}><Select className="w-full h-11" value={hospital} onChange={setHospital} placeholder="Todos los Hospitales">{[<Select.Option value="all" key="all">Todos los Hospitales</Select.Option>, ...hospitales.map((v) => <Select.Option value={v} key={v}>{v}</Select.Option>)]}</Select></Col>
                <Col span={12}><Select className="w-full h-11" value={genero} onChange={setGenero} placeholder="Todos los Géneros"><Select.Option value="all">Todos los Géneros</Select.Option><Select.Option value="MASCULINO">MASCULINO</Select.Option><Select.Option value="FEMENINO">FEMENINO</Select.Option></Select></Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={16}>
                <Col span={12}><Input className="w-full h-11" placeholder="Edad desde" type="number" value={edadDesde} onChange={e => setEdadDesde(e.target.value)} /></Col>
                <Col span={12}><Input className="w-full h-11" placeholder="Edad hasta" type="number" value={edadHasta} onChange={e => setEdadHasta(e.target.value)} /></Col>
              </Row>
            </Col>
          </Row>
          {/* Tarjetas estadísticas */}
          <Row gutter={24} className="mt-3 w-full">
            <Col xs={24} md={8}>
              <div className="rounded-xl bg-[#89e1f7] flex flex-col justify-between min-h-[120px] shadow w-full">
                <div className="flex items-center justify-between w-full px-6 pt-4">
                  <span className="text-white font-bold text-2xl">Hombres</span>
                  <span className="text-white text-2xl flex items-center ml-2"><ManOutlined /></span>
                </div>
                <hr className="border-white w-full my-2" />
                <div className="px-6 pb-4 pt-1">
                  <span className="text-white text-2xl">Cantidad: {hombres}</span>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="rounded-xl bg-[#fcaaaa] flex flex-col justify-between min-h-[120px] shadow w-full">
                <div className="flex items-center justify-between w-full px-6 pt-4">
                  <span className="text-white font-bold text-2xl">Mujeres</span>
                  <span className="text-white text-2xl flex items-center ml-2"><WomanOutlined /></span>
                </div>
                <hr className="border-white w-full my-2" />
                <div className="px-6 pb-4 pt-1">
                  <span className="text-white text-2xl">Cantidad: {mujeres}</span>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="rounded-xl bg-[#98e6b1] flex flex-col justify-between min-h-[120px] shadow w-full">
                <div className="flex items-center justify-between w-full px-6 pt-4">
                  <span className="text-white font-bold text-2xl">Total</span>
                  <span className="text-white text-2xl flex items-center ml-2"><TeamOutlined /></span>
                </div>
                <hr className="border-white w-full my-2" />
                <div className="px-6 pb-4 pt-1">
                  <span className="text-white text-2xl">Cantidad: {total}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Tabla final */}
      <div className="w-[97%] max-w-[1500px] mx-auto my-6 rounded-3xl bg-white p-8 shadow">
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#77D9A1",
                cellFontSize: 17,
                headerColor: "#FFFFFF",
                colorText: "#3e3e3e",
                headerSortActiveBg: "#5fae81",
                headerSortHoverBg: "#5fae81",
              },
            },
          }}
        >
          <Spin spinning={loading} tip="Cargando pacientes...">
            <Table
              columns={columns}
              dataSource={dataFiltrada.map((item, idx) => ({
                ...item,
                key: item.id ?? idx,
              }))}
              scroll={{ x: true, y: 600 }}
              pagination={{
                current: page,
                pageSize: pageSize,
                total: dataFiltrada.length,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
                showSizeChanger: true,
              }}
              bordered
              size="middle"
            />
          </Spin>
        </ConfigProvider>
      </div>
    </div>
  );
}
