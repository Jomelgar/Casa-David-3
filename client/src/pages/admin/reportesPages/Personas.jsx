import React, { useState, useEffect } from "react";
import { Input, Table, Button, ConfigProvider, Modal } from "antd";
import "../Usuarios.css";
import {
  SearchOutlined,
  DownloadOutlined,
  UserOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import PersonaApi from "../../../api/Persona.api";
import ProcedenciaApi from "../../../api/Procedencia.api";
import { getMunicipioById } from "../../../api/municipioApi";
import { getDepartamentoById } from "../../../api/departamentoApi";
import InformacionPersonal from "../../../components/perfil/InformacionPersonal";
import AccionesPersona from "../../../components/perfil/AccionesPersona";
import TablaReservacion from "../../../components/Tablas/TablaReservacion";
import { useLayout } from "../../../context/LayoutContext";
import * as XLSX from "xlsx";
import { Content } from "antd/es/layout/layout";
import PaisApi from "../../../api/Pais.api";             // para listar países
import { getUserFromToken } from "../../../utilities/auth.utils";  // para obtener token
import { validarPrivilegio } from "../../../utilities/validarUserLog"; // para chequear rol de master
import { Select, Card, Row, Col } from "antd";            // componentes Antd
import { GlobalOutlined } from "@ant-design/icons";       // icono del filtro


function Personas() {
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState(-1);
  const [filteredData, setFilteredData] = useState([]); // datos filtrados por país
  const { setCurrentPath } = useLayout();
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [changeUser, setChangeUser] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [idPaisUsuario, setIdPaisUsuario] = useState(-1);
  //const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { isXS, isTableMid } = useLayout();

  const cargarProcedencia = async (dataSource) => {
    try {
      const response = await PersonaApi.getPersonasRequest();
      if (!response) {
        throw new Error("No se pudo cargar la informacion de la Persona");
      }
      if (response.status === 201) {
        const personas = response.data;
  
        // Obtener los municipios y departamentos para las personas
        const personasConProcedencia = await Promise.all(
          personas.map(async (persona) => {
            console.log(persona);
            if (persona.municipio_id === null) {
              return {
                ...persona,
                procedencia: "N/A",
              };
            }

            const municipio = await getMunicipioById(persona.municipio_id);
            const departamento = await getDepartamentoById(municipio.departamento_id);
            return {
              ...persona,
              procedencia: `${departamento.nombre}, ${municipio.nombre}`,
            };
          })
        );
  
        setDataSource(personasConProcedencia);
        setDataSource(
    personasConProcedencia.map(p => ({ ...p, key: p.id_persona }))
  );
                setFilteredData(personasConProcedencia);
                 setFilteredData(
    personasConProcedencia.map(p => ({ ...p, key: p.id_persona }))
  );

      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportToExcel = (dataSource) => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Personas");
    XLSX.writeFile(wb, "personas.xlsx");
  };

  const cargarInformacion = async () => {
    try {
      const response = await PersonaApi.getPersonasRequest();
      if (!response) {
        throw new Error("No se pudo cargar la informacion de la Persona");
      }
      if (response.status === 201) {
        const Personas = response.data.map((item) => ({
          key: item.id_persona,
          id_persona: item.id_persona,
          dni: item.dni,
          primer_nombre: item.primer_nombre,
          segundo_nombre: item.segundo_nombre,
          primer_apellido: item.primer_apellido,
          municipio_id: item.municipio_id,
          genero: item.genero,
          direccion: item.direccion,
          segundo_apellido: item.segundo_apellido,
          telefono: item.telefono,
          fecha_nacimiento: item.fecha_nacimiento,
          id_ocupacion: item.id_ocupacion,
          iglesia: item.iglesia,
        }));
        cargarProcedencia(Personas);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonClick = async (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
    setChangeUser(record);
    setIsEditable(false);
  };

  var accent_map = {
    á: "a",
    é: "e",
    è: "e",
    í: "i",
    ó: "o",
    ú: "u",
    Á: "a",
    É: "e",
    Í: "i",
    Ó: "o",
    Ú: "u",
  };
  function accent_fold(s) {
    if (!s) {
      return "";
    }
    var ret = "";
    for (var i = 0; i < s.length; i++) {
      ret += accent_map[s.charAt(i)] || s.charAt(i);
    }
    return ret;
  }
    
useEffect(() => {
  const fetchPaises = async () => {
    // 1) Obtener país del usuario (master)
    const token = getUserFromToken();
    const userProp = await PersonaApi.getPersonaRequest(token.userId);
    const paisResp = await PersonaApi.getPaisByPersona(userProp.data.id_persona);
    const idPais = paisResp.data.id_pais;
    // lo guardamos en el estado para usarlo luego en el filtro
    setIdPaisUsuario(idPais);

    // 2) Obtener todas las opciones de países
    const respTodos = await PaisApi.getPaisForTable();
    const opts = respTodos.data.map(p => ({
      value: p.id_pais,
      label: p.nombre
    }));
    // anteponer "Todos los Países"
    opts.unshift({ value: -1, label: "Todos los Países" });

    setPaises(opts);

    // 3) Preseleccionar sólo si eres MASTER; si no, dejar "-1" = "Todos"
    if (validarPrivilegio(getUserFromToken(), 11)) {
      setSelectedPais(idPais);
    } else {
      setSelectedPais(-1);
    }
  };

  fetchPaises();
}, []);  // Sólo a la primera carga



  useEffect(() => {
    cargarInformacion();
  }, []);

   // Cada vez que cambien `selectedPais`, `dataSource` o `paises`, actualiza `filteredData`
useEffect(() => {
  // 1) si no tengo privilegio "master", muestro todo
  if (!validarPrivilegio(getUserFromToken(), 11)) {
    setFilteredData(dataSource);
    return;
  }

  // 2) soy master → al elegir "Todos" o mi propio país, muestro todo
  if (selectedPais === -1 || selectedPais === idPaisUsuario) {
    setFilteredData(dataSource);
    return;
  }

  // 3) soy master y elegí otro país → filtro por procedencia (nombre de país)
  const labelPais = paises.find(p => p.value === selectedPais)?.label;
  setFilteredData(
    dataSource.filter(item => item.procedencia?.includes(labelPais))
  );
}, [selectedPais, dataSource, paises, idPaisUsuario]);



  const columns = [
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
              placeholder="Ingrese el dni"
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
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.dni.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Primer Nombre",
      dataIndex: "primer_nombre",
      key: "primer_nombre",
      sorter: (a, b) => a.primer_nombre.localeCompare(b.primer_nombre),
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
              placeholder="Ingrese el primer nombre"
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
            ></Input>

            <Button
              onClick={() => {
                confirm();
              }}
              className="buscar_button"
              type="primary"
            >
              Buscar
            </Button>
            <Button
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.primer_nombre
          .toLowerCase()
          .includes(accent_fold(value.toLowerCase()));
      },
    },
    {
      title: "Segundo Nombre",
      dataIndex: "segundo_nombre",
      key: "segundo_nombre",
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
              placeholder="Ingrese el segundo nombre"
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
            ></Input>

            <Button
              onClick={() => {
                confirm();
              }}
              type="primary"
              className="buscar_button"
            >
              Buscar
            </Button>
            <Button
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.segundo_nombre
          .toLowerCase()
          .includes(accent_fold(value.toLowerCase()));
      },
    },
    {
      title: "Primer Apellido",
      dataIndex: "primer_apellido",
      key: "primer_apellido",
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
              placeholder="Ingrese el primer apellido"
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
            ></Input>

            <Button
              onClick={() => {
                confirm();
              }}
              type="primary"
              className="buscar_button"
            >
              Buscar
            </Button>
            <Button
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return accent_fold(record.primer_apellido.toLowerCase()).includes(
          accent_fold(value.toLowerCase())
        );
      },
    },
    {
      title: "Genero",
      dataIndex: "genero",
      key: "genero",
      render: (genero) => {
        return <p>{genero === "MASCULINO" ? "MASCULINO" : "FEMENINO"}</p>;
      },
      filters: [
        { text: "MASCULINO", value: "MASCULINO" },
        { text: "FEMENINO", value: "FEMENINO" },
      ],
      onFilter: (value, record) => {
        return record.genero === value;
      },
    },
    {
      title: "Procedencia",
      dataIndex: "procedencia",
      key: "procedencia",
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
              placeholder="Ingrese asi: departamento,municipio"
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
            ></Input>

            <Button
              onClick={() => {
                confirm();
              }}
              className="buscar_button"
              type="primary"
            >
              Buscar
            </Button>
            <Button
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return accent_fold(record.procedencia.toLowerCase()).includes(
          accent_fold(value.toLowerCase())
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "accion",
      width: 130,
      render: (_, record) => (
        <UserOutlined
          style={{ marginLeft: "28px" }}
          onClick={() => handleButtonClick(record)}
        />
      ),
    },
  ];

   const handleSetChangeUser = (e, value, anterior = null) => {
    switch (e) {
      case "dni":
        setChangeUser({...changeUser,...{dni:value}});
        break;
      case "id_hospital":
        setChangeUser({ ...changeUser, ...{ id_hospital: value } });
        break;

      case "direccion":
        setChangeUser({ ...changeUser, ...{ direccion: value } });
        break;

      case "id_ocupacion":
        setChangeUser({ ...changeUser, ...{ id_ocupacion: value } });
        break;

      case "primer_nombre":
        setChangeUser({ ...changeUser, ...{ primer_nombre: value } });
        break;

      case "segundo_nombre":
        setChangeUser({ ...changeUser, ...{ segundo_nombre: value } });
        break;

      case "primer_apellido":
        setChangeUser({ ...changeUser, ...{ primer_apellido: value } });
        break;

      case "genero":
        setChangeUser({ ...changeUser, ...{ genero: value } });
        break;
      case "rol":
        setChangeUser((prevState) => ({
          ...prevState,
          rol: value,
        }));
        break;


      case "segundo_apellido":
        setChangeUser({ ...changeUser, ...{ segundo_apellido: value } });
        break;

      case "telefono":
        console.log(anterior);
        if (
          value.length > anterior.length &&
          value.length === 4 &&
          value.match(/\d{4}/) !== null
        )
          value = value + "-";
        console.log(value);

        setChangeUser({ ...changeUser, ...{ telefono: value } });
        break;

      case "nickname":
        setChangeUser({ ...changeUser, ...{ nickname: value } });
        break;
      case "fecha_nacimiento":
        setChangeUser({ ...changeUser, ...{ fecha_nacimiento: value } });
        break;
      case "iglesia":
        setChangeUser({ ...changeUser, ...{ iglesia: value } });
        break;

      case "municipio_id":
        setChangeUser({ ...changeUser, ...{ municipio_id: value } });
        break;
      case "referencia_telefonica":
        setChangeUser({...changeUser,...{referencia_telefonica: value}});
        break;
      default:
        break;
    }
    console.log(changeUser);
  };

  return (
    <div id="contentPersona">

      { /* --- filtro de país, solo para master --- */ }
  { validarPrivilegio(getUserFromToken(), 11) && (
    <ConfigProvider theme={{ token: { colorPrimary: "#77d9a1" } }}>
      <Card style={{ marginBottom: 16 }}>
        <Row>
          <Col flex="auto">
            <div style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              padding: "4px 11px",
              height: 40
            }}>
              <GlobalOutlined style={{ marginRight: 8, fontSize: 16, color: "#8c8c8c" }} />
              <Select
                showSearch
                value={selectedPais}
                onChange={setSelectedPais}
                placeholder="País"
                options={paises}
                style={{ flex: 1, border: "none", fontSize: 16 }}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                bordered={false}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  )}

      

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
        <Table
          columns={columns}
            dataSource={filteredData}
          scroll={{ x: true, y: isXS ? 200 : isTableMid ? 300 : 750 }}
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
      </ConfigProvider>
      <Modal
        width={1000}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <div className="w-full">
              <InformacionPersonal
                user={selectedRecord}
                changeUser={changeUser}
                setChangeUser={setChangeUser}
                isEditable={isEditable}
                handleSetChangeUser={handleSetChangeUser}
              />
              <AccionesPersona
                user={selectedRecord}
                changeUser={changeUser}
                setChangeUser={setChangeUser}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                idPersona={selectedRecord.id_persona}
              />
              <TablaReservacion idpersona={selectedRecord.id_persona} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Personas;
/*

*/
