import { Button, Input, Modal, Table, Layout, ConfigProvider } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
  DollarOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import usuariosApi from '../../../api/User.api';
import privilegiosAPI from '../../../api/Privilegios.api';
import { useNavigate } from 'react-router-dom';

import { getUserFromToken } from "../../../utilities/auth.utils.js";
import { useLayout } from '../../../context/LayoutContext';
import * as XLSX from 'xlsx';
import "../Usuarios.css"
const { Content } = Layout;

function Usuarios() {

  const userLog = getUserFromToken();

  const navigate = useNavigate();
  const { openNotification, setCurrentPath } = useLayout();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const cargarInformacion = async () => {
    try {
      const response = await usuariosApi.getUsersRequest();
      if (!response) {
        throw new Error('No se pudo cargar la informacion del usuario');
      }
      if (response.status === 201) {

        const data = response.data.filter((item) => item.id_usuario !== userLog.userId);

        const Usuarios = data.map((item) => ({
          key: item.id_usuario,
          identidad: item.Persona.dni,
          usuario: item.nickname,
          hospital: item.Hospital.nombre,
          rol: item.rol,
        }));
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
    //console.log(selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const containerCREARUSER = {
    display: 'flex',
    allignItems: 'center',
    justifyContent: 'space-between',
    lineHeight: '5px',
    color: '#b5b5b5',
    backgroundColor: '#ffffff',
    padding: '25px 50px',
    borderRadius: '15px',
    margin: '50px 10px 0px 10px',
  };

  const exportToExcel = (dataSource) => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Huespedes");
    XLSX.writeFile(wb, "Usuarios.xlsx");
  };

  const columns = [
    {
      title: 'No.identidad',
      dataIndex: 'identidad',
      key: 'identidad',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className='p-5'>
            <Input
              autoFocus
              placeholder='Ingrese Identidad aquí'
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
            <Button className="buscar_button"
              onClick={() => {
                confirm();
              }}

            >
              Buscar
            </Button>
            <Button className='delete_button'
              onClick={() => {
                clearFilters();
              }}
              type='danger'
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
      title: 'Usuario',
      dataIndex: 'usuario',
      key: 'usuario',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className='p-5'>
            <Input
              autoFocus
              placeholder='Ingrese usuario aquí'
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
            <Button className='buscar_button'
              onClick={() => {
                confirm();
              }}
            //type='primary'
            >
              Buscar
            </Button>
            <Button className='delete_button'
              onClick={() => {
                clearFilters();
              }}
              type='danger'
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
        return record.usuario.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: 'Hospital Afiliado',
      dataIndex: 'hospital',
      key: 'hospital',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className='p-5'>
            <Input
              autoFocus
              placeholder='Ingrese hospital aquí'
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
            <Button className="buscar_button"
              onClick={() => {
                confirm();
              }}
            // type='primary'
            >
              Buscar
            </Button>
            <Button className='delete_button'
              onClick={() => {
                clearFilters();
              }}
              type='danger'
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
        return record.hospital.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className='p-5'>
            <Input
              autoFocus
              placeholder='Ingrese rol aquí'
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
            <Button className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type='primary'
            >
              Buscar
            </Button>
            <Button className='delete_button'
              onClick={() => {
                clearFilters();
              }}
              type='danger'
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
        return record.rol.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (record) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: '45px' }}
              onClick={() => {
                EditarUsuario(record);
              }}
            />


          </>
        );
      },
    },
  ];

  const handleDelete = async (idUser) => {
    const responsePrivilegios = await privilegiosAPI.deleteUserPrivilegios(
      idUser
    );

    if (!responsePrivilegios || responsePrivilegios.status !== 201) {
      openNotification(3, 'Error', 'Error al eliminar privilegios');
      return;
    }

    const responseUser = await usuariosApi.deleteUserRequest(idUser);

    if (!responseUser || responseUser.status !== 201) {
      openNotification(3, 'Error', 'Error al eliminar usuario');
      return;
    }

    openNotification(0, 'Exito', 'Usuario eliminado con exito');
  };

  const handleOk = async () => {
    for (var i = 0; i < selectedRowKeys.length; i++) {
      console.log(selectedRowKeys[i]);
      await handleDelete(selectedRowKeys[i]);
    }

    cargarInformacion();
  };

  const deleteSelectedRows = async () => {
    if (selectedRowKeys.length < 1) {
      Modal.warning({
        title: 'Advertencia',
        content: 'Por favor, seleccione al menos un usuario a eliminar.',
      });
      return;
    }

    Modal.confirm({
      title: ' ¿Esta seguro de eliminar los elementos?',
      okText: 'Aceptar',
      okType: 'danger',
      onOk: handleOk,
      onCancel: () => {
        setSelectedRowKeys([]);
      },
    });
  };

  const EditarUsuario = (record) => {
    navigate(`/mantenimiento/usuario/${record.usuario}`);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        style={{ marginBottom: 16, backgroundColor: '#77D9A1' }}
        onClick={() => {
          exportToExcel(dataSource);
        }}
      >
        Exportar a Excel
      </Button>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#77D9A1',
              cellFontSize: 18,
              headerColor: '#FFFFFF',
            },
          },
        }}
      >
        <div>
          <Table
            responsive="true"
            scroll={{ x: 'max-content' }}
            dataSource={dataSource}
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onChange: handleSelectChange,
            }}
            pagination={{ pageSize: 5 }}
          />
        </div>

        <Content style={containerCREARUSER} className='shadow-xl'>
          <DeleteOutlined
            onClick={() => deleteSelectedRows()}
            style={{ color: 'red', fontSize: '36px' }}
          />
          <PlusCircleOutlined
            style={{
              fontSize: '36px',
              color: 'green',
            }}
            onClick={() => {
              navigate("/mantenimiento/usuarios/CrearUsuarios")
            }}
          >
            {' '}
          </PlusCircleOutlined>
        </Content>
      </ConfigProvider>
    </>
  );
}

export default Usuarios;
