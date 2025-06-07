import { Modal, Input, Typography, Button,ConfigProvider, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useLayout } from "../../../../context/LayoutContext";
import PaisApi from '../../../../api/Pais.api';
import {setDepartamentoMunicipio} from '../../../../api/departamentoApi';
const { Text } = Typography;

function EditarPais({ visible, onClose, onLoad,dataN, id}) {
  const { openNotification } = useLayout();
  
  const [name, setName] = useState(dataN?.nombre || '');
  const [coin, setCoin] = useState(dataN?.divisa || '');
  const [currency, setCurrency] = useState(dataN?.codigo_iso || '');
  const [formatoDNI, setFormatoDNI] = useState(dataN?.formato_dni || '');
  const [telephone, setTelephone] = useState(dataN?.referencia_telefonica || '');

  const handleOk = async () => {  
    if (!name || !telephone || !currency || !coin || !formatoDNI) {
      openNotification(2, "Alerta", "Por favor completa todos los campos obligatorios.");
      return;
    }
    const data = 
    {
      nombre: name.toUpperCase(),
      divisa: coin.toUpperCase(),
      codigo_iso: currency.toUpperCase(),
      formato_dni: formatoDNI,
      referencia_telefonica: telephone.toUpperCase(),
    };
    const value = await PaisApi.updatePais(id,data);
    if(value) openNotification(0, "Éxito", "País editado correctamente.");
    else openNotification(2, "Alerta", "País no fue editado.");
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
          colorPrimary: '#77D9A1',
        },
      },
    }}
  >
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      title={<h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Editar País</h2>}
      okText="Guardar"
      cancelText="Cancelar"
      width={700}
      centered
      bodyStyle={{
        padding: '24px 32px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Text strong>Nombre del País:</Text>
            <Input
              placeholder="Estados Unidos"
              value={name}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (value.length <= 30) {
                  setName(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  setName(e.target.value.toUpperCase());
                }
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Text strong>Referencia Telefónica:</Text>
            <Input
              placeholder="+1"
              value={telephone}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (value.length <= 5) {
                  const filtered = value.replace(/[^0-9+]/g, '');
                  setTelephone(filtered);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  setTelephone(e.target.value.toUpperCase());
                }
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Text strong>Código Iso:</Text>
            <Input
              placeholder="USD"
              value={currency}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (value.length <= 4) {
                  const filtered = value.replace(/[^A-Z]/g, '');
                  setCurrency(filtered);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  setCurrency(e.target.value.toUpperCase());
                }
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Text strong>Divisa:</Text>
            <Input
              placeholder="$."
              value={coin}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (value.length <= 10) {
                  setCoin(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  setCoin(e.target.value.toUpperCase());
                }
              }}
            />
          </div>
        </div>
        <div>
          <Text strong>Formato DNI:</Text>
          <Input
            placeholder="####-####-#####"
            value={formatoDNI}
            onChange={(e) => {
              const value = e.target.value;
              const filtrado = value.replace(/[^#-]/g, '');
              setFormatoDNI(filtrado.slice(0, 50));
            }}
          />
        </div>
      </div>
    </Modal>
  </ConfigProvider>
  );
}

export default EditarPais;