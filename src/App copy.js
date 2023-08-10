import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Sidebar, Footer } from './components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient } from '@tanstack/react-query';

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
} from './pages';

const queryClient = new QueryClient();

function App() {
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

export default App;
