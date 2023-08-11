import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
} from 'react-router-dom';
import { Navbar, Sidebar, Footer } from './components';
import { ToastContainer } from 'react-toastify';
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
  loader as productsLoader,
  PrivateRoute,
  Layout,
} from './pages';

const queryClient = new QueryClient();
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: '/:categoryId?',
        exact: true,
        loader: productsLoader(queryClient),
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

function App1() {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <Routes>
        {/* <Route path='/' exact element={<Home />} />
          <Route path='about' element={<About />} /> */}
        <Route path='cart' element={<Cart />} />
        {/* <Route path='products' element={<Products />} /> */}
        <Route
          path='/'
          exact
          loader={productsLoader(queryClient)}
          element={<Products />}
        />
        <Route path='products/:id' element={<SingleProduct />} />
        <Route
          path='checkout'
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<Error />} />
      </Routes>
      <Footer />
      <ToastContainer position='top-center' />
    </Router>
  );
}

//export default App;
