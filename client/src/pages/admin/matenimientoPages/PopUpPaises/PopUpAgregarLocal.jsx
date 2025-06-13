import { Modal, Input, Button, ConfigProvider, Select } from 'antd';
import { useState } from 'react';
import { useLayout } from "../../../../context/LayoutContext";
import LugarApi from '../../../../api/Lugar.api';
import HospitalesApi from '../../../../api/Hospitales.api';

function PopUpAddLocal({ visible, onClose, pais, onLoad }) {
  const { openNotification } = useLayout();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState(null);

  const crearLocal = async () => {
    
    if(type === null || name.trim() === '' || address.trim() === '')
    {
      openNotification(2, "Alerta", "Por favor llene todos los campos.");
      return;
    }

    if(type === 'Casa')
    {
      const data = {
        codigo: name,
        direccion: address,
        id_pais: pais.id_pais
      };
      console.log(data);
      const res = await LugarApi.setLugar(data);
      if(res.status === 201) openNotification(0, "Éxito", "Casa agregada correctamente.");
      else openNotification(2, "Error", "No se pudo agregar la casa. Intente nuevamente.");
    }
    else if(type === 'Hospital')
    {
      const data = {
        nombre: name,
        direccion: address,
        id_pais: pais.id_pais
      };

      const res = await HospitalesApi.postHospitalesRequest(data);
      if(res.status === 201) openNotification(0, "Éxito", "Hospital agregado correctamente.");
      else openNotification(2, "Error", "No se pudo agregar el hospital. Intente nuevamente.");
    
    }

    setName('');
    setAddress('');
    setType(null);
    await onLoad();
    onClose();
  }

  return (
    <ConfigProvider
    theme={{
      components: {
        Button: {
          controlHeight: 40,
          fontSize: 16,
          colorPrimary: '#77D9A1'
        }
      }
    }}
  >
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={crearLocal}
      title={
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
          Agregar Local a {pais?.nombre}
        </h2>
      }
      okText="Guardar"
      cancelText="Cancelar"
      width={700}
      centered
      bodyStyle={{
        padding: '24px 32px'
      }}
    >
      <Select
        placeholder="Tipo de Local"
        value={type}
        onChange={(value) => setType(value)}
        style={{ marginBottom: 32, width: '100%' }}
        dropdownStyle={{ zIndex: 1500 }}
        popupMatchSelectWidth={false}
      >
        <Select.Option value="Casa">Casa</Select.Option>
        <Select.Option value="Hospital">Hospital</Select.Option>
      </Select>

      <Input
        value={name}
        maxLength={100}
        placeholder="Nombre del Local"
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: 24 }}
      />
      <Input.TextArea
        value={address}
        placeholder="Dirección"
        onChange={(e) => setAddress(e.target.value)}
        style={{ marginBottom: 16 }} 
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
    </Modal>
  </ConfigProvider>

  );
}

export { PopUpAddLocal };
