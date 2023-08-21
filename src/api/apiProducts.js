import { api } from './configs/axiosConfigs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { RESTURL } from '../utils/constants';

export const apiProducts = {
  getProducts: async function (token, merchantId, categoryId, cancel = false) {
    const response = await api.request({
      url: `${RESTURL}/v3/merchants/${merchantId}/categories/${categoryId}/items`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        expand: 'menuItem',
      },
      signal: cancel
        ? cancelApiObject[this.get.categoryId].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data;
  },
  getSingleProduct: async function (
    token,
    merchantId,
    productId,
    cancel = false
  ) {
    const response = await api.request({
      url: `${RESTURL}/v3/merchants/${merchantId}/items/${productId}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        expand: 'menuItem',
      },
      signal: cancel
        ? cancelApiObject[this.get.productId].handleRequestCancellation().signal
        : undefined,
    });
    return response.data;
  },
  getCategories: async function (access_token, merchant_id, cancel = false) {
    console.log('resturl', RESTURL);
    const response = await api.request({
      url: `${RESTURL}/v3/merchants/${merchant_id}/categories`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        orderBy: 'name ASC',
      },
      signal: cancel
        ? cancelApiObject[this.get.productId].handleRequestCancellation().signal
        : undefined,
    });
    return response.data.elements;
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(apiProducts);
