import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../components';
export const Layout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
    </>
  );
};
