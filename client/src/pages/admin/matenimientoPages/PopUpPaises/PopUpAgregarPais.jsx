import { Modal, Input, Typography, Button,ConfigProvider, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useLayout } from "../../../../context/LayoutContext";
import PaisApi from '../../../../api/Pais.api';
import {setDepartamentoMunicipio} from '../../../../api/departamentoApi';
const { Text } = Typography;

function PopUpFormulario({ visible, onClose, onLoad}) {
  const { openNotification } = useLayout();
  
  const [name, setName] = useState('');
  const [coin, setCoin] = useState('');
  const [currency, setCurrency] = useState('');
  const [formatoDNI, setFormatoDNI] = useState('');
  const [telephone, setTelephone] = useState('');
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value;
    const filtrado = value.replace(/[^#-]/g, '');
    setFormatoDNI(filtrado);
  };

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

    const pais = await PaisApi.setPais(data);
    const newJson = { ...jsonData, ID: pais.data.id_pais };
    await setDepartamentoMunicipio(newJson);

    await onLoad();
    onClose();
    openNotification(0, "Éxito", "País agregado correctamente.");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/json') {
      openNotification(2, "Alerta", "Por favor selecciona un archivo .json válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          setJsonData(json); 
          setFile(selectedFile);
          openNotification(0, "Éxito", "Archivo JSON fue cargado correctamente.");
        } catch (err) {
          openNotification(2, "Alerta", "El archivo no tiene un formato JSON válido.");
        }
      };

      reader.onerror = () => {
        openNotification(2, "Alerta", "Hubo un error al leer el archivo.");
        console.error('Error al leer el archivo.');
      };

      reader.readAsText(selectedFile);
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
      title={<h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Agregar País</h2>}
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
              onChange={(e) => setName(e.target.value.toUpperCase())}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Text strong>Referencia Telefónica:</Text>
            <Input
              placeholder="+1"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Text strong>Código Iso:</Text>
            <Input
              placeholder="USD"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Text strong>Divisa:</Text>
            <Input
              placeholder="$."
              value={coin}
              onChange={(e) => setCoin(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div>
          <Text strong>Formato DNI:</Text>
          <Input
            placeholder="####-####-#####"
            value={formatoDNI}
            onChange={handleChange}
          />
        </div>

        <div>
          <Text strong>Carga de Archivo de Municipios y Departamentos (opcional):</Text>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
            <label
              htmlFor="json-upload"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                maxWidth: '400px',
                height: '40px',
                backgroundColor: '#77D9A1',
                color: 'white',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 16,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                marginBottom: 8,
              }}
            >
              Seleccionar archivo JSON
            </label>

            <input
              id="json-upload"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none'}}
            />

            {file && (
              <div style={{ color: '#4b4b4b', fontWeight: 500, textAlign: 'center' }}>
                Archivo seleccionado:<br />
                <strong>{file.name}</strong>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 16 }}>
            ¿No sabes cómo crear el archivo JSON?
          </Text>
          <Text style={{ color: '#4b4b4b', fontSize: 14 }}>
            Descarga el siguiente tutorial en PDF para aprender a crear correctamente el archivo:
          </Text>
          <a href="/Documents/Tutorial-Pais.pdf" download style={{ textDecoration: 'underlined' }}>
            <Button type="link" style={{ paddingLeft: 0, fontSize: 15 }}>
              Tutorial-Pais.pdf <DownloadOutlined />
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  </ConfigProvider>
  );
}

export {PopUpFormulario};