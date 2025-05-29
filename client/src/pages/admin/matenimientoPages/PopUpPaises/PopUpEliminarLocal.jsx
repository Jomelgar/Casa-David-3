import { Modal, Input, Button, ConfigProvider, Select,Typography} from 'antd';
import { useState,useEffect } from 'react';
import { useLayout } from "../../../../context/LayoutContext";
import LugarApi from '../../../../api/Lugar.api';
import HospitalesApi from '../../../../api/Hospitales.api';
import { use } from 'react';

const { Text } = Typography;

function PopUpDeleteLocal({ visible, onClose, pais, onLoad }) {
  const { openNotification } = useLayout();
  const [selectedKey, setSelectedKey] = useState(null);
  const [type, setType] = useState(null);
  const [data, setData] = useState([]);
  const cargarDatos = async () => {
    if(type === null) return;
    if(type === 'Casa') {
      const lugar = await LugarApi.getLugarByPais(pais.id_pais);
      setSelectedKey(null);
      setData(Array.isArray(lugar?.data) ? lugar.data : []);
    }
    else if(type === 'Hospital') {
      const hospitales = await HospitalesApi.getHospitalByPais(pais.id_pais);
      setSelectedKey(null);
      setData(Array.isArray(hospitales?.data) ? hospitales.data : []);
    }
  };
  useEffect(() => {
    cargarDatos();
  },[type]);

  useEffect(() => {
    if (visible) setSelectedKey(null);
  }, [visible]);

  const handleDelete = async () => {
    if (!selectedKey) {
      openNotification(2, "Alerta", "Selecciona un local para eliminar.");
      return;
    }

    if(type === 'Hospital')
    {
      const response = await HospitalesApi.deleteHospitalesRequest(selectedKey);
      if(response.status === 200) {
        openNotification(1, "Éxito", "Hospital eliminado correctamente.");
      } else {
        openNotification(2, "Error", "No se pudo eliminar el hospital.");
      }
    }
    else if(type === 'Casa')
    {
      const response = await LugarApi.deleteLugar(selectedKey);
      if(response.status === 201) {
        openNotification(1, "Éxito", "Casa eliminada correctamente.");
      } else {
        openNotification(2, "Error", "No se pudo eliminar la casa.");
      }
    }

    await onLoad();
    onClose();
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            colorBgElevated: '#ffffff',
            borderRadius: 15,
            colorText: '#4b4b4b',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            fontSize: 16,
            padding: 24,
          },
          Button: {
            controlHeight: 40,
            fontSize: 16,
            colorPrimary: '#F67280',
          },
        },
      }}
    >
      <Modal
        open={visible}
        onCancel={onClose}
        onOk={handleDelete}
        okText="Eliminar"
        cancelText="Cancelar"
        width={700}
        centered
        okButtonProps={{ danger: true, disabled: !selectedKey }}
        bodyStyle={{
          padding: '24px 32px',
        }}
        title={
          <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            Eliminar Local de {pais?.nombre || '...'}
          </h2>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            placeholder="Tipo de Local"
            value={type}
            onChange={(value) => setType(value)}
            style={{width: '100%', marginBottom: 32, width: '100%' }}
            dropdownStyle={{ zIndex: 1500 }}
            popupMatchSelectWidth={false}
          >
            <Select.Option value={"Hospital"}>Hospital</Select.Option>
            <Select.Option value={"Casa"}>Casa</Select.Option>
          </Select>
          <Select
            style={{ width: '100%' }}
            placeholder="Local"
            value={selectedKey}
            onChange={setSelectedKey}
          >
            {data.map((item) => (
              <Select.Option key={item.id_lugar || item.id_hospital} value={item.id_lugar || item.id_hospital}>
                {item.codigo || item.nombre}
              </Select.Option>
            ))}
          </Select>

          {selectedKey && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                backgroundColor: '#fff5f5',
                border: '1px solid #ffccc7',
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <Text type="danger" strong style={{ fontSize: 16 }}>
                ¿Estás seguro de que deseas eliminar el Local?
              </Text>
              <br />
              <Text type="secondary">Esta acción no se puede deshacer.</Text>
            </div>
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export {PopUpDeleteLocal};