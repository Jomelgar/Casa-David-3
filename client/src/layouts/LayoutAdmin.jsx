import Sidebar from '../components/Sidebar';
import { Layout } from 'antd';

import '../App.css';
import React from 'react';
import { LayoutContextProvider } from '../context/LayoutContext';
import LayoutConten from './LayoutConten';

function LayoutAdmin() {
  return (
    <LayoutContextProvider>
      <Layout>
        <Sidebar />
        <LayoutConten />
      </Layout>
    </LayoutContextProvider>
  );
}

export default LayoutAdmin;
