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

function PopUpExport({ visible, onConfirm, onCancel, monedaOrigen }) {
  //const [monedaLocal, setMonedaLocal] = useState(null);
  //const [divisaLocal, setDivisaLocal] = useState(null);
  const [options, setOptions] = useState([]);
  const [monedaSel, setMonedaSel] = useState(null);
  //const [divisaSel, setDivisaSel] = useState(null);
  const { openNotification } = useLayout();

  const API_KEY = '44948c701865425a8109ae020dedea23';

  const fetchCurrencies = async() => {
    const response = await PaisApi.getPaisForTable();
    const paises = response.data;
    
    if(validarPrivilegio(getUserFromToken(), 11)) {
      try {
        const lista = paises.map((e) => ({
          value: `${e.codigo_iso}|${e.divisa}`,
          label: e.codigo_iso,
        }));

        setOptions(lista);
      } catch (error) {
        console.error("Error al obtener todos los países:", error);
      }
    } else {
      try{
        const match = paises.find(p => p.codigo_iso === monedaOrigen);
        const lista = [
          {
            value: `${monedaOrigen}|${match.divisa}`,
            label: monedaOrigen
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

    if (monedaOrigen !== moneda) {
      const response = await fetch(`https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${monedaOrigen},${moneda}`);
      const data = await response.json();

      const tasaMonedaOrigen = parseFloat(data.rates[monedaOrigen]);
      const tasaMonedaDestino = parseFloat(data.rates[moneda]);

      // Calcular la tasa de conversión entre las dos monedas
      tasa = tasaMonedaDestino / tasaMonedaOrigen;
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
      okButtonProps={{ style: { backgroundColor: "#77D9A1", borderColor: "#77D9A1", color: "white" } }}
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
