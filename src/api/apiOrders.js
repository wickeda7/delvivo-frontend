import { api } from './configs/axiosConfigs';
import dayjs from 'dayjs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { merchantInfo } from '../utils/merchantInfo';

export const apiOrders = {
  getOrders: async function (from = null, to = null, cancel = false) {
    const { merchant_id, access_token } = merchantInfo();
    const now = dayjs();
    const res = dayjs('2018-04-13 19:18');
    console.log('res', res.unix());
    console.log('now', now.unix());
    console.log(merchant_id, access_token);
    const response = await api.request({
      method: 'GET',
      url: `/api/orders/cloverorders/${res.unix()}/${now.unix()}/${merchant_id}`,
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
    console.log(response.data);
    // const response = await api.request({
    //   method: 'GET',
    //   url: `/api/orders/${merchant_id}/${from}/${to}`,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${access_token}`,
    //   },
    //   signal: cancel
    //     ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
    //         .signal
    //     : undefined,
    // });
    // const res = await response.data;
    // return res;
  },
  postOrder: async function (order, cancel = false) {
    const { merchant_id, access_token } = merchantInfo();
    console.log('merchant_id', order);
    const response = await api.request({
      method: 'POST',
      url: `/api/orders`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ merchant_id, access_token, order }),
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
  },
};
const cancelApiObject = defineCancelApiObject(apiOrders);
