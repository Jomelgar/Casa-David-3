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
} from "antd";
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
import UserApi from "../../../api/User.api";
import { getUserFromToken } from "../../../utilities/auth.utils";


dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

function Pagos() {
  const[exportVisible, setExportVisible] = useState(false);
  const[monedaLocal, setMonedaLocal] = useState(null);
  
  const { setCurrentPath } = useLayout();

  const abrirModal  = () => {
    setExportVisible(true); 
  };

  const exportarExcel = async (tasa, moneda, divisa) => {
    
    const donacionesConvertidas = totalDonacion * tasa;
    const becasConvertidas = totalBeca * tasa;
    const pagosConvertidos = dataSource.map(pago => ({
      ...pago,
      valor: (parseFloat(pago.valor) * tasa).toFixed(2),
    }));
    
    const data = {
      donaciones: donacionesConvertidas.toFixed(2),
      cortesia: becasConvertidas.toFixed(2),
      datosPagos: pagosConvertidos,
      moneda: moneda,
      divisa: divisa
    };

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
      title: "Nombre de Huesped",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese Huesped aquí"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
              style={{ marginBottom: 5 }}
            ></Input>
            <Button
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
            >
              Buscar
            </Button>
            <Button
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Borrar
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.nombre.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "DNI",
      dataIndex: "dni",
      key: "dni",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="DNI aquí"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
              style={{ marginBottom: 5 }}
            ></Input>
            <Button
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
            >
              Buscar
            </Button>
            <Button
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Borrar
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.Cama.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Fecha de Pago",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese fecha aquí"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
              style={{ marginBottom: 5 }}
            ></Input>
            <Button
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              Buscar
            </Button>
            <Button
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Borrar
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.fechaE.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor - b.valor,
      render: (text) => <div>{monedaLocal} {text.toFixed(2)}</div>,
    },
    {
      title:"No. Recibo",
      dataIndex:"recibo",
      key:"recibo",
    },
    {
      title:"Observación",
      dataIndex:"observacion",
      key:"observacion",
    }

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

    const userToken = getUserFromToken();
    const userProp = await UserApi.getUserRequest(userToken.userId);
    const personaId = userProp.data.id_persona;
    const paisResponse = await axiosInstance.get(`/personas/${personaId}/pais`);
    const idPais = paisResponse.data.id_pais;
    const {codigo_iso,divisa} = (await axiosInstance.get(`/pais/${idPais}/iso`)).data;
    setMonedaLocal( divisa );
  
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
        nombre:
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
          " " +
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_apellido,
        dni: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.dni,
        fecha: dayjs(ofrenda.fecha).format('DD-MM-YYYY'), 
        valor: parseFloat(ofrenda.valor),
        recibo: ofrenda.recibo,
        observacion: ofrenda.observacion,
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
        nombre:
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
          " " +
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_apellido,
        dni: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.dni,
        fecha: dayjs(ofrenda.fecha).format('DD-MM-YYYY'), 
        valor: parseFloat(ofrenda.valor),
        recibo: ofrenda.recibo,
        observacion: ofrenda.observacion,
      });
    });
  
    const totalBecados = becados.reduce(
      (total, ofrenda) => total + parseFloat(ofrenda.valor),
      0
    );
  
    setTotalBeca(totalBecados);
    setBecados(becados);
  
    setDataSource(data);
  
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
          components: {
            Input: {},
          },
        }}
      >
        <Card className="mt-10 rounded-xl">
        <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <Select
                style={{ width: "100%", height: "100%" }}
                showSearch
                value={selectedDepartamento}
                onChange={(value) => setSelectedDepartamento(value)}
                placeholder="Departamento"
                size="large"
                options={departamentos}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Col>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <Select
                style={{ width: "100%", height: "100%" }}
                showSearch
                value={selectedMunicipio}
                onChange={(value) => setSelectedMunicipio(value)}
                placeholder="Municipio"
                size="large"
                options={municipios}
                filterOption={(input, option) =>
                  option.label.toUpperCase().includes(input.toUpperCase())
                }
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                style={{ width: "100%", height: "100%" }}
                id="selectPatrono"
                showSearch
                searchValue={searchPatrono}
                onSearch={(e) => {
                  setSearchProcedencia(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                placeholder="Patrono"
                options={patronos}
                size="large"
                value={patrono}
                onChange={(e) => {
                  setPatrono(e);
                }}
              />
            </Col>

            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                style={{ width: "100%", height: "100%" }}
                placeholder="Genero"
                options={generos}
                value={genero}
                onChange={(e) => {
                  setGenero(e);
                }}
              />
            </Col>
          </Row>
        </Card>
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
            onChange={onChange}
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
                    Donaciones <BiDonateHeart />
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
                {donacions.length > 0 ? (
                  <div>{monedaLocal} {totalDonacion.toFixed(2)}</div>
                ) : (
                  <p> 0.0</p>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    Cortesía <BiDonateHeart />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#8ce4f3",
                  color: "white",
                  fontSize: 30,
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {becados.length > 0 ? (
                  <div>{monedaLocal} {totalBeca.toFixed(2)}</div>
                ) : (
                  <p>{monedaLocal} 0.0</p>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    Total <HiOutlineCurrencyDollar />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#fcb4b4",
                  color: "white",
                  fontSize: 30,
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {monedaLocal} {(totalBeca + totalDonacion).toFixed(2)}
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
                pagination={{ showSizeChanger: true }}
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

export default Pagos;
