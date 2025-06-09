import React, { useState, useEffect } from 'react';
import { Modal, Typography, Select } from 'antd';
import { useLayout } from "../../../../context/LayoutContext";
import UserApi from '../../../../api/User.api';
import PaisApi from '../../../../api/Pais.api';
import axiosInstance from '../../../../api/axiosInstance';
import { getUserFromToken } from '../../../../utilities/auth.utils';
import { validarPrivilegio } from '../../../../utilities/validarUserLog';

const { Text } = Typography;
const { Option } = Select;

function PopUpExport({ visible, onConfirm, onCancel }) {
  const [monedaLocal, setMonedaLocal] = useState(null);
  const [divisaLocal, setDivisaLocal] = useState(null);
  const [options, setOptions] = useState([]);
  const [monedaSel, setMonedaSel] = useState(null);
  const [divisaSel, setDivisaSel] = useState(null);
  const { openNotification } = useLayout();

  const fetchCurrencies = async() => {
    const userToken = getUserFromToken();
    const userProp = await UserApi.getUserRequest(userToken.userId);
    const personaId = userProp.data.id_persona;
    const paisResponse = await axiosInstance.get(`/personas/${personaId}/pais`);
    const idPais = paisResponse.data.id_pais;
    const {codigo_iso,divisa} = (await axiosInstance.get(`/pais/${idPais}/iso`)).data;
    setMonedaLocal( codigo_iso );

    
    if(validarPrivilegio(getUserFromToken(), 11)) {
      try {
        const response = await PaisApi.getPaisForTable();

        const lista = response.data.map((e) => ({
          value: `${e.codigo_iso}|${e.divisa}`,
          label: e.codigo_iso,
        }));

        setOptions(lista);
      } catch (error) {
        console.error("Error al obtener todos los países:", error);
      }
    } else {
      try{
        const lista = [
          {
            value: `${codigo_iso}|${divisa}`,
            label: codigo_iso
          },
          {
            value: 'USD|$',
            label: 'USD'
          }
        ]

        setOptions(lista)
      }catch(error){

      }

    }
  }

  useEffect(()=>{

      fetchCurrencies();
  }, [])

  const handleConfirm = async () => {
    if (!monedaSel) {
      openNotification(2, "Alerta", "Selecciona la moneda.");
      return;
    }
    let tasa = 1; 

    const [moneda, divisa] = monedaSel.split('|');

    if (monedaLocal !== "USD"  && moneda === "USD") {
      const response = await fetch(`https://api.exchangerate.host/convert?from=${monedaLocal}&to=${moneda}`);
      const data = await response.json();
      tasa = data.result;
    }


    onConfirm(tasa, moneda, divisa);    
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
        options={options}
      />
    </Modal>
  );
}

export default PopUpExport;
