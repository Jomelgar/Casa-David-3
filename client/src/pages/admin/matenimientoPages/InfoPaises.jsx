import {useState, useEffect} from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Tree,
  Dropdown,
  Menu
} from 'antd';
import {
  GlobalOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,Collapse, List,PaperClipOutlined,
  ArrowRightOutlined,
  StarFilled,
  AppstoreAddOutlined,
  PlusCircleFilled,
  DeleteFilled
} from '@ant-design/icons';
import { HiOutlineBeaker, HiOutlineChip, HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { PiArrowsOutCardinalDuotone, PiDotsThree, PiDotsThreeOutlineVertical } from 'react-icons/pi';
import { useLocation } from 'react-router-dom';
import PaisApi from '../../../api/Pais.api';
import LugarApi from '../../../api/Lugar.api';
import AgregarDepartamento from './PopUpPaises/PopUpAgregarDepartamento';
import EliminarMunicipio from './PopUpPaises/PopUpEliminarMunicipio';
import AgregarMunicipio from './PopUpPaises/AgregarMunicipio'
import EliminarDepartamento from './PopUpPaises/EliminarDepartamento';

const { Title } = Typography;

function InfoPaises() {
  const location = useLocation();
  const { pais } = location.state || {};
  const [paisData, setPaisData] = useState(pais);
  const [countryData, setCountryData] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [depAddView,setDepAddView] = useState(false);
  const [depDeleteView,setDepDeleteView] = useState(false);
  const [munAddView,setMunAddView] = useState(null);
  const [munDeleteView,setMunDeleteView] = useState(null);

  const fetchLugaresByPais = async() =>
    {
      try
      {
        const data = await LugarApi.getLugarByPais(pais.id_pais);
        setLugares(data?.data || []);  
      }catch(error)
      {
        return error;
      }
    };

  async function fetchData() {
        if (!pais?.id_pais) return;
        try {
          const data = await PaisApi.getDepartamentoMunicipio(pais.id_pais);
          console.log("Datos recibidos:", data.data); 
          setCountryData(data?.data || []);
        } catch (error) {
          console.error("Error al cargar los datos:", error);
          setCountryData([]);
        }
      }

const cargarPais = async () => {
    const res = await PaisApi.getPaisForTable();
    if (res && res.data) {
      const paises = res.data;
      const pais = res.data.find(i => i.id_pais === paisData.id_pais);
      setPaisData(pais);
    } else {
      console.error('Error al obtener los datos de países');
    }
  };

const cargarDatos= async()=>
{
  await cargarPais();
  await fetchLugaresByPais();
  await fetchData();
}
useEffect(() => {
  const fetchAll = async () => {
    await cargarDatos();
  };
  fetchAll();
}, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white p-4 rounded-md shadow-md border-2 border-[#049DBF] text-left flex items-center">
          <Space>
            <div className="text-green-500 text-5xl mr-8">
              <GlobalOutlined />
            </div>
            <div>
              <div className="font-bold text-sm text-[#049DBF]">Nombre de País</div>
              <div className="text-3xl text-green-500 font-bold">{paisData?.nombre || '...'}</div>
            </div>
          </Space>
        </Card>

        <Card className="bg-white p-4 rounded-md shadow-md border-2 border-[#049DBF] text-left flex items-center">
          <Space>
            <div className="text-green-500 text-5xl mr-8">
              <EnvironmentOutlined />
            </div>
            <div>
              <div className="font-bold text-sm text-[#049DBF]">Número de Departamentos</div>
              <div className="text-3xl text-green-500 font-bold">{paisData?.total_departamentos || '0'}</div>
            </div>
          </Space>
        </Card>

        <Card className="bg-white p-4 rounded-md shadow-md border-2 border-[#049DBF] text-left flex items-center">
          <Space>
            <div className="text-green-500 text-5xl mr-8">
              <ApartmentOutlined />
            </div>
            <div>
              <div className="font-bold text-sm text-[#049DBF]">Número de Municipios</div>
              <div className="text-3xl text-green-500 font-bold">{paisData?.num_municipios || '0'}</div>
            </div>
          </Space>
        </Card>
      </div>
      {lugares.length > 0 ? (
        <div className= 'flex'>
          <Card className="bg-white p-4 rounded-md shadow-md border-2 border-[#dddddd] w-[95vw]">
            <div className="text-[#049DBF] text-2xl font-bold mb-4">Casas de {paisData.nombre}</div>
            <hr className='w-full mb-4'/>
            <Row gutter={[16, 16]}>
              {lugares.map((l, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <Card
                    className="border border-[#049DBF] rounded-md shadow-sm"
                    size="small"
                    title={`Casa #${index + 1}`}
                  >
                    <p><strong>Nombre:</strong> {l.codigo}</p>
                    <p><strong>Dirección:</strong> {l.direccion}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      ) : (
        <div className='flex'>
          <Card className="bg-white p-4 rounded-md shadow-md border-2 border-[#dddddd] w-[95vw]">
            <div className="text-[#049DBF] text-2xl font-bold mb-3">No hay casas registradas.</div>
            <hr className='w-full mb-4'/>
          </Card>
        </div>
      )}
      <div className="w-full mt-4">
  <Card className="p-4 rounded-md shadow-md border-2 border-[#dddddd] w-full">
    <div className="flex justify-between items-center mb-4 w-full">
      <p className="text-[#049DBF] text-2xl font-bold mr-2">Departamentos y Municipios</p>
      <div>
        <Space>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={() => setDepAddView(true)}
          >
            Agregar
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => {setDepDeleteView(true);}} danger>
            Eliminar
          </Button>
        </Space>
      </div>
    </div>
    <hr className='w-full mb-4'/>
        <div className="w-full flex">
          <Tree
            defaultExpandAll
            className="custom-tree w-[50vw] flex"
            treeData={countryData.map((dept) => ({
              ...dept,
              title: (
                <div
                  className="text-black flex justify-between items-center"
                  style={{
                    padding: '12px 16px',
                    margin: '5px',
                    fontWeight: 'bold',
                    fontSize: 20,
                    width: '60vw',
                    backgroundColor: '#e6f4ff',
                    borderRadius: 4,
                    border: '1px solid #049DBF'
                  }}
                >
                  <div className="flex items-center">
                    <StarFilled className="text-green-500" style={{ marginRight: 10, fontSize: 24 }} />
                    {dept.nombre}
                  </div>

                  <div className="flex items-center">
                    <Button
                      type="text"
                      icon={<PlusCircleFilled className='text-green-500 bg-white' style={{ fontSize: 24, borderRadius: 10}} />}
                      style={{ padding: 0 }}
                      onClick={async(e) => {
                        setMunAddView(dept);
                      }}
                    />
                    <Button
                      type="text"
                      icon={<DeleteFilled className= 'text-red-500'style={{ fontSize: 24}} />}
                      style={{ padding: 0 }}
                      onClick={() => setMunDeleteView(dept)}
                    />
                  </div>
                </div>
              ),
          children: dept.Municipios.map((mun) => ({
            ...mun,
            title: (
                    <div
                      style={{
                        display: 'flex',
                        padding: '12px 32x',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#e6f4ff',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 16,
                        maxWidth: 'auto',
                        width: '57vw',
                        height: '28px',
                        boxSizing: 'border-box',
                        border: '1px solid #049DBF'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '24px'}}>
                        <EnvironmentOutlined className= 'text-green-500 ' style={{ marginRight: 10, fontSize: '22px' }} />
                        {mun.nombre}
                      </div>
                    </div>
                  ),
              })),
            }))}
          />
        </div>
      </Card>
    </div>
    {depAddView && <AgregarDepartamento visible={depAddView} onLoad={cargarDatos} onClose={() => {setDepAddView(false)}} id_pais={pais.id_pais}/>}
    {depDeleteView && <EliminarDepartamento visible={depDeleteView} onLoad={cargarDatos} onClose={() => {setDepDeleteView(false)}} id_pais={pais.id_pais}/>}
    {munAddView && <AgregarMunicipio visible={munAddView} onLoad={cargarDatos} onClose={() => {setMunAddView(null)}}/>}
    {munDeleteView && <EliminarMunicipio visible={munDeleteView} onLoad={cargarDatos} onClose={() => {setMunDeleteView(null)}}/>}
  </div>
  );
}

export default InfoPaises;
