import { Modal, Input, Button, ConfigProvider, Select,Typography} from 'antd';
import { useState,useEffect } from 'react';
import {setDepartamento} from '../../../../api/departamentoApi';
import { useLayout } from "../../../../context/LayoutContext";
import { use } from 'react';

const { Text } = Typography;


function AgregarDepartamento({visible,Name,onClose, id_pais,onLoad})
{
    console.log(visible);
    const { openNotification } = useLayout();

    const [name,setName] = useState(null);
    const handleSubmit = async() =>
    {
        if(!name) {
            openNotification(2, "Alerta", "Por favor completa todos los campos obligatorios.")
            return;
        };
        const data = {"id_pais": id_pais, "nombre": name};
        const status = await setDepartamento(data);
        if(status === 200) openNotification(0, "Éxito", `Departamento agregado correctamente a ${Name}.`);
        else openNotification(2, "Alerta", "No se logro crear el municipio solicitado.");
        
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
            onOk={handleSubmit}
            title={<h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Agregar Departamento</h2>}
            okText="Guardar"
            cancelText="Cancelar"
            width={700}
            centered
            bodyStyle={{
                padding: '24px 32px',
            }}
        >
            <Input placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
        </Modal>
    </ConfigProvider>);
}

export default AgregarDepartamento;