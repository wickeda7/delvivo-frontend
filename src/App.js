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

import { AdminLayout, PrivateAdminRoute } from './pages/admin';
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
    path: '/admin/',
    element: (
      <PrivateAdminRoute>
        <AdminLayout />
      </PrivateAdminRoute>
    ),
  },
  { path: '*', element: <Error /> },
]);
