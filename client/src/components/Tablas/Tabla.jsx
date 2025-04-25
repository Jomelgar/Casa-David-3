import React from 'react';
import { Table, ConfigProvider } from 'antd';

const dataSource = [
  {
    key: '1',
    identidad: '0502200199234',
    usuario: 'Elote200',
    hospital: 'Catarino Rivas',
    rol: 'Usuario',
  },
  {
    key: '2',
    identidad: '0502198712234',
    usuario: 'DoryJane',
    hospital: 'PorSalud',
    rol: 'Admin',
  },
];

const columns = [
  {
    title: 'No. Identidad',
    dataIndex: 'identidad',
    key: 'identidad',
  },
  {
    title: 'Usuario',
    dataIndex: 'usuario',
    key: 'usuario',
  },
  {
    title: 'Hospital Afiliado',
    dataIndex: 'hospital',
    key: 'hospital',
  },
  {
    title: 'Rol',
    dataIndex: 'rol',
    key: 'rol',
  },
];

const Tabla = () => {
  return (
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
      <Table dataSource={dataSource} columns={columns} />
    </ConfigProvider>
  );
};

export default Tabla;
