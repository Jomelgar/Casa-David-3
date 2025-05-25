import {
  Button,
  Input,
  Modal,
  Table,
  Layout,
  Spin,
  ConfigProvider,
  Flex,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useState, useEffect } from "react";
import huespedesApi from "../../../api/Huesped.api";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../../context/LayoutContext";
import * as XLSX from "xlsx";

import "../Usuarios.css";
const { Content } = Layout;

dayjs.extend(customParseFormat);
const displayDateFormat = "DD-MM-YYYY";

function Huespedes() {
  const navigate = useNavigate();

  const { openNotification, setCurrentPath, userLog } = useLayout();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState(undefined);
  const cargarInformacion = async () => {
    try {
      const response = await huespedesApi.getHuespedesName();
      //console.log(response);
      if (!response) {
        throw new Error("No se pudo cargar la informacion del Huesped");
      }
      if (response.status === 200) {
        const reservacionesActivas = response.data.filter(
          (item) =>
            item.activa &&
            (item.Cama
              ? item.Cama.Habitacion.id_lugar === userLog.id_lugar
              : false)
        );

        const Usuarios = reservacionesActivas.map((item) => ({
          key: item.id_reservacion,
          nombre:
            item.PacienteHuesped.Huesped.Persona.primer_nombre +
            " " +
            item.PacienteHuesped.Huesped.Persona.primer_apellido,
          Cama: item.Cama.nomre,
          id_huesped: item.PacienteHuesped.id_huesped,
          habitacion: item.Cama.Habitacion.nombre,
          fechaE: item.fecha_entrada,
          fechaS: item.fecha_salida,
        }));
        //console.log(Usuarios);
        setDataSource(Usuarios);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cargarInformacion();
  }, []);

  const handleSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const exportToExcel = (dataSource) => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Huespedes");
    XLSX.writeFile(wb, "Huespedes.xlsx");
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
      title: "Cama",
      dataIndex: "Cama",
      key: "Cama",
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
              placeholder="Ingrese cama aquí"
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
      title: "Habitacion",
      dataIndex: "habitacion",
      key: "habitacion",
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
              placeholder="Ingrese habitacion aquí"
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
        return record.habitacion.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Fecha de Ingreso",
      dataIndex: "fechaE",
      key: "fechaE",
      sorter: (a, b) => new Date(a.fechaE) - new Date(b.fechaE),
      render: (text) => dayjs(text).format(displayDateFormat),
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
      title: "Fecha de Salida",
      dataIndex: "fechaS",
      key: "fechaS",
      sorter: (a, b) => new Date(a.fechaS) - new Date(b.fechaS),
      render: (text) => dayjs(text).format(displayDateFormat),
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
        return record.fechaS.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Acciones",
      key: "actions",
      align: "center",
      width: 130,
      render: (record) => {
        return (
          <>
            <EditOutlined
              className="text-2xl"
              onClick={() => {
                EditarUsuario(record);
              }}
            />
          </>
        );
      },
    },
  ];

  const EditarUsuario = (record) => {
    navigate(`/huesped/${record.key}`);
  };

  const Pagar = (record) => {
    navigate(`/huesped/${record.id_huesped}`);
  };

  const render = () => {
    return (
      <>
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
          <div>
            <Table
              responsive="true"
              scroll={{ x: true, y: true }}
              dataSource={dataSource}
              columns={columns}
              pagination={{ showSizeChanger: true }}
            />
          </div>
        </ConfigProvider>
      </>
    );
  };

  return (
    <>
      {dataSource ? (
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
    </>
  );
}

export default Huespedes;
