import React, { useState, useEffect } from 'react';
import { Modal, DatePicker, Table, Space, ConfigProvider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const displayDateFormat = "DD-MM-YYYY";

const { RangePicker } = DatePicker;

const SalidasModal = ({ isVisible, handleClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
  };

  const fetchData = async () => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get('/getSalidas', {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Se Hospeda',
      dataIndex: 'se_hospeda',
      key: 'se_hospeda',
    },
    {
      title: 'Fecha de Salida',
      dataIndex: 'fecha_salida',
      key: 'fecha_salida',
      render: (text) => dayjs(text).format(displayDateFormat),
    },
  ];

  return (
    <Modal
      visible={isVisible}
      onCancel={handleClose}
      footer={null}
      centered
      width={800}
      closeIcon={<CloseOutlined style={{ fontSize: '24px' }} />}
      bodyStyle={{ textAlign: 'center' }}
    >
      <Space direction="vertical" size={30} style={{ width: '100%' }}>
        <ConfigProvider
          theme={{
            components: {
              DatePicker: {
                activeBorderColor: '#77D9A1',
                hoverBorderColor: '#77D9A1',
                cellRangeBorderColor: '#77D9A1',
                cellHoverWithRangeBg: '#77D9A1',
                cellActiveWithRangeBg: '#9AD9B5',
                activeShadow: '0 0 0 2px rgba(119, 217, 161, 1)',
              },
            },
          }}
        >
          <RangePicker onChange={handleDateChange} style={{ fontSize: '22px' }} />
        </ConfigProvider>

        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: '#77D9A1',
                headerColor: '#FFFFFF',
              },
            },
          }}
        >
          <Table columns={columns} dataSource={data} loading={loading} />
        </ConfigProvider>
      </Space>
    </Modal>
  );
};

export default SalidasModal;
