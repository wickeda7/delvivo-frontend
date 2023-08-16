import React from 'react';
import {
  Outlet,
  Await,
  defer,
  useLoaderData,
  json,
  useLocation,
} from 'react-router-dom';
import { getCategories } from '../services/apiProducts';
import { Navbar, Sidebar, Loading } from '../components';

export const loader = async () => {
  try {
    const categoriesPromise = await getCategories();
    return defer({
      categories: await categoriesPromise,
      categories: categoriesPromise,
    });
  } catch (err) {
    if (err.status == 403) {
      throw json({ message: 'Forbidden' }, { status: 403 });
    }
    throw json({ message: 'no merchant' }, { status: 426 });
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
