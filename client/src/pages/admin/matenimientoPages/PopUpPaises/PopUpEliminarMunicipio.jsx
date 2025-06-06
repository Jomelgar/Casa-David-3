import { Modal, Input, Button, ConfigProvider, Select, Typography } from 'antd';
import { useState, useEffect } from 'react';
import { getMunicipiosByDepartamentoId } from '../../../../api/municipioApi';
import { useLayout } from "../../../../context/LayoutContext";
import { deleteMunicipio } from '../../../../api/municipioApi';

const { Text } = Typography;

function EliminarMunicipio({ onClose, visible, onLoad}) {
  const { openNotification } = useLayout();
  
  const [key, setKey] = useState(null);
  const [data, setData] = useState([]);

  const cargarDatos = async () => {
    const municipios = await getMunicipiosByDepartamentoId(visible.departamento_id);
    setData(municipios);
    console.log(municipios);
  };

  const handleDelete = async() => {
    if (!key) return;
    
    const response = await deleteMunicipio(key.municipio_id);
    if(response.status === 200) openNotification(0, "Éxito", `Municipio eliminado correctamente.`);
    else{ openNotification(2, "Alerta", "No se logro eliminar el Municipio solicitado."); return;}
    await onLoad();
    onClose();
    console.log('Eliminando municipio:', key.municipio_id);
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
            Eliminar Municipio de {visible.nombre}
          </h2>
        }
        okText="Eliminar"
        cancelText="Cancelar"
        width={700}
        centered
        okButtonProps={{ danger: true, disabled: !key }}
        bodyStyle={{ padding: '24px 32px' }}
      >
        <Select
          className="w-full mt-10 mb-5"
          placeholder="Selecciona un municipio"
          value={key ? JSON.stringify(key) : undefined}
          onChange={(value) => setKey(JSON.parse(value))}
        >
          {data.map((d) => (
            <Select.Option key={d.id_municipio} value={JSON.stringify(d)}>
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

export default EliminarMunicipio;
