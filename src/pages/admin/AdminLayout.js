import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import MerchantName from './components/MerchantName';

const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <MerchantName />
      <Outlet />
    </>
  );
};

export default AdminLayout;
