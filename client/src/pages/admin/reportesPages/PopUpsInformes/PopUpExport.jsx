import React, { useState, useEffect } from 'react';
import { Modal, Typography, Select } from 'antd';
import { useLayout } from "../../../../context/LayoutContext";
import UserApi from '../../../../api/User.api';
import axiosInstance from '../../../../api/axiosInstance';
import { getUserFromToken } from '../../../../utilities/auth.utils';

const { Text } = Typography;
const { Option } = Select;

function PopUpExport({ visible, onConfirm, onCancel }) {
  const [monedaLocal, setMonedaLocal] = useState(null);
  const [monedaSel, setMonedaSel] = useState(null);
  const { openNotification } = useLayout();

  const fetchLocalCurrency = async() => {
    const userToken = getUserFromToken();
    const userProp = await UserApi.getUserRequest(userToken.userId);
    const personaId = userProp.data.id_persona;

    const paisResponse = await axiosInstance.get(`/personas/${personaId}/pais`);
    const idPais = paisResponse.data.idPais;
    const res = await axiosInstance.get(`/pais/${idPais}/iso`);
    setMonedaLocal(res.data.codigo_iso);
  }

  useEffect(()=>{
    fetchLocalCurrency();
  }, [])

  const handleConfirm = async () => {
    if (!monedaSel) {
      openNotification(2, "Alerta", "Selecciona la moneda.");
      return;
    }
    let tasa = 1; 

    if (monedaSel === "USD"  && monedaLocal !== "USD") {
      const response = await fetch(`https://api.exchangerate.host/convert?from=${monedaLocal}&to=USD`);
      const data = await response.json();
      const tasa = data.result;
    }
    onConfirm(tasa, monedaSel);    
    onCancel();            
  };

  return (
    <Modal
      title="Exportar a Excel"
      open={!!visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      okText="Exportar"
      cancelText="Cancelar"
    >
      <Text>Selecciona la moneda de exportación:</Text>
      <Select
        placeholder="Selecciona una moneda"
        value={monedaSel}
        onChange={setMonedaSel}
        style={{ width: '100%', marginTop: 16 }}
      >
        <Option value={monedaLocal}>{monedaLocal}</Option>
        <Option value="USD">USD</Option>
      </Select>
    </Modal>
  );
}

export default PopUpExport;
