import { Flex, Menu, Layout, Drawer, Button, ConfigProvider } from "antd";
import React, { useState, useEffect } from "react";
import "../App.css";
import logo from "../assets/logoCasaDavid2.png";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../context/LayoutContext";
import Cookies from "js-cookie";

const Sidebar = () => {
  const {
    isTabletMid,
    collapsed,
    setCollapsed,
    isBroken,
    setIsBroken,
    visibleDrawerSideMenu,
    setVisibleDrawerSideMenu,
    stateOpenKeys,
    onOpenChange,
    onOpenChangeDawner,
    setMarginContent,
    items,
  } = useLayout();

  const [selectedKey, setSelectedKey] = useState(() => {
    const sessionKeySelect = sessionStorage.getItem("selectedKeys");

    if (sessionKeySelect) {
      return [sessionKeySelect];
    } else {
      sessionStorage.setItem("selectedKeys", "/");
      return ["/"];
    }
  });

  const navigate = useNavigate();

  const menuTopic = (onOpenCh, statekeys) => {
    return (
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              iconSize: 25,
              collapsedIconSize: 25,
              itemColor: "#AFAFAF",
              itemHoverColor: "#afafaf",
              itemHoverBg: "rgba(119, 217, 161, 0.20)",
              itemSelectedColor: "#77d9a1",
            },
          },
        }}
      >
        <Menu
          className="flex flex-col gap-2.5"
          mode="inline"
          selectedKeys={selectedKey}
          openKeys={statekeys}
          onOpenChange={onOpenCh}
          onClick={(item) => {
            if (item.key === "/auth/") {
              Cookies.remove("token");

              sessionStorage.setItem("selectedKeys", "/");
              setSelectedKey(["/"]);
              navigate("/auth/");
              return;
            }

            setSelectedKey([item.key]);
            sessionStorage.setItem("selectedKeys", item.key);
            setVisibleDrawerSideMenu(false);

            navigate(item.key);
          }}
          items={items}
        />
      </ConfigProvider>
    );
  };

  useEffect(() => {
    if (!isBroken) {
      if (isTabletMid) {
        setCollapsed(true);
        setMarginContent(90);
      } else {
        setCollapsed(false);
        setMarginContent(230);
      }

      setVisibleDrawerSideMenu(false);
    } else {
      setCollapsed(true);
      setMarginContent(0);
    }
  });

  const { Sider } = Layout;

  return (
    <>
      <Sider
        className="h-[100vh] overflow-auto fixed left-0 bottom-0 top-0 shadow-xl"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        width={230}
        breakpoint="xs"
        collapsedWidth={isBroken ? 0 : "90px"}
        trigger={null}
        theme="light"
        collapsible
        collapsed={collapsed}
        onBreakpoint={(broken) => {
          setIsBroken(broken);
        }}
      >
        <Flex align="center" justify="center">
          <div className="mx-[30px] my-[20px]">
            <img src={logo} className="w-[66px] h-[56]" />
          </div>
        </Flex>
        {menuTopic(onOpenChange, stateOpenKeys)}
      </Sider>
      <Drawer
        title="Menu"
        placement="left"
        open={visibleDrawerSideMenu}
        onClose={() => {
          setVisibleDrawerSideMenu(false);
        }}
      >
        {menuTopic()}
      </Drawer>
    </>
  );
};

export default Sidebar;
