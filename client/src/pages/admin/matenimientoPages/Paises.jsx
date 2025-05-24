import React, { useState, useEffect } from 'react';
import { Button, Input, Table, ConfigProvider, Space } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusCircleFilled, PlusCircleOutlined, StopOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

function Paises() {
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const res = await fetch('../listado.json');
      const data = await res.json();
      const procesado = data.map((p) => ({
        key: p.id_pais,
        nombre: p.nombre,
        divisa: p.divisa,
        num_hospitales: 0,
        num_casas: 0
      }));
      setDataSource(procesado);
    };
    cargarDatos();
  }, []);

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
      dataIndex: 'divisa',
      key: 'divisa',
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
      <>
      <Button icon={<PlusCircleOutlined />}
        onClick={() => handleClickPais(record)} 
        style={{
          color: '#77DA11',
          borderRadius: '10%',
          width: '10px',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}/>
        <Button type="primary" icon={<DeleteOutlined/>}  
       style={{ 
        color: '#DA1133',
          borderRadius: '10%',
           background: 'none',
          boxShadow: 'none',
          width: '30px',
          border: 'none',
          cursor: 'pointer',
          padding: 0
       }}/>
       <Button type="primary" icon={<EditOutlined/>}  
       style={{ 
        color: 'black',
        background: 'none',
          boxShadow: 'none',
          borderRadius: '10%',
          width: '10px',
          border: 'none',
          cursor: 'pointer',
          padding: 0
       }}/>
       </>
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
        />
      </ConfigProvider>
    </div>
    <div>
       <Space size= "large">
        <Button type="primary" icon={<PlusCircleOutlined/>}  onClick={handleClickAdd}
        style={{ 
          marginBottom: 16, 
          scale: '2',
          background: 'none',
          color: '#77D9A1',
          boxShadow: 'none'
        }}/>
        <Button type="primary" icon={<DeleteOutlined/>}  onClick={handleClickDelete}
        style={{ 
          marginBottom: 16,
          scale: '2', 
          background: 'none',
          color: '#DA1133',
          boxShadow: 'none'
        }}/>
       </Space>
    </div>
    </>
  );
}

export default Paises;