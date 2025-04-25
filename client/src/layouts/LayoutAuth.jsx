import { Outlet } from 'react-router-dom';
import React from 'react';

function LayoutAuth() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-green-500'>
      <Outlet />
    </div>
  );
}

export default LayoutAuth;
