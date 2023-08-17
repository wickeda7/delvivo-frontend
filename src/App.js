import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
} from 'react-router-dom';
import { Navbar, Sidebar, Footer } from './components';

import 'react-toastify/dist/ReactToastify.css';
import { QueryClient } from '@tanstack/react-query';
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

const queryClient = new QueryClient();
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

  { path: '*', element: <Error /> },
]);
