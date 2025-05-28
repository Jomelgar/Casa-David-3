import { Modal, Typography, Button, ConfigProvider, Select } from 'antd';
import { useLayout } from "../../../../context/LayoutContext";
import PaisApi from '../../../../api/Pais.api';
import { useState, useEffect } from 'react';

const { Text } = Typography;

function PopUpEliminarPais({ visible, onClose, onLoad, paises = [] }) {
  const { openNotification } = useLayout();
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    if (visible) setSelectedKey(null);
  }, [visible]);

  const handleDelete = async () => {
    if (!selectedKey) {
      openNotification(2, "Alerta", "Selecciona un país para eliminar.");
      return;
    }

    try {
      await PaisApi.deletePais(selectedKey);
      openNotification(0, "Éxito", "País eliminado correctamente.");
      await onLoad();
      onClose();
    } catch (error) {
      console.error(error);
      openNotification(2, "Error", "No se pudo eliminar el país.");
    }
  };

  const selectedName = paises.find(p => p.id_pais === selectedKey)?.nombre;

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
        width={600}
        centered
        okButtonProps={{ danger: true, disabled: !selectedKey }}
        bodyStyle={{
          padding: '24px 32px',
        }}
        title={
          <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            Eliminar País
          </h2>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Text strong style={{ fontSize: 16 }}>Selecciona un país a eliminar:</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Seleccione un país"
            value={selectedKey}
            onChange={setSelectedKey}
          >
            {paises.map((pais) => (
              <Select.Option key={pais.id_pais} value={pais.id_pais}>
                {pais.nombre}
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
                ¿Estás seguro de que deseas eliminar el país <u>{selectedName}</u>?
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

export { PopUpEliminarPais };

