import { useState, React, useEffect } from "react";
//import { Tabs, ConfigProvider, Flex, Input, Card, Layout } from "antd";
//import { useLayout } from "../../context/LayoutContext";
import InformacionPersonal from "../../components/perfil/InformacionPersonal";
import {
  Card,
  Col,
  Row,
  Input,
  Select,
  ConfigProvider,
  DatePicker,
} from "antd";
//import { Flex } from "antd";
import {
  IdcardOutlined,
  UserOutlined,
  SettingOutlined,
  LockOutlined,
} from "@ant-design/icons";

function FormularioHuesped() {
  const { Meta } = Card;
  const [isEditable, setIsEditable] = useState(false);
  const [tab, setTab] = useState(0);

  const dateFormat = "YYYY-MM-DD";

  const generos = [
    { value: 1, label: "Femenino" },
    { value: 2, label: "Masculino" },
  ];

  const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

  const content = [
    <div>
      <InformacionPersonal
        //user={user}
        //changeUser={changeUser}
        //setChangeUser={setChangeUser}
        isEditable={isEditable}
        //handleSetChangeUser={handleSetChangeUser}
      />
    </div>,
  ];

  return (
    <Card style={{ marginTop: 16 }} className="shadow-#1">
      <Meta title="Informacion Personal" />

      <Row gutter={25} style={{ marginTop: 20 }}>
        <Col
          xs={{ flex: "100%" }}
          lg={{ flex: "50%" }}
          style={{ marginBottom: 25, height: 50 }}
        >
          <DatePicker
            style={{ height: "100%", width: "100%" }}
            placeholder="Fecha de Entrada"
            //disabled={isEditable ? false : true}
            format={dateFormat}
            className="my-datepicker"
            //value={dayjs(isEditable ? changeUser[8] : user[8], dateFormat)}
            /*onChange={(e, d) => {
                handleSetChangeUser(8, d);
              }}*/
          />
        </Col>
        <Col
          xs={{ flex: "100%" }}
          lg={{ flex: "50%" }}
          style={{ marginBottom: 25, height: 50 }}
        >
          <DatePicker
            style={{ height: "100%", width: "100%" }}
            placeholder="Fecha de Entrada"
            //disabled={isEditable ? false : true}
            format={dateFormat}
            className="my-datepicker"
            //value={dayjs(isEditable ? changeUser[8] : user[8], dateFormat)}
            /*onChange={(e, d) => {
                handleSetChangeUser(8, d);
              }}*/
          />
        </Col>
      </Row>
    </Card>
  );
}

export default FormularioHuesped;
