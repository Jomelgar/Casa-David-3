import React, { useState, useEffect } from 'react';
import { Button, Input, Table, ConfigProvider,Layout,Space } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusCircleFilled, PlusCircleOutlined, StopOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import PaisApi from '../../../api/Pais.api';
import {PopUpFormulario} from './PopUpPaises/PopUpAgregarPais';
const { Content } = Layout;

function Paises() {
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedPais, setSelectedPais] = useState();
  const [addView, setAddView] = useState(false);

  const cargarDatos = async () => {
    const res = await PaisApi.getPaisForTable();
    if (res && res.data) {
       setDataSource(res.data);
    } else {
      console.error('Error al obtener los datos de países');
    }
  };

  useEffect(() => {
      cargarDatos();
    }, []);

  const handleAddTable = (data) => {
    setSelectedPais(data);
  }

  const handleClickPais = (pais) => {
    console.log("Clic en:", pais.nombre);
  
  };

  const handleClickAdd = () => {
    console.log("Clic en agregar");
  };
  const handleClickDelete = () => {
    console.log("Clic en eliminar");
  };

  const columnas = [
    {
      title: 'País',
      dataIndex: 'nombre',
      key: 'nombre',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar país"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            onBlur={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Buscar
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90, marginTop: 8 }}>
            Limpiar
          </Button>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) => record.nombre.toLowerCase().includes(value.toLowerCase())
    },{
      title: 'Codigo ISO',
      dataIndex: 'codigo_iso',
      key: 'codigo_iso',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar país"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            onBlur={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Buscar
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90, marginTop: 8 }}>
            Limpiar
          </Button>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) => record.divisa.toLowerCase().includes(value.toLowerCase())
    },{
      title: 'Número de hospitales',
      dataIndex: 'num_hospitales',
      key: 'num_hospitales'
    },{
      title: 'Número de casas',
      dataIndex: 'num_casas',
      key: 'num_casas',
    },{
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (text, record) => (
      <Space size="short">
        <Button
          type="text"
          icon={<PlusCircleOutlined />}
          onClick={() => handleClickPais}
          style={{
            color: 'green',
            fontSize: '18px',
          }}
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          style={{
            color: 'red',
            fontSize: '18px',
          }}
        />
        <Button
          type="text"
          icon={<EditOutlined />}
          style={{
            color: 'black',
            fontSize: '18px',
          }}
        />
      </Space>

  )
    }
  ];

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Paises');
    XLSX.writeFile(wb, 'Paises.xlsx');
  };

  return (
    <>
    <div style={{ padding: 24 }}>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#77D9A1',
              cellFontSize: 16,
              headerColor: '#ffffff',
            }
          }
        }}
      >
        <Table
          dataSource={dataSource}
          columns={columnas}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          pagination={{ pageSize: 5, position: ['bottomCenter'] }}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
    </div>
    <Content  style={
      {
        display: 'flex',
        allignItems: 'center',
        justifyContent: 'space-between',
        lineHeight: '5px',
        color: '#b5b5b5',
        backgroundColor: '#ffffff',
        padding: '25px 50px',
        borderRadius: '15px',
        margin: '50px 10px 0px 10px',
      }
    } 
    className='shadow-xl'>
        <Button
        type="text"
        icon={<DeleteOutlined style={{ fontSize: '32px' }}/>}
        style={{
          color: 'red',
          fontSize: '36px',
        }}
      />
      <Button
        type="text"
        icon={<PlusCircleOutlined style={{ fontSize: '32px' }}/>}
        style={{
          color: 'green',
          fontSize: '36px',
        }}
        onClick={() => {setAddView(true);}}
      />
      </Content>
      {addView && (
        <PopUpFormulario visible={addView} onLoad={cargarDatos} onClose={() => {setAddView(false);}}/>
      )}
    </>
  );
}

export default Paises;