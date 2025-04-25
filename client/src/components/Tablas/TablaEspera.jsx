import React, { useEffect, useState } from 'react';
import { Table, ConfigProvider, Space, message } from 'antd';
import {
  UserOutlined,
  ExportOutlined,
  DeleteOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import Modal from './modalito';
//import datitosModal from './datosModal';

const columns = (
  handleExport,
  handleView,
  handleDelete,
  setOpen,
  setIsModalVisible,
  setRecordToDelete
) => [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },
  {
    title: 'Genero',
    dataIndex: 'genero',
    key: 'genero',
  },
  {
    title: 'Telefono',
    dataIndex: 'telefono',
    key: 'telefono',
  },
  {
    title: 'Fecha Entrada',
    dataIndex: 'fecha_entrada',
    key: 'fecha_entrada',
  },
  {
    title: 'Causa Paciente',
    dataIndex: 'causa_visita',
    key: 'causa_isita',
  },
  {
    title: 'Acciones',
    key: 'acciones',
    render: (text, record) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Space size='middle'>
          <ExportOutlined
            style={{ color: '#AFAFAF', fontSize: '23px' }}
            onClick={() => handleExport(record)}
          />
          <UserOutlined
            style={{ color: '#77D9A1', fontSize: '23px' }}
            //onClick={() => setIsModalVisible(true)}
            //onClick={() => handleView(record)}
          />
          <DeleteOutlined
            style={{ color: '#FA8787', fontSize: '23px' }}
            onClick={() => {
              setOpen(true);
              setRecordToDelete(record);
            }}
          />
        </Space>
      </div>
    ),
  },
];

const TablaEspera = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:3001/lista-espera');
        setData(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleExport = (record) => {
    console.log('Exportando a Lista de Disponibles:', record);
  };

  const handleView = (record) => {
    console.log('Ver Datos:', record);
  };

  const handleDelete = async (record) => {
    try {
      await axiosInstance.delete(
        `http://localhost:3001/listaEspera/${record.id_lista_espera}`
      );
      message.success('Persona borrada exitosamente');
      setData(
        data.filter((item) => item.id_lista_espera !== record.id_lista_espera)
      );
    } catch (error) {
      console.error('Error borrando persona:', error);
      message.error('Error borrando persona');
    }
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#77D9A1',
              cellFontSize: 14,
              headerColor: '#FFFFFF',
            },
          },
        }}
      >
        <Table
          dataSource={data}
          columns={columns(
            handleExport,
            handleView,
            handleDelete,
            setOpen,
            setRecordToDelete
          )}
        />
      </ConfigProvider>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className='text-center w-56'>
          <DeleteOutlined style={{ color: '#FA8787', fontSize: '56px' }} />
          <div className='mx-auto my-4 w-48'>
            <h3 className='text-lg font-black text-gray-800'>
              Confirmar Borrado
            </h3>
            <p className='text-sm text-gray-500'>
              ¿Seguro que quieres borrar a esta persona?
            </p>
          </div>
          <div className='flex gap-4'>
            <button
              className='bg-red-500 text-white w-full py-2 rounded-lg hover:bg-red-600'
              onClick={() => {
                if (recordToDelete) {
                  handleDelete(recordToDelete);
                  setOpen(false);
                }
              }}
            >
              Borrar
            </button>
            <button
              className='bg-gray-200 text-gray-700 w-full py-2 rounded-lg hover:bg-gray-300'
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <datitosModal isVisible={isModalVisible} handleClose={handleClose} />
    </div>
  );
};

export default TablaEspera;
