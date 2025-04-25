import React, { useState } from 'react';
import { Card, Flex, Button, ConfigProvider } from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

import { useLayout } from '../../context/LayoutContext';
import personaApi from '../../api/Persona.api';

const { Meta } = Card;
function AccionesPersona({
  changeUser ,
  setIsEditable,
  isEditable,
  user,
  setUser,
  setChangeUser,
  idPersona = null,
  forPersonaLog = true,
}) {
  const { openNotification } = useLayout();

  const telFormat = /\d{4}-\d{4}/;
  const dniFormat = /^\d{4}-\d{4}-\d{5}$/;

  const validarCampos = async () => {
    for (const [key, value] of Object.entries(changeUser)) {
      if (
        value === '' &&
        key !== 'segundo_nombre' &&
        key !== 'segundo_apellido' &&
        key !== 'iglesia'
      ) {
        openNotification(2, 'Campos Vacios', 'No puede dejar campos vacios');
        return false;
      }

      if (key === 'telefono' && value.match(telFormat) === null) {
        openNotification(
          2,
          'Telefono',
          'El formato del telefono no es valido'
        );
        return false;
      }

      if (key === 'dni' && value.match(dniFormat) === null) {
        openNotification(2, 'DNI', 'El formato del DNI no es valido');
        return false;
      }
    }

    return true;
  };

  const handleEditar = () => {
    setIsEditable(true);
  };

  const formatearPersona = () => {
    const u = {
      ...changeUser,
      genero: changeUser.genero === "MASCULINO" || changeUser.genero === "FEMENINO" ? changeUser.genero : "MASCULINO",
    };

    return u;
  };

  const validarRespuesta = (response) => {
    if (!response) {
      openNotification(2, 'Error', 'No se pudo actualizar la informacion');
      return false;
    }

    if (response.status !== 200 && response.status !== 201) {
      openNotification(2, 'Error', 'No se pudo actualizar la informacion');
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (await validarCampos()) {
      const PersonaFormated = formatearPersona();
    //  console.log('idPersona:', )
      

      const response = await personaApi.putPersonaRequest(idPersona,PersonaFormated);
      if(validarRespuesta(response)){
        openNotification(0, 'Persona' , 'Cambios guardados');
        setIsEditable(false);
        window.location.reload();
      }
    }
  };

  const handleCancelar = () => {
    setChangeUser(user);

    setIsEditable(false);
  };

  return (
    <Card style={{ marginTop: 16 }} className='shadow-#1'>
      <Meta title='' />

      <Flex gap='large' justify='center' align='center'>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: '#36b1cc',
                colorPrimaryHover: '#027e99',
                colorPrimaryActive: '#9bd8e5',
                defaultHoverColor: '#fafafa',
              },
            },
          }}
        >
          <Button
            icon={<EditOutlined />}
            type='primary'
            size={'large'}
            style={{ display: isEditable ? 'none' : 'block' }}
            onClick={handleEditar}
          >
            Editar
          </Button>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: '#77d9a1',
                colorPrimaryHover: '#5fae81',
                colorPrimaryActive: '#9bd8e5',
                defaultHoverColor: '#fdfdfd',
              },
            },
          }}
        >
          <Button
            icon={<SaveOutlined />}
            type='primary'
            size={'large'}
            style={{ display: isEditable ? 'block' : 'none' }}
            onClick={handleGuardar}
          >
            Guardar
          </Button>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: '#fa8787',
                colorPrimaryHover: '#ea8383',
                colorPrimaryBorder: '#ffff',
              },
            },
          }}
        >
          <Button
            icon={<CloseCircleOutlined />}
            type='primary'
            size={'large'}
            style={{ display: isEditable ? 'block' : 'none' }}
            onClick={handleCancelar}
          >
            Cancelar
          </Button>
        </ConfigProvider>
      </Flex>
    </Card>
  );
}

export default AccionesPersona;
