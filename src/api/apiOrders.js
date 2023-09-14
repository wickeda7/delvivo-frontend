import { api } from './configs/axiosConfigs';
import dayjs from 'dayjs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { merchantInfo } from '../utils/merchantInfo';
import { toast } from 'react-toastify';
export const apiOrders = {
  sendEmail: async function (order, cancel = false) {
    const response = await api.request({
      method: 'POST',
      url: `/api/orders/sendemail`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ order }),
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
    const res = await response.data.data;
    return res;
  },
  getStoreOrders: async function (date, cancel = false) {
    const response = await api.request({
      method: 'GET',
      url: `/api/orders/storeorders?created=${date}&populate=*`, //[date][$eq]=2020-01-01
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
    const res = await response.data.data;

    const data = res.reduce((acc, cur) => {
      const { order_content } = cur;
      cur.key = cur.id;
      let isPickup = false;
      const orders = JSON.parse(order_content);
      if (orders.createdOrders.orderType.labelKey) {
        isPickup = orders.createdOrders.orderType.labelKey.includes('pick_up');
      }
      cur.created = orders.createdOrders.createdTime;
      cur.isPickup = isPickup;
      cur.order_content = orders;
      acc.push(cur);
      return acc;
    }, []);
    return data;
  },
  getOrders: async function (dates, cancel = false) {
    const { merchant_id, access_token } = merchantInfo();
    const { from, to } = dates;
    await api.request({
      method: 'GET',
      url: `/api/orders/cloverorders/${dayjs(from).valueOf()}/${dayjs(
        to
      ).valueOf()}/${merchant_id}/${access_token}`,
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
  },
  postOrder: async function (order, cancel = false) {
    const { merchant_id, access_token } = merchantInfo();
    console.log(order);
    await api.request({
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
  putOrder: async function (val, cancel = false) {
    const {
      record: { id },
      data,
    } = val;
    try {
      const res = await api.request({
        method: 'PUT',
        url: `/api/orders/${id}?populate=*`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ data }),
        signal: cancel
          ? cancelApiObject[this.get.id].handleRequestCancellation().signal
          : undefined,
      });

      return res.data.data;
    } catch (error) {
      toast.error(error.response.data.error.message);
      throw new Error(error.response.data.error.message);
    }
  },
};
const cancelApiObject = defineCancelApiObject(apiOrders);
