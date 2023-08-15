import axios from 'axios';
import { RESTURL } from '../utils/constants';
import { setStorage } from '../utils/helpers';

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

export async function getCategories(info) {
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
