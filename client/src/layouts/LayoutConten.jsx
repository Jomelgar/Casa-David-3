import React from 'react';

import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import CustomHeader from '../components/Header';
import { useLayout } from '../context/LayoutContext';
function LayoutConten() {
  const { marginContent, contextHolder } = useLayout();

  const { Header, Content } = Layout;
  return (
    <Layout
      style={{ marginLeft: marginContent, transition: 'margin-left 0.3s' }}
    >
      {contextHolder}
      <Header
        className='pt-3 pl-5 bg-white-100 shadow-md m-0'
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
        }}
      >
        <CustomHeader />
      </Header>
      <Content className='mx-2 my-5 p-5'>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default LayoutConten;
