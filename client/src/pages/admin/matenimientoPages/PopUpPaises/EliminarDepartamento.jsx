import { Modal, Button, ConfigProvider, Select, Typography } from 'antd';
import { useState, useEffect } from 'react';
import { getDepartamentoByPais } from '../../../../api/departamentoApi';

const { Text } = Typography;

function EliminarDepartamento({ visible, onClose, id_pais }) {
  const [key, setKey] = useState(null);
  const [data, setData] = useState([]);

  const cargarDatos = async () => {
    const Departamento = await getDepartamentoByPais(id_pais);
    setData(Departamento);
  };

  const handleDelete = () => {
    if (!key) return;
    console.log('Eliminando departamento:', key);
    // TODO: llamada a API para eliminar departamento usando key.departamento_id
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
        title={
          <h2
            style={{
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Eliminar Departamento
          </h2>
        }
        okText="Eliminar"
        cancelText="Cancelar"
        width={700}
        centered
        okButtonProps={{ danger: true, disabled: !key }}
        bodyStyle={{
          padding: '24px 32px',
        }}
      >
        <Select
          className="w-full mt-10 mb-5"
          placeholder="Selecciona un departamento"
          value={key ? JSON.stringify(key) : undefined}
          onChange={(value) => setKey(JSON.parse(value))}
        >
          {data.map((d) => (
            <Select.Option key={d.departamento_id} value={JSON.stringify(d)}>
              {d.nombre}
            </Select.Option>
          ))}
        </Select>

        {key && (
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
              ¿Estás seguro de que deseas eliminar {key.nombre}?
            </Text>
            <br />
            <Text type="secondary">Esta acción no se puede deshacer.</Text>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
}

export default EliminarDepartamento;
