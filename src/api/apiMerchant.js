import { api } from './configs/axiosConfigs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { RESTURL } from '../utils/constants';
import { setStorage } from '../utils/helpers';

export const apiMerchant = {
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
    const response = await api.request({
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
