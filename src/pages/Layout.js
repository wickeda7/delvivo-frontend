import React from 'react';
import { Outlet, Await, defer, useLoaderData } from 'react-router-dom';
import { Navbar, Sidebar, Loading } from '../components';
import { merchantInfo } from '../utils/merchantInfo';
import { setStorage } from '../utils/helpers';
import { CLOVER } from '../utils/constants';
import { apiProducts } from '../api/apiProducts';
import { apiMerchant } from '../api/apiMerchant';
export const loader = async () => {
  const info = merchantInfo();
  const url = window.location.href;
  const isMerchant = url.includes('merchant');
  if (!info) {
    const mInfo = await apiMerchant.getMechant('M04E9FZBWVB71');
    const clover = {
      merchant_id: mInfo.merchant_id,
      employee_id: mInfo.employee_id,
      client_id: mInfo.client_id,
      access_token: mInfo.access_token,
    };
    setStorage(CLOVER, JSON.stringify(clover));
    console.log('TODO: remove this after this is for Netlify only');
  }

  if (!info && !isMerchant) {
    console.log('todo:still need to check the url for merchantid');
    //get id from db
    console.log('TODO: need to check db if merchant exist');
    throw { message: 'unauthorized', status: 403 };
  }
  if (isMerchant) {
    const merchant_regex = new RegExp('merchant_id=(.*)&em.*');
    const token_regex = new RegExp('access_token=(.*)');
    const merchant_array = merchant_regex.exec(window.location.search);
    const token_array = token_regex.exec(window.location.hash);
    if (merchant_array) {
      const queryParameters = new URLSearchParams(merchant_array[0]);
      const access_token = token_array[1];
      const clover = {
        merchant_id: queryParameters.get('merchant_id'),
        employee_id: queryParameters.get('employee_id'),
        client_id: queryParameters.get('client_id'),
        code: queryParameters.get('code'),
        access_token: access_token,
      };
      setStorage(CLOVER, JSON.stringify(clover));
      try {
        apiMerchant.postMerchant(
          clover.merchant_id,
          clover.employee_id,
          clover.client_id,
          clover.access_token
        );
      } catch (error) {
        console.log(error);
      }
    }
    throw { message: 'No', status: 426 };
  }

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
