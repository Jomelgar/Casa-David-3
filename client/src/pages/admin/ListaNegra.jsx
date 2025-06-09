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
  Col
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import React from "react";

import * as XLSX from "xlsx";

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

const dniFormat = /^\d{4}-\d{4}-\d{5}$/;

function ListaNegra() {
  const [datos, setDatos] = useState([]);
  const [reglas, setReglas] = useState([]);
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState(-1);
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
    if (selectedPais === -1) {
      setFiltered(datos); 
    } else {
      const selectedPaisFilter = paises.find((p) => p.value === selectedPais)?.label;
      setFiltered(datos.filter((item) => item.pais === selectedPaisFilter));
    }
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
      const response = await PaisApi.getPaisForTable();
      const listaPaises = response.data.map((e) => ({
        value: e.id_pais,
        label: e.nombre,
        }));
      listaPaises.unshift({
          value: -1,
          label: "Todos los Paises",
        });
      setPaises(listaPaises);
    }catch (error) {
      console.error("Error al obtener los paises!", error)
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

  const handleSetChangePersona = async (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }
        if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
          const response = await personaApi.getPersonaByDniRequest(value);
          if (!response) {
            openNotification(
              2,
              "Persona Inexistente",
              "La persona no existe dentro de la base de datos"
            );
          }
        }
        break;

      default:
        break;
    }
    console.log(newValue);
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

      if (key === "dni" && value.match(dniFormat) === null) {
        openNotification(2, "DNI", "El formato del DNI no es valido");
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
        <Card className="mt-10 rounded-xl" style={{ marginBottom: 25}}>
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
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
          </Row>
        </Card>
      </ConfigProvider>
      );
  }

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
            <Input
              value={nuevapersona.dni}
              maxLength={15}
              type="text"
              placeholder="No. de Identidad"
              onChange={(e) => {
                handleSetChangePersona("dni", e.target.value, nuevapersona.dni);
              }}
              style={{ marginBottom: "10px" }}
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
