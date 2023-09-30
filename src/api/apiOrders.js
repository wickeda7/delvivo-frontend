import { api } from './configs/axiosConfigs';
import dayjs from 'dayjs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { merchantInfo } from '../utils/merchantInfo';
import { toast } from 'react-toastify';

export const apiOrders = {
  sendEmail: async function (order, cancel = false) {
    console.log('sendEmail', order);
    return;
    order.notifiedDate = dayjs().valueOf();
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
    console.log('sendEmail res', res);
    return res;
  },
  getStoreOrders: async function (cancel = false) {
    let val = '';
    let now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const response = await api.request({
      method: 'GET',
      //url: `/api/orders/storeorders?created=${date}&populate=*`, //[date][$eq]=2020-01-01
      url: `/api/orders/storeorders?created=${today}`, //[date][$eq]=2020-01-01
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
    const res = await response.data.data;

    const data = res.reduce((acc, cur) => {
      let orders = {};
      const { order_content } = cur;
      cur.key = cur.id;
      let isPickup = false;
      if (typeof order_content === 'string') {
        orders = JSON.parse(order_content);
      } else {
        orders = order_content;
      }
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
    const res = await api.request({
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
    return true;
  },
  putOrder: async function (val, cancel = false) {
    const {
      record: { id },
      data,
    } = val;
    // const connect = { id: 4 };
    // data.driver = connect;
    // data.driverId = '4';
    // data.putType = 'Mobile';
    // data.notifiedDate = dayjs().valueOf();

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
      const resId = res.data.data.id;
      const newData = res.data.data.attributes;
      newData.id = resId;
      if (!newData.driverId) {
        newData.driver = null;
      }
      return newData;
    } catch (error) {
      toast.error(error.response.data.error.message);
      throw new Error(error.response.data.error.message);
    }
  },
};
const cancelApiObject = defineCancelApiObject(apiOrders);
