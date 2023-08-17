import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { ProductsProvider } from './context/products_context';
import { FilterProvider } from './context/filter_context';
import { CartProvider } from './context/cart_context';
import { UserProvider } from './context/user_context';
import { ModalProvider } from './context/modal_context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from './App';
import { ToastContainer } from 'react-toastify';
const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 10 },
  },
});
root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <UserProvider>
      <ModalProvider>
        <ProductsProvider>
          <FilterProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </FilterProvider>
        </ProductsProvider>
      </ModalProvider>
    </UserProvider>
    <ToastContainer position='top-center' />
  </QueryClientProvider>
);
console.log('V 0.0.8');
