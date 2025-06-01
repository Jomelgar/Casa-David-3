import { Modal, Input, Button, ConfigProvider, Select,Typography} from 'antd';
import { useState,useEffect } from 'react';
import { useLayout } from "../../../../context/LayoutContext";
import LugarApi from '../../../../api/Lugar.api';
import HospitalesApi from '../../../../api/Hospitales.api';
import { use } from 'react';

const { Text } = Typography;

function EliminarDepartamento({visible, onClose, handleOk})
{
    return(
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
            onOk={handleOk}
            title={<h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Eliminar Departamento</h2>}
            okText="Eliminar"
            cancelText="Cancelar"
            width={700}
            centered
            bodyStyle={{
                padding: '24px 32px',
            }}
        >
            <Select className='w-full mt-10 mb-10' placeholder="Departamento">

            </Select>
        </Modal>
    </ConfigProvider>);
}

export default EliminarDepartamento;