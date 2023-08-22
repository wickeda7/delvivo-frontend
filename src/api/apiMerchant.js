import { api } from './configs/axiosConfigs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { RESTURL } from '../utils/constants';
import { setStorage } from '../utils/helpers';
import { merchantInfo } from '../utils/merchantInfo';

export const apiMerchant = {
  getOrderType: async function (cancel = false) {
    const { access_token, merchant_id } = merchantInfo();
    console.log('loginClover');
    const response = await api.request({
      url: `${RESTURL}/v3/merchants/${merchant_id}/order_types`,
      method: 'get',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const data = await response.data;
    console.log(data);
  },
  getAuthToken: async function (
    code,
    employee_id,
    merchant_id,
    cancel = false
  ) {
    const response = await api.request({
      method: 'POST',
      url: `/api/clover`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ code, employee_id, merchant_id }),
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const res = await response.data;
    return res;
  },
  getAddress: async function (info, cancel = false) {
    const { access_token, merchant_id } = info;
    const response = await api.request({
      url: `${RESTURL}/v3/merchants/${merchant_id}/address`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const data = await response.data;
    data.address = data.address1;
    delete data.href;
    delete data.country;
    delete data.address1;

    console.log('todo: address to reduce??');
    setStorage('address', JSON.stringify(data));
    return data;
  },
  getMechant: async function (id, cancel) {
    const response = await api.request({
      method: 'GET',
      url: `/api/merchants?filters[merchant_id][$eq]=${id}`,
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
    //console.log(response.data.data[0].attributes);
    return response.data.data[0].attributes;
  },
  postMerchant: async function (
    merchant_id,
    employee_id,
    client_id,
    access_token,
    cancel
  ) {
    const info = {
      merchant_id,
      employee_id,
      client_id,
      access_token,
    };
    await api.request({
      method: 'POST',
      url: `/api/merchants`,
      data: JSON.stringify({ data: info }),
      headers: {
        'Content-Type': 'application/json',
      },
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
};

const cancelApiObject = defineCancelApiObject(apiMerchant);
