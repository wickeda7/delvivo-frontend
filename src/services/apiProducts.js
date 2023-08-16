import axios from 'axios';
import { RESTURL } from '../utils/constants';
import { setStorage } from '../utils/helpers';
import { merchantInfo } from '../utils/merchantInfo';
import { CLOVER } from '../utils/constants';

export async function getSingleProduct(token, merchantId, productId) {
  try {
    const response = await axios({
      url: `${RESTURL}/v3/merchants/${merchantId}/items/${productId}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        expand: 'menuItem',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getProducts(token, merchantId, categoryId) {
  try {
    const response = await axios({
      url: `${RESTURL}/v3/merchants/${merchantId}/categories/${categoryId}/items`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        expand: 'menuItem',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCategories() {
  const info = merchantInfo();
  const url = window.location.href;
  const isMerchant = url.includes('merchant');

  if (!info && !isMerchant) {
    /// still need to check the url for merchantid
    //get id from db
    throw new Error(403);
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
    }
    throw new Error(426);
  }
  const { access_token, merchant_id } = info;
  try {
    const response = await axios({
      url: `${RESTURL}/v3/merchants/${merchant_id}/categories`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        orderBy: 'name ASC',
      },
    });

    return response.data.elements;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAddress(info) {
  const { access_token, merchant_id } = info;
  try {
    const response = await axios({
      url: `${RESTURL}/v3/merchants/${merchant_id}/address`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.data;
    data.address = data.address1;
    delete data.href;
    delete data.country;
    delete data.address1;
    setStorage('address', JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
