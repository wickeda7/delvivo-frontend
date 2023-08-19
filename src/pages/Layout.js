import React from 'react';
import { Outlet, Await, defer, useLoaderData } from 'react-router-dom';
import { Navbar, Sidebar, Loading } from '../components';
import { initMerchant } from '../utils/merchantInfo';
import { apiProducts } from '../api/apiProducts';

export const loader = async () => {
  const url = window.location.href;
  const info = await initMerchant(url);
  const { access_token, merchant_id } = info;

  try {
    console.log('todo: add categories to reducer');
    const categoriesPromise = await apiProducts.getCategories(
      access_token,
      merchant_id
    );
    return defer({
      categories: await categoriesPromise,
    });
  } catch (err) {
    throw err;
  }
};

export const Layout = () => {
  const categories = useLoaderData();
  return (
    <React.Suspense fallback={<Loading />}>
      <Await resolve={categories}>
        <Navbar />
        <Sidebar />
        <Outlet />
      </Await>
    </React.Suspense>
  );
};
