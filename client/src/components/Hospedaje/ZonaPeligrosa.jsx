import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Flex,
  Card,
  Col,
  Row,
  Input,
  Select,
  ConfigProvider,
  Button,
} from "antd";
import {
  UserOutlined,
  CloseCircleOutlined,
  FileSearchOutlined,
  AuditOutlined,
} from "@ant-design/icons";

function ZonaPeligrosa({ handleListaNegra, handleDarDeAlta }) {
  const { Meta } = Card;
  return (
    <ConfigProvider
      input={{ className: "cursor-default" }}
      theme={{
        token: {
          colorPrimaryHover: "#92e1b4",
          colorPrimary: "#77d9a1",
          colorText: "#626262",
          colorBgContainerDisabled: "#fcfcfc",
          colorTextDisabled: "#939393",
        },
        components: {
          Input: {},
        },
      }}
    >
      <Card style={{ marginTop: 16 }} className="shadow-#1 bg-red-200">
        <h1 className="font-bold text-xl mb-4 text-red-800">Cuidado</h1>

        <Flex gap={"large"}>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: "#fa8787",
                  colorPrimaryHover: "#ea8383",
                  colorPrimaryBorder: "#ffff",
                },
              },
            }}
          >
            <Button
              icon={<CloseCircleOutlined />}
              type="primary"
              size={"large"}
              onClick={handleListaNegra}
            >
              Mandar a Lista Negra
            </Button>
          </ConfigProvider>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: "#fa8787",
                  colorPrimaryHover: "#ea8383",
                  colorPrimaryBorder: "#ffff",
                },
              },
            }}
          >
            <Button
              icon={<CloseCircleOutlined />}
              type="primary"
              size={"large"}
              onClick={handleDarDeAlta}
            >
             Dar de Alta 
            </Button>
          </ConfigProvider>
        </Flex>
      </Card>
    </ConfigProvider>
  );
}

export default ZonaPeligrosa;
