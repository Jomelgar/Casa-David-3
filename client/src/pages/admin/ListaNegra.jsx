import {
  Button,
  Input,
  Modal,
  Table,
  Layout,
  ConfigProvider,
  Select,
  Card,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import React from "react";

import * as XLSX from "xlsx";
import axiosInstance from '../../api/axiosInstance';
import UserApi from "../../api/User.api";
import "./Usuarios.css";
import { useEffect, useState } from "react";
import Lista_Negra from "../../api/ListaNegra.api";
import Reglamento from "../../api/Reglas.api";
import { useLayout } from "../../context/LayoutContext";
import personaApi from "../../api/Persona.api";
import PersonaApi from "../../api/Persona.api";
import PaisApi from "../../api/Pais.api";
import { getUserFromToken } from "../../utilities/auth.utils";
import { validarPrivilegio } from "../../utilities/validarUserLog";


const { Content } = Layout;

function ListaNegra() {
  const [datos, setDatos] = useState([]);
  const [reglas, setReglas] = useState([]);
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState(-1);
  const [selectedPaisDNI, setSelectedPaisDNI] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { openNotification, setCurrentPath } = useLayout();

  const [nuevapersona, setNuevapersona] = useState({});
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [agregar, setAgregar] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    handleSetChangePersona();
    fetchData();
    fetchReglas();
    fetchPaises();
  }, []);

  useEffect(() => {
    const actualizarDNI = async () => {
      if (selectedPais !== -1) {
        const res = await PaisApi.getPais(selectedPais);
        setSelectedPaisDNI(res.data.formato_dni);

        const selectedPaisFilter = paises.find((p) => p.value === selectedPais)?.label;
        setFiltered(datos.filter((item) => item.pais === selectedPaisFilter));
      } else {
        setFiltered(datos);
      }
    };

    actualizarDNI();
  }, [selectedPais, datos, paises]);

  const fetchData = async () => {
    try {
      const response = await Lista_Negra.getListRequest();
      const flattenedData = response.data.map((item) => ({
        key: item.id_lista_negra,
        identidad: item.Persona.dni,
        nombre: item.Persona.primer_nombre + " " + item.Persona.segundo_nombre,
        apellido:
          item.Persona.primer_apellido + " " + item.Persona.segundo_apellido,
        genero: item.Persona.genero,
        observacion: item.observacion,
        regla:
          item.Reglamento.id_regla + ". " + item.Reglamento.descripcion_regla,
        pais:
          item.Persona.Lugar.Pai.nombre,
      }));
      setDatos(flattenedData);
    } catch (error) {
      console.error("Hubo un error!", error);
    }
  };

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

  const fetchPaises = async () => {
    try{
      const userToken = getUserFromToken();
      const userProp = await UserApi.getUserRequest(userToken.userId);
      const personaId = userProp.data.id_persona;
      const paisResponse = await axiosInstance.get(`/personas/${personaId}/pais`);
      const idPais = paisResponse.data.id_pais;

      const response = await PaisApi.getPaisForTable();
      const listaPaises = response.data.map((e) => ({
        value: e.id_pais,
        label: e.nombre,
        }));
      listaPaises.unshift({
          value: -1,
          label: "Todos los Paises",
        });
      setSelectedPais(idPais);
      setPaises(listaPaises);
      setSelectedPaisDNI(paisResponse.data.formato_dni);
    }catch (error) {
      console.error("Error al obtener los paises!", error)
    }
  }

  const handleSelectedPaisDNIChange = async() => {
    if(selectedPais !== -1){
      const res = await PaisApi.getPais(selectedPais);
      setSelectedPaisDNI(res.data.formato_dni);
      //console.log(selectedPaisDNI);
    } else {
      const userToken = getUserFromToken();
      const userProp = await UserApi.getUserRequest(userToken.userId);
      const personaId = userProp.data.id_persona;
      const paisResponse = await axiosInstance.get(`/personas/${personaId}/pais`);

      setSelectedPaisDNI(paisResponse.data.formato_dni);
    }
  }

  const containerLISTANEGRA = {
    textAlign: "left",
    lineHeight: "5px",
    color: "#b5b5b5",
    backgroundColor: "#ffffff",
    padding: "5px",
    borderRadius: "15px",
    margin: "10px",
  };

  const exportToExcel = (datos) => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lista_negra");
    XLSX.writeFile(wb, "Lista_negra.xlsx");
  };

  const columns = [
    {
      title: "No. Identidad",
      dataIndex: "identidad",
      key: "identidad",
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
        return record.identidad.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
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
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
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
        return record.apellido.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Género",
      dataIndex: "genero",
      key: "genero",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (record) => (
        <>
          <Button
            type="text"
            icon={
              <InfoCircleOutlined
                style={{
                  color: "#17a2b8",
                  fontSize: "18px",
                  zoom: 2,
                  marginRight: "10px",
                  marginLeft: "10px",
                }}
              />
            }
            onClick={() => {
              setSelectedPerson(record);
              console.log("Record clickeado: ",record);
              setInfoModalVisible(true);
            }}
          />
          <DeleteOutlined
            onClick={() => EliminarPersona(record)}
            style={{
              color: "red",
              fontSize: "18px",
              zoom: 2,
              marginLeft: "15px",
            }}
          />
        </>
      ),
    },
  ];

  const aplicarFormatoDNI = (valor, formato) => {
    if (valor === null || typeof valor !== 'string') return '';
    const soloDigitos = valor.replace(/\D/g, '');
    let resultado = '';
    let i = 0;
    for (const char of formato) {
      if (char === '#') {
        if (i < soloDigitos.length) {
          resultado += soloDigitos[i++];
        } else {
          break;
        }
      } else {
        if (i < soloDigitos.length) {
          resultado += char;
        }
      }
    }
    return resultado;
  };

  const handleSetChangePersona = async (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (selectedDNI === "DNI" && selectedPaisDNI) {
          newValue = aplicarFormatoDNI(value, selectedPaisDNI);
        } else if (selectedDNI === "DNI Extranjero"){
          newValue = newValue.substring(0,15)
        }
        break;

      default:
        handleSelectedPaisDNIChange()
        break;
    }
    //console.log(newValue);
    setNuevapersona({ ...nuevapersona, [key]: newValue });
  };

  const handleOk = async () => {
    for (let i = 0; i < selectedRowKeys.length; i++) {
      console.log(selectedRowKeys[i]);
      await handleDelete(selectedRowKeys[i]);
    }
    setSelectedRowKeys([]);
  };

  const handleSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleDelete = async (idPersonaList) => {
    try {
      const response = await Lista_Negra.deleteListRequest(idPersonaList);
      if (response.status >= 200 && response.status < 300) {
        openNotification(0, "Exito", "Usuario eliminado con exito");
        fetchData();
      } else {
        openNotification(3, "Error", "Error al eliminar usuario");
      }
    } catch (error) {
      openNotification(3, "Error", "Error al eliminar usuario");
    }
  };

  const deleteSelectedRows = () => {
    if (selectedRowKeys.length < 1) {
      Modal.warning({
        title: "Advertencia",
        content: "Por favor, seleccione al menos un usuario a eliminar.",
      });
      return;
    }

    Modal.confirm({
      title: "¿Está seguro de eliminar los elementos seleccionados?",
      okText: "Aceptar",
      okType: "danger",
      onOk: handleOk,
      onCancel: () => {
        setSelectedRowKeys([]);
      },
    });
  };

  const validarCampos = async () => {
    for (const [key, value] of Object.entries(nuevapersona)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido" &&
        key !== "observaciones"
      ) {
        openNotification(2, "Campos Vacios", "No puede dejar campos vacios");
        return false;
      }

      if (key === "dni") {
        if (!(await PersonaApi.getPersonaByDniRequest(value))) {
          openNotification(
            2,
            "Persona Inexistente",
            "La persona no existe dentro de la base de datos"
          );
          return false;
        }
      }

      const regexPattern = selectedPaisDNI
        ?.replace(/#/g, "\\d")
        .replace(/-/g, "\\-");

      const regex = new RegExp(`^${regexPattern}$`);

      if (key === "dni" && !regex.test(value) && selectedDNI === "DNI") {
        openNotification(2, "DNI", "El formato del DNI no es válido");
        return false;
      }
    }

    return true;
  };

  const AgregarPersona = async () => {
    if (!(await validarCampos())) {
      openNotification(
        2,
        "Error de Validación",
        "Hay errores en los campos del formulario"
      );
      return;
    }

    try {
      const personaResponse = await PersonaApi.getPersonaByDniRequest(
        nuevapersona.dni
      );
      if (!personaResponse) {
        openNotification(
          2,
          "Persona Inexistente",
          "La persona no existe dentro de la base de datos"
        );
        return;
      }

      const response = await Lista_Negra.postListRequest({
        id_persona: personaResponse.data.id_persona,
        id_regla: nuevapersona.id_regla,
        observacion: nuevapersona.observaciones,
      });

      if (response.status >= 200 && response.status < 300) {
        openNotification(
          0,
          "Éxito",
          "Persona agregada a la lista negra con éxito"
        );
        fetchData();
        setAgregar(false);
        setNuevapersona({ dni: null, id_regla: null, observaciones: "" });
      } else {
        openNotification(
          3,
          "Error",
          "Error al agregar persona a la lista negra"
        );
        setNuevapersona({ dni: null, id_regla: null, observaciones: "" });
      }
    } catch (error) {
      console.error("Error al agregar persona a la lista negra:", error);
      openNotification(
        3,
        "Error catch",
        "Error al agregar persona a la lista negra"
      );
    }
  };

  const EliminarPersona = (record) => {
    Modal.confirm({
      title: "¿Está seguro de eliminar este usuario?",
      okText: "Aceptar",
      okType: "danger",
      onOk: async () => {
        await handleDelete(record.key);
      },
    });
  };

  const resetAgregarUser = () => {
    setAgregar(false);
    setNuevapersona({ dni: null, id_regla: null, observaciones: "" });
  };

  const renderFilter = () => {
    if (!validarPrivilegio(getUserFromToken(), 11)) return null;
    
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
        <Card className="rounded-xl" style={{ marginBottom: 25}}>
          <Row>
            <Col flex={"100%"} >
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #d9d9d9", borderRadius: 4, padding: "4px 11px", height: "40px" }}>
                <GlobalOutlined style={{ marginRight: 8, fontSize: 16, color: "#8c8c8c" }} />
                <Select
                  style={{ flex: 1, fontSize: "16px", border: "none" }}
                  showSearch
                  value={selectedPais}
                  onChange={(value) => setSelectedPais(value)}
                  placeholder="País"
                  size="large"
                  options={paises}
                  bordered={false} // importante para que combine visualmente con el contenedor externo
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
            </Col>
          </Row>
        </Card>
      </ConfigProvider>
      );
  }

  const CustomCheckboxButton = ({ label, selected, onClick }) => {
    return (
      <label
        onClick={onClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "#71d9af",
          borderRadius: "6px",
          padding: "6px 12px",
          color: "white",
          width: "220px",
          fontWeight: "bold",
          cursor: "pointer",
          userSelect: "none",
          opacity: selected ? 1 : 0.6,
          border: selected ? "2px solid #4ac2cd" : "2px solid transparent",
        }}
      >
        <span
          style={{
            width: "16px",
            height: "16px",
            backgroundColor: selected ? "#4ac2cd" : "#ccc",
            borderRadius: "3px",
            marginRight: "8px",
            position: "relative",
          }}
        >
          {selected && (
            <span
              style={{
                color: "white",
                fontSize: "14px",
                position: "absolute",
                top: "3px",
                left: "6px",
              }}
            >
              ✔
            </span>
          )}
        </span>
        <span style={{ fontSize: "14px" }}>{label}</span>
      </label>
    );
  };

  const TipoDocumentoSelector = () => {
    return (
      <Row gutter={16} style={{ marginTop: 20,} }>
        <Col>
          <CustomCheckboxButton
            label="DNI"
            selected={selectedDNI === "DNI"}
            onClick={() => setSelectedDNI("DNI")}
          />
        </Col>
        <Col>
          <CustomCheckboxButton
            label="DNI Extranjero"
            selected={selectedDNI === "DNI Extranjero"}
            onClick={() => setSelectedDNI("DNI Extranjero")}
          />
        </Col>
      </Row>
    );
  };
  const [selectedDNI, setSelectedDNI] = useState("DNI");

  return (
    <>
    {renderFilter()}
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        style={{
          marginBottom: 16,
          backgroundColor: "#77D9A1",
      
        }}
        onClick={() => {
          exportToExcel(datos);
        }}
      >
        Exportar a Excel
      </Button>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#77D9A1",
              cellFontSize: 18,
              headerColor: "#FFFFFF",
              colorText: "#3e3e3e",
            },
          },
        }}
      >
        <div>
          <Modal
            title="Agregar Persona"
            visible={agregar}
            onCancel={() => {
              resetAgregarUser();
            }}
            onOk={() => {
              AgregarPersona();
              resetAgregarUser();
            }}
          >
            {TipoDocumentoSelector()}
            <Input 
              value={nuevapersona.dni}
              //maxLength={15}
              type="text"
              placeholder="No. de Identidad"
              onChange={(e) => {
                handleSetChangePersona("dni", e.target.value, nuevapersona.dni);
              }}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            />

            <Input
              value={nuevapersona?.observaciones}
              placeholder="Observaciones"
              onChange={(e) => {
                setNuevapersona((pre) => {
                  return { ...pre, observaciones: e.target.value };
                });
              }}
              style={{ marginBottom: "10px" }}
            />
            <Select
              placeholder="Regla Incumplida"
              options={reglas}
              style={{ width: "100%", marginBottom: "10px" }}
              value={nuevapersona?.id_regla}
              onChange={(value) => {
                setNuevapersona((pre) => {
                  return { ...pre, id_regla: value };
                });
              }}
            />
          </Modal>
          <Modal
            title="Información"
            visible={infoModalVisible}
            onCancel={() => setInfoModalVisible(false)}
            footer={null}
          >
            {selectedPerson && (
              <div>
                <p>No. Identidad: {selectedPerson.identidad}</p>
                <p>Nombre: {selectedPerson.nombre}</p>
                <p>Apellido: {selectedPerson.apellido}</p>
                <p>Género: {selectedPerson.genero}</p>
                <p>Infraccion: {selectedPerson.regla}</p>
                <p>Observaciones: {selectedPerson.observacion}</p>
              </div>
            )}
          </Modal>
          <Table
            dataSource={filtered}
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onChange: handleSelectChange,
            }}
            pagination={{ pageSize: 10 }}
          />
        </div>

        <Content style={containerLISTANEGRA} className="shadow-xl">
          <DeleteOutlined
            onClick={() => deleteSelectedRows()}
            style={{ color: "red", fontSize: "36px" }}
          />
          <PlusCircleOutlined
            style={{
              fontSize: "36px",
              color: "#5cb85c",
              position: "absolute",
              right: 170,
            }}
            onClick={() => setAgregar(true)}
          />
        </Content>
      </ConfigProvider>
    </>
  );
}

export default ListaNegra;
