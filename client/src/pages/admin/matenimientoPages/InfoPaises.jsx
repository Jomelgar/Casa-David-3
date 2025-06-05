import { useState, useEffect } from 'react';
import {
  Button, Card, Col, Row, Space, Typography, Tree
} from 'antd';
import {
  GlobalOutlined, EnvironmentOutlined, ApartmentOutlined,
  PlusOutlined, DeleteOutlined, StarFilled,
  PlusCircleFilled, DeleteFilled,
  EditOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import PaisApi from '../../../api/Pais.api';
import LugarApi from '../../../api/Lugar.api';
import AgregarDepartamento from './PopUpPaises/PopUpAgregarDepartamento';
import EliminarMunicipio from './PopUpPaises/PopUpEliminarMunicipio';
import AgregarMunicipio from './PopUpPaises/AgregarMunicipio';
import EliminarDepartamento from './PopUpPaises/EliminarDepartamento';
import EditarPais from './PopUpPaises/EditarPais';

const { Title } = Typography;

function InfoPaises() {
  const location = useLocation();
  const { pais } = location.state || {};
  const [paisData, setPaisData] = useState(pais);
  const [countryData, setCountryData] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [depAddView, setDepAddView] = useState(false);
  const [depDeleteView, setDepDeleteView] = useState(false);
  const [munAddView, setMunAddView] = useState(null);
  const [munDeleteView, setMunDeleteView] = useState(null);
  const [paisEditView, setPaisEditView] = useState(null);

  const fetchLugaresByPais = async () => {
    try {
      const data = await LugarApi.getLugarByPais(pais.id_pais);
      setLugares(data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    if (!pais?.id_pais) return;
    try {
      const data = await PaisApi.getDepartamentoMunicipio(pais.id_pais);
      setCountryData(data?.data || []);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setCountryData([]);
    }
  };

  const cargarPais = async () => {
    const res = await PaisApi.getPaisForTable();
    if (res.data) {
      const paisEncontrado = await res.data.find(i => i.id_pais === pais.id_pais);
      setPaisData(paisEncontrado);
    }
  };

  const cargarDatos = async () => {
    await cargarPais();
    await fetchLugaresByPais();
    await fetchData();
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4">
      {/* Tarjetas estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="flex items-center p-4 border-2 border-[#049DBF] shadow-md rounded-lg">
          <Space>
            <GlobalOutlined className="text-green-500 text-4xl" />
            <div>
              <div className="text-sm font-semibold text-[#049DBF]">Nombre de País</div>
              <div className="text-2xl font-bold text-green-500">{paisData?.nombre || '...'}</div>
            </div>
          </Space>
        </Card>

        <Card className="flex items-center p-4 border-2 border-[#049DBF] shadow-md rounded-lg">
          <Space>
            <EnvironmentOutlined className="text-green-500 text-4xl" />
            <div>
              <div className="text-sm font-semibold text-[#049DBF]">Número de Departamentos</div>
              <div className="text-2xl font-bold text-green-500">{paisData?.total_departamentos || '0'}</div>
            </div>
          </Space>
        </Card>

        <Card className="flex items-center p-4 border-2 border-[#049DBF] shadow-md rounded-lg">
          <Space>
            <ApartmentOutlined className="text-green-500 text-4xl" />
            <div>
              <div className="text-sm font-semibold text-[#049DBF]">Número de Municipios</div>
              <div className="text-2xl font-bold text-green-500">{paisData?.num_municipios || '0'}</div>
            </div>
          </Space>
        </Card>
      </div>

      <div className="flex justify-center mb-6">
        <Button 
        icon={<EditOutlined/>}
        onClick={() =>setPaisEditView(true)}
        className="w-full h-auto bg-[#049DBF] text-white font-semibold px-8 py-2 text-lg">
          Editar País 
        </Button>
      </div>

      {/* Casas */}
      {lugares.length > 0 ? (
        <Card className="border-2 border-gray-300 rounded-lg shadow-md mb-6">
          <p className="text-[#049DBF] text-xl font-semibold mb-2">Casas en {paisData.nombre}</p>
          <hr className="mb-4" />
          <Row gutter={[16, 16]}>
            {lugares.map((l, i) => (
              <Col key={i} xs={24} sm={12} md={8}>
                <Card title={`Casa #${i + 1}`} className="border border-[#049DBF]">
                  <p><strong>Nombre:</strong> {l.codigo}</p>
                  <p><strong>Dirección:</strong> {l.direccion}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      ) : (
        <Card className="border-2 border-gray-300 shadow-md mb-6">
          <p className="text-[#049DBF] text-lg font-semibold">No hay casas registradas.</p>
        </Card>
      )}

      {/* Departamentos y Municipios */}
      <Card className="border-2 border-gray-300 shadow-md mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <p className="text-[#049DBF] text-2xl font-bold">Departamentos y Municipios</p>
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              className="bg-green-500"
              onClick={() => setDepAddView(true)}
            >
              Agregar
            </Button>
            <Button icon={<DeleteOutlined />} danger onClick={() => setDepDeleteView(true)}>
              Eliminar
            </Button>
          </Space>
        </div>
        <hr className="mb-4" />
        
        <div className="overflow-x-auto">
          <Tree
            defaultExpandAll
            className="w-full min-w-[320px]"
            treeData={countryData.map((dept) => ({
              ...dept,
              title: (
                <div
                  className="flex justify-between items-center bg-[#e6f4ff] rounded border border-[#049DBF] px-4 py-3 m-1 font-bold text-lg w-full max-w-[60vw] min-w-[300px]"
                >
                  {/* IZQUIERDA */}
                  <div className="flex items-center truncate">
                    <StarFilled className="text-green-500 mr-2 text-2xl flex-shrink-0" />
                    <span className="truncate">{dept.nombre}</span>
                  </div>

                  {/* DERECHA */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      type="text"
                      icon={<PlusCircleFilled className="text-green-500 bg-white rounded text-2xl" />}
                      className="p-0"
                      onClick={() => setMunAddView(dept)}
                    />
                    <Button
                      type="text"
                      icon={<DeleteFilled className="text-red-500 text-2xl" />}
                      className="p-0"
                      onClick={() => setMunDeleteView(dept)}
                    />
                  </div>
                </div>
              ),
              children: dept.Municipios.map((mun) => ({
                ...mun,
                title: (
                  <div
                    className="flex items-center bg-[#f0faff] rounded border border-[#049DBF] px-4 py-1 m-1 text-base w-full max-w-[55vw] min-w-[280px] cursor-pointer"
                  >
                    <EnvironmentOutlined className="text-green-500 mr-2 text-xl flex-shrink-0" />
                    <span className="truncate">{mun.nombre}</span>
                  </div>
                ),
              })),
            }))}
          />
        </div>
      </Card>
      {/* Modales */}
      {depAddView && <AgregarDepartamento visible={depAddView} Name={paisData?.nombre || '...'} onLoad={cargarDatos} onClose={() => setDepAddView(false)} id_pais={pais.id_pais} />}
      {depDeleteView && <EliminarDepartamento visible={depDeleteView} onLoad={cargarDatos} onClose={() => setDepDeleteView(false)} id_pais={pais.id_pais} />}
      {munAddView && <AgregarMunicipio visible={munAddView} onLoad={cargarDatos} onClose={() => setMunAddView(null)} />}
      {munDeleteView && <EliminarMunicipio visible={munDeleteView} onLoad={cargarDatos} onClose={() => setMunDeleteView(null)}/>}
      {paisEditView && <EditarPais visible={paisEditView} onLoad={cargarDatos} onClose={() => setPaisEditView(false)} dataN={paisData} id={pais?.id_pais}/>}
    </div>
  );
}

export default InfoPaises;
