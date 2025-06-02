import { Modal, Input, Button, ConfigProvider, Select,Typography} from 'antd';
import { useState,useEffect } from 'react';
import { useLayout } from "../../../../context/LayoutContext";
import {getDepartamentoByPais} from '../../../../api/departamentoApi'
import { use } from 'react';

const { Text } = Typography;


function AgregarDepartamento({visible, onClose, id_pais})
{
    const [name,setName] = useState(null);
    const handleSubmit = () =>
    {
        //TODO
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
            <Input placeholder='Nombre'/>
        </Modal>
    </ConfigProvider>);
}

export default AgregarDepartamento;