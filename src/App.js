import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import 'font-awesome/css/font-awesome.min.css';
import {
  //Home,
  SingleProduct,
  Cart,
  Checkout,
  Error,
  // About,
  Products,
  PrivateRoute,
  Layout,
  layoutLoader,
} from './pages';

import {
  AdminLayout,
  PrivateAdminRoute,
  Orders,
  Drivers,
  Synch,
  Settings,
} from './pages/admin';
export const router = createBrowserRouter([
  {
    path: '/',
    loader: layoutLoader,
    errorElement: <Error />,
    element: <Layout />,
    children: [
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: '/:categoryId?',
        exact: true,
        element: <Products />,
      },
      { path: 'products/:id', element: <SingleProduct /> },
      {
        path: 'checkout',
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <PrivateAdminRoute>
        <AdminLayout />
      </PrivateAdminRoute>
    ),
    children: [
      {
        index: true,
        path: '/admin',
        element: <Orders />,
      },
      {
        path: '/admin/drivers',
        element: <Drivers />,
      },
      {
        path: '/admin/settings',
        element: <Settings />,
      },
      {
        path: '/admin/synch',
        element: <Synch />,
      },
    ],
  },
  { path: '*', element: <Error /> },
]);
