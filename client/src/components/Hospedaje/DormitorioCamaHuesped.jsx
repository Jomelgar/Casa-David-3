import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Card,
  Col,
  Row,
  Input,
  Select,
  ConfigProvider,
  Button,
  Flex,
} from "antd";
import {
  UserOutlined,
  FileSearchOutlined,
  AuditOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import HabitacionApi from "../../api/Habitacion.api";
import CamaApi from "../../api/Cama.api";
import { useLayout } from "../../context/LayoutContext";

function DormitorioCamaHuesped({
  huesped,
  changeHuesped,
  isEditable,
  handleSetChangeHuesped,
}) {
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";  // Este es el formato que se enviará a la base de datos.

  const [dormitorios, setDormitorios] = useState([]);
  const [camas, setCamas] = useState([]);
  const [searchDormitorio, setSearchDormitorio] = useState("");
  const [searchCama, setSearchCama] = useState("");

  const { userLog } = useLayout();

  const loadDormitorios = async () => {
    try {
      const response = await HabitacionApi.getAllHabitacionesRequest();

      if (!response || response.status < 200 || response.status >= 300) {
        return;
      }

      const dormitoriosfilter = response.data.filter(
        (dormitorio) =>
          (dormitorio.disponible &&
            dormitorio.genero === huesped.genero &&
            dormitorio.id_lugar === userLog.id_lugar) ||
          dormitorio.id_habitacion === huesped.id_habitacion
      );

      if (dormitoriosfilter.length === 0) {
        return;
      }

      setDormitorios(
        dormitoriosfilter.map((dormitorio) => {
          return {
            value: dormitorio.id_habitacion,
            label: dormitorio.nombre,
          };
        })
      );

      loadCamas(huesped.id_habitacion);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCamas = async (id_habitacion) => {
    try {
      const response = await CamaApi.getCamaRequestbyRoom(id_habitacion);

      if (!response || response.status < 200 || response.status >= 300) {
        return;
      }

      const camasfilter = response.data.data.filter(
        (cama) => cama.disponible || cama.id_cama === huesped.id_cama
      );

      if (camasfilter.length === 0) {
        setCamas([]);
        return;
      }

      setCamas(
        camasfilter.map((cama) => {
          return {
            value: cama.id_cama,
            label: cama.nomre,
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDormitorios();
  }, []);

  // Validar y convertir la fecha al formato correcto antes de usarla
  const handleDateChange = (date, fieldName) => {
    if (date && date.isValid()) {
      handleSetChangeHuesped(fieldName, date.format(dateFormat));  // Mantener el formato YYYY-MM-DD para la base de datos
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryHover: "#92e1b4",
          colorPrimary: "#77d9a1",
          colorText: "#626262",
          colorBgContainerDisabled: "#fcfcfc",
          colorTextDisabled: "#939393",
        },
      }}
    >
      <Card style={{ marginTop: 16 }} className="shadow-#1">
        <Row gutter={25} style={{ marginTop: 20 }}>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Select
              id="select"
              showSearch
              searchValue={searchDormitorio}
              onSearch={(e) => setSearchDormitorio(e.toUpperCase())}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
              }
              placeholder="Dormitorio"
              disabled={isEditable ? false : true}
              style={{ width: "100%", height: "100%" }}
              options={dormitorios}
              size="large"
              value={isEditable ? changeHuesped.id_habitacion : huesped.Habitacion.nombre}
              onChange={async (e) => {
                loadCamas(e);
                handleSetChangeHuesped("id_cama", null);
                handleSetChangeHuesped("id_habitacion", e);
              }}
            />
          </Col>

          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Select
              id="selectCama"
              showSearch
              searchValue={searchCama}
              onSearch={(e) => setSearchCama(e.toUpperCase())}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              placeholder="Cama"
              disabled={isEditable ? false : true}
              style={{ width: "100%", height: "100%" }}
              options={camas}
              size="large"
              value={isEditable ? changeHuesped.id_cama : huesped.id_cama}
              onChange={(e) => handleSetChangeHuesped("id_cama", e)}
            />
          </Col>
        </Row>

        <Row gutter={25}>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Flex
              justify=""
              align="center"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="w-1/2 text-[16px] font-bold text-white-800">
                Fecha De Entrada
              </div>
              <DatePicker
                maxDate={dayjs(isEditable ? changeHuesped.fecha_salida : huesped.fecha_salida).subtract(1, "day")}
                style={{ height: "100%", width: "100%" }}
                placeholder="Fecha de Entrada"
                disabled={isEditable ? false : true}
                format="DD-MM-YYYY"  // Mostrar en formato DD-MM-YYYY
                className="my-datepicker"
                value={dayjs(isEditable ? changeHuesped.fecha_entrada : huesped.fecha_entrada, dateFormat)}
                onChange={(e) => handleDateChange(e, "fecha_entrada")}
              />
            </Flex>
          </Col>

          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Flex
              justify=""
              align="center"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="w-1/2 text-[16px] font-bold text-white-800">
                Fecha De Salida
              </div>
              <DatePicker
                minDate={dayjs(isEditable ? changeHuesped.fecha_entrada : huesped.fecha_entrada).add(1, "day")}
                style={{ height: "100%", width: "100%" }}
                placeholder="Fecha de Salida"
                disabled={isEditable ? false : true}
                format="DD-MM-YYYY"  // Mostrar en formato DD-MM-YYYY
                className="my-datepicker"
                value={dayjs(isEditable ? changeHuesped.fecha_salida : huesped.fecha_salida, dateFormat)}
                onChange={(e) => handleDateChange(e, "fecha_salida")}
              />
            </Flex>
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
}

export default DormitorioCamaHuesped;
